import { Pulse } from '@elwiz/pulse';
import { join } from 'path';
import * as yaml from 'yamljs';
import { defaultFeatures, ElwizConfig, ElwizLogger, List2 } from '@elwiz/common';
import { MqttHandler } from '@elwiz/mqtt';
import { IClientOptions } from 'mqtt';
import { PriceLoader } from '@elwiz/prices';
import { RecurrenceRule, scheduleJob } from 'node-schedule';
import { addPrices, initModels, Price } from '@elwiz/database';
import { isThisHour, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import { app } from './app/api';
import { state } from './app/state';

const config: ElwizConfig = yaml.load(join(__dirname, 'assets/config.yaml'));
config.features = config.features ?? defaultFeatures;

const logger = new ElwizLogger(config).logger;


initModels(config, logger)
  .then(models => {
    // Messages to send:
    /*
    status -> returns current status
    reboot -> reboot device
    update -> request update (need update-url)
     */


    state.db = models;

    const mqtt = new MqttHandler(config, logger);
    mqtt.init();
    mqtt.status.on('status', async (status: string) => {
      await models.OnlineStatus.create({ status });
    });

    const pulse = new Pulse(config, logger);
    const priceLoader = new PriceLoader(config, logger);


    mqtt.stream.on('tibber', chunk => {
      pulse.handleMessages(chunk);
    });

    pulse.status
      .on('status', (event: { topic: string; announce: string; pubOpts?: IClientOptions }) => {
        mqtt.announce(event.topic, event.announce, event.pubOpts);

        if ( event.topic === config.pubStatus ) {
          const data = JSON.parse(event.announce);
          models.PulseStatus.create(data)
            .catch(err => logger.error('Failed to create PulseStatus', err))
            .then(() => logger.info('Inserted PulseStatus'));
        }
      });

    pulse.device
      .on('announce', (event: { topic: string; announce: string; pubOpts?: IClientOptions }) => {
        mqtt.announce(event.topic, event.announce, event.pubOpts);
      });
    pulse.pulseData
      .on('announce', (event: { topic: string; announce: string; pubOpts?: IClientOptions }) => {
        mqtt.announce(event.topic, event.announce, event.pubOpts);
      });
    pulse.pulseData
      .on('list1', (data: typeof models.List1Data) => {
        models.List1Data.create(data)
          .catch(err => logger.error(err))
          .then(() => logger.debug('Inserted List1 data'));
      });
    pulse.pulseData
      .on('list2', async (data: List2) => {
        try {
          const saved = await models.List2Data.create(data);
          logger.debug('Inserted List2Data');
          mqtt.announce('meter/list2', JSON.stringify(saved), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/timestamp`, saved.getDataValue('date'), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/power`, ( saved.getDataValue('power') ?? 0 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/maxPower`, ( saved.getDataValue('maxPower') ?? 0 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/minPower`, ( saved.getDataValue('minPower') ?? 0 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/avgPower`, ( saved.getDataValue('avgPower') ?? 0 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/voltagePhase1`, ( saved.getDataValue('voltagePhase1') / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/voltagePhase2`, ( saved.getDataValue('voltagePhase2') / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/voltagePhase3`, ( saved.getDataValue('voltagePhase3') / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/currentL1`, ( saved.getDataValue('currentL1') / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/currentL2`, ( saved.getDataValue('currentL2') / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/currentL3`, ( saved.getDataValue('currentL3') / 10 ).toString(), config.list2Opts);
        } catch ( ex ) {
          logger.error('Failed to write list2');
          logger.error(ex);
          logger.error(JSON.stringify(data, null, 2));
        }
      });
    pulse.pulseData
      .on('list3', async (data: typeof models.List3Data) => {
        try {
          const saved = await models.List3Data.create(data);
          mqtt.announce(`${config.haBaseTopic}/lastMeterConsumption`, saved.getDataValue('lastMeterConsumption').toString(), config.list3Opts);
          mqtt.announce(`${config.haBaseTopic}/accumulatedConsumptionLastHour`, saved.getDataValue('accumulatedConsumptionLastHour').toString(), config.list3Opts);
          mqtt.announce(`${config.haBaseTopic}/accumulatedProductionLastHour`, saved.getDataValue('accumulatedProductionLastHour').toString(), config.list3Opts);
          mqtt.announce(`${config.haBaseTopic}/accumulatedConsumption`, saved.getDataValue('accumulatedConsumption').toString(), config.list3Opts);
          mqtt.announce(`${config.haBaseTopic}/accumulatedProduction`, saved.getDataValue('accumulatedProduction').toString(), config.list3Opts);
          logger.verbose('Inserted List3 data');
        } catch ( err ) {
          logger.error('Failed to insert list3Data', err);
          logger.error(err);
        }
      });


    const prices = async () => {
      priceLoader.device
        .subscribe(config => {
          mqtt.announce(config.topic, config.announce, config.pubOpts);
        });
      priceLoader.priceData
        .subscribe(async prices => {
          await addPrices(prices, logger);
          models.Price.findAll({ where: { time_start: { [ Op.gte ]: startOfDay(new Date()) } } })
            .then(prices => {
              const price = prices.find(p => isThisHour(p.getDataValue('time_start')));
              if ( price ) {
                announcePrice(price, prices);
              }
            })
            .catch(err => logger.error(err));
        });


      const announcePrice = (price: Price, prices?: Array<Price>) => {
        mqtt.announce(`${config.haBaseTopic}/price`, JSON.stringify(price.getDataValue('price')), { qos: 1, retain: true });
        mqtt.announce(`${config.haBaseTopic}/averagePrice`, JSON.stringify(price.getDataValue('dailyAverage')), { qos: 1, retain: true });
        mqtt.announce(`${config.haBaseTopic}/averageMonthPrice`, JSON.stringify(price.getDataValue('monthlyAverage')), {
          qos: 1,
          retain: true
        });
        if ( prices && prices.length > 0 ) {
          const raw = prices.map(p => ( { from: p.time_start, to: p.time_end, price: p.price } ));
          mqtt.announce(`${config.haBaseTopic}/price/attributes`, JSON.stringify(raw), { qos: 1, retain: true });
        }
      };

      priceLoader.init();


      const loadScheduledPrices = () => {
        const runSchedule = new RecurrenceRule();
        runSchedule.minute = 5;

        return scheduleJob(runSchedule, function () {
          logger.verbose('Loading prices');
          priceLoader.load()
            .catch(ex => logger.error('Failed to load prices: ', ex));
        });
      };

      const sendPricesMqtt = () => {
        const runSchedule = new RecurrenceRule();
        runSchedule.minute = 0;
        runSchedule.second = 30;

        scheduleJob(runSchedule, function () {
          const now = new Date();
          models.Price.findOne({ where: { time_start: { lt: now }, time_end: { gt: now } } })
            .then(price => {
              if ( price ) {
                logger.debug(`Sending price for ${now} to home assistant`);
                logger.verbose('Price to send: ', price);
                announcePrice(price);
              } else {
                logger.info('No price found for current period');
              }
            });
        });
      };

      loadScheduledPrices();
      sendPricesMqtt();

      const runSchedule = new RecurrenceRule();
      runSchedule.hour = config.scheduleHours;
      runSchedule.minute = config.scheduleMinutes;
      scheduleJob(runSchedule, function () {
        priceLoader.load()
          .catch(ex => logger.error('Failed to load prices: ', ex));
      });

    };
    const rebootTibberDevice = () => {
      const schedule = new RecurrenceRule();
      schedule.minute = 45;
      const schedule55 = new RecurrenceRule();
      schedule55.minute = 55;
      const cb = function () {
        logger.info(`Executing scheduled reboot of tibber pulse`);
        mqtt.announce('rebbit', 'reboot', { qos: 0, retain: false });
      };
      scheduleJob(schedule, cb);
      scheduleJob(schedule55, cb);
    };


    pulse.init();

    const features = config.features;

    if ( features.prices ) {
      prices();
    }

    if ( features.scheduledReboot ) {
      rebootTibberDevice();
    }


    if ( features.api ) {
      app.listen(8081, () => console.log('Listening on 8081'));
    }

  });
