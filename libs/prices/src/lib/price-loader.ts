import { ElwizConfig, ElwizPrice, ExtPrice, MqttSubjectData } from '@elwiz/common';

import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { DeviceConfig, getHassDevice } from '@elwiz/pulse';
import { Logger } from 'winston';
import { request } from 'https';
import { ReplaySubject } from 'rxjs';

export class PriceLoader {
  public device = new ReplaySubject<MqttSubjectData>();
  public priceData = new ReplaySubject<Array<ElwizPrice>>();
  private deviceConfig = {
    haBaseTopic: this.config.haBaseTopic,
    name: 'Price',
    uniqueId: 'elwiz_electricity_price',
    devClass: null,
    staClass: 'total',
    unitOfMeasurement: this.config.priceCurrency,
    stateTopic: 'price'
  } as DeviceConfig;

  constructor(private config: ElwizConfig, private logger: Logger) {
  }

  private apiDomainMap = {
    NO: 'https://www.hvakosterstrommen.no',
    SE: 'https://www.elprisetjustnu.se',
    DK: 'https://www.elprisenligenu.dk'
  };

  private getRequestOptions(year: string, month: string, day: string, priceArea: string) {
    const countryCode = priceArea.substring(0, 2) as keyof typeof this.apiDomainMap;
    const opts = {
      host: this.apiDomainMap[ countryCode ],
      path: `/api/v1/prices/${year}/${month}-${day}_${priceArea}.json`
    };
    return new URL(`${opts.host}${opts.path}`);
  }

  private getDate(d: Date) {
    const year = d.getFullYear().toString();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return { year, month, day };
  }

  private async loadPrice(d: Date) {
    const { year, month, day } = this.getDate(d);
    const area = this.config.priceRegion;
    const opts = this.getRequestOptions(year, month, day, area);
    return new Promise<Array<ElwizPrice>>((resolve, reject) => {
      const req = request(opts, (res) => {
        let responseString = '';
        const code = res.statusCode!;
        if ( code >= 400 ) {
          resolve([]);
          req.end();
          return;
        }
        res.on('data', chunk => responseString += chunk);
        res.on('error', err => reject(err));
        res.on('end', () => {
          try {
            const price = JSON.parse(responseString) as Array<ExtPrice>;

            const updated = price
              .map(p => {
                return {
                  price: p.NOK_per_kWh,
                  time_start: p.time_start,
                  time_end: p.time_end,
                  monthlyAverage: 0,
                  dailyAverage: 0
                } as ElwizPrice;
              });
            resolve(updated);
          } catch {
            this.logger.warn('Failed to load price for', d);
          }
        });
      });
      req.end();
    });
  }

  public async load(d: Date = new Date()): Promise<Array<ElwizPrice>> {
    const price = await this.loadPrice(d);
    this.priceData.next(price);
    return price;
  }

  public async loadMonth(d: Date) {
    const start = startOfMonth(d);
    const end = endOfMonth(d);
    const interval: Interval = { start, end };
    const range = eachDayOfInterval(interval);
    let prices: Array<ElwizPrice> = [];
    for ( const date of range ) {
      this.logger.info(`Loading price for ${date}`);
      const price = await this.loadPrice(date);
      prices = [ ...prices, ...price ];
    }
    return prices;
  }


  public init() {
    const haTopic = 'homeassistant/sensor/ElWiz/';

    const announce = getHassDevice(this.deviceConfig);
    announce.json_attributes_topic = `${announce.stat_t}/attributes`;
    delete announce.dev_cla;
    const pubOpts = { qos: 2, retain: true };
    this.device.next({ topic: `${haTopic}${this.deviceConfig.stateTopic}/config`, announce: JSON.stringify(announce), pubOpts });
    this.loadMonth(new Date())
      .then(prices => this.priceData.next(prices))
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

}
