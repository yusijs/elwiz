import { ElwizConfig, PriceInfo } from '@elwiz/common';

import { addDays, format, parseISO, subDays } from 'date-fns';
import { NordPoolResponseObject } from './nordpool';
import { EventEmitter } from 'events';
import { DeviceConfig, getHassDevice } from '@elwiz/pulse';
import { Price } from '@elwiz/database';
import { Logger } from 'winston';

export class PriceLoader {
  public price = new EventEmitter();
  public loaded = new EventEmitter();
  private readonly daysInMonth = [ undefined, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  private oneDayPrices: Array<PriceInfo> = [];
  private deviceConfig = {
    haBaseTopic: this.config.haBaseTopic,
    name: 'Price',
    uniqueId: 'elwiz_electricity_price',
    devClass: null,
    staClass: 'total',
    unitOfMeasurement: this.config.priceCurrency,
    stateTopic: 'elwizElectricityPrice'
  } as DeviceConfig;

  constructor(private config: ElwizConfig, private logger: Logger) {
  }

  get nordPoolUri() {
    return `https://www.nordpoolgroup.com/api/marketdata/page/10/${this.config.priceCurrency}`;
  }

  public async load(date?: Date) {
    this.oneDayPrices = [];
    if ( this.config.keepDays ) {
      await this.retireDays(this.config.keepDays);
    }
    if ( !date ) {
      date = addDays(new Date(), 1);
    }
    const fetchDate = format(date, 'yyyy-MM-dd');
    const priceForDate = await Price.findAll({ where: { date: fetchDate } });

    if ( priceForDate?.length > 0 ) {
      await this.announce(priceForDate as unknown as PriceInfo[]);
    } else {
      const url = `${this.nordPoolUri}/${fetchDate}`;
      const req = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'text/json',
        }
      });
      const body: NordPoolResponseObject = await req.json();
      const rows = body.data.Rows;
      for ( let i = 0; i < 24; i++ ) {
        const row = rows[ i ];
        const price = row.Columns[ this.config.priceRegion ].Value;
        const start = parseISO(row.StartTime);
        const end = parseISO(row.EndTime);
        const priceObj: PriceInfo = {
          date: format(end, `yyyy-MM-dd`),
          startTime: format(start, `yyyy-MM-dd HH:mm:ss`),
          endTime: format(end, `yyyy-MM-dd HH:mm:ss`),
          price: Number(price.toString().replace(/ /g, '').replace(/(\d),/g, '.$1'))
        };
        if ( this.config.computePrices )
          this.oneDayPrices.push(this.computePrice(priceObj));
        else
          this.oneDayPrices.push(priceObj);
      }

      this.announce(this.oneDayPrices);

      this.loaded.emit('loaded', this.oneDayPrices);
    }
  }

  public init() {
    const haTopic = 'homeassistant/sensor/ElWiz/';

    const announce = getHassDevice(this.deviceConfig);
    announce.json_attributes_topic = `${announce.stat_t}/attributes`;
    delete announce.dev_cla;
    const pubOpts = { qos: 2, retain: true };
    this.price.emit('announce', { topic: `${haTopic}${this.deviceConfig.stateTopic}/config`, announce: JSON.stringify(announce), pubOpts });
    this.load(new Date())
      .catch(ex => this.logger.error('Failed to load prices: ', ex));
  }

  private getPriceLevel(currentPrice: number, averagePrice: number) {
    const cheap = averagePrice * 0.6;
    const normal = averagePrice * 0.9;
    const expensive = averagePrice * 1.15;
    const veryExpensive = averagePrice * 1.4;
    const isVeryCheap = currentPrice < cheap;
    const isCheap = currentPrice < normal;
    const isVeryExpensive = currentPrice > veryExpensive;
    const isExpensive = currentPrice > expensive && !isVeryExpensive;
    return isVeryCheap ? 'VERY_CHEAP' : isCheap ? 'CHEAP' : isExpensive ? 'EXPENSIVE' : isVeryExpensive ? 'VERY_EXPENSIVE' : 'NORMAL';
  }

  private announce(oneDayPrices: Array<PriceInfo>) {

    const topic = `elwiz/sensor/${this.deviceConfig.stateTopic}`;
    const attrsTopic = `${topic}/attributes`;

    const date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    const isoString = date.toISOString()
      .replace(/\..+/g, '')
      .replace(/T\d\d/, 'T09');


    const current = oneDayPrices.find(d => d.startTime === isoString);

    if ( !current ) {
      return;
    }
    const curentPrice = current.price * 1.25;

    const state = ( curentPrice / 100 ).toFixed(4);
    const maxPrice = ( Math.max(...oneDayPrices.map(p => p.price)) * 1.25 ) / 100;
    const minPrice = ( Math.min(...oneDayPrices.map(p => p.price)) * 1.25 ) / 100;
    const avgPrice = ( ( oneDayPrices.map(p => p.price).reduce((a, b) => a + b, 0) / oneDayPrices.length ) * 1.25 ) / 100;
    const priceLevel = this.getPriceLevel(current.price, avgPrice);
    const attrs = { maxPrice, minPrice, avgPrice, priceLevel };

    const pubOpts = { qos: 2, retain: true };
    this.price.emit('announce', { topic, announce: state, pubOpts });
    this.price.emit('announce', { topic: attrsTopic, announce: JSON.stringify(attrs), pubOpts });
  }

  private async retireDays(days: number) {
    if ( !days ) {
      return;
    }
    const today = new Date();
    const deleteOlderThan = subDays(today, days);
    await Price.destroy({ where: { date: { lt: deleteOlderThan } } });
  }

  private computePrice(priceObj: { startTime: string; endTime: string; price: number; }) {
    const {
      supplierKwhPrice,
      supplierMonthPrice,
      supplierVatPercent,
      spotVatPercent,
      gridKwhPrice,
      gridDayPrice,
      gridVatPercent
    } = this.config;
    const month = Number(priceObj.startTime.split('-')[ 1 ]);
    let supplierPrice = supplierKwhPrice + supplierMonthPrice / this.daysInMonth[ month ]! / 24;
    supplierPrice += supplierPrice * supplierVatPercent / 100;
    supplierPrice += priceObj.price + priceObj.price * spotVatPercent / 100;
    let gridPrice = gridKwhPrice + gridDayPrice / 24;
    gridPrice += gridDayPrice * gridVatPercent / 100;
    return {
      startTime: priceObj.startTime,
      endTime: priceObj.endTime,
      price: priceObj.price,
      spotPrice: priceObj.price,
      customerPrice: Number(( supplierPrice + gridPrice ).toFixed(4))
    };
  }
}
