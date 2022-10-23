import { Pulse } from '@elwiz/pulse';
import { join } from 'path';
import * as yaml from 'yamljs';
import { ElwizConfig, ElwizLogger, List2, PriceInfo } from '@elwiz/common';
import { MqttHandler } from '@elwiz/mqtt';
import { IClientOptions } from 'mqtt';
import { PriceLoader } from '@elwiz/prices';
import { RecurrenceRule, scheduleJob } from 'node-schedule';
import { addPrices, initModels } from '@elwiz/database';
import { parseISO } from 'date-fns';
import { Homeassistant, HomeassistantConfig } from '@elwiz-ts/homeassistant';

const config: ElwizConfig = yaml.load(join(__dirname, 'assets/config.yaml'));
const homeAssistantConfig: HomeassistantConfig = yaml.load(join(__dirname, 'assets/homeassistant.yaml'));

const logger = new ElwizLogger(config).logger;

initModels(config, logger)
  .then(models => {
    // Messages to send:
    /*
    status -> returns current status
    reboot -> reboot device
    update -> request update (need update-url)
     */


    const mqtt = new MqttHandler(config, logger);
    mqtt.init();
    mqtt.status.on('status', async (status: string) => {
      await models.OnlineStatus.create({ status });
    });
    const homeAssistant = new Homeassistant(homeAssistantConfig, logger);
    /*    homeAssistant.announce
          .on('configure', ({ topic, device, pubOpts }: HomeAssistantAnnounce) => {
            mqtt.announce(topic, device, pubOpts);
          });
        homeAssistant.init();*/

    const pulse = new Pulse(config, logger);

    /*    models.List1Data.addHook('afterCreate', (attributes, options) => {
          const now = startOfHour(new Date());
          const next = startOfHour(addHours(now, 1));
          logger.debug([ now.toISOString(), next.toISOString() ].join(', '));
          List1Data.findAll({ where: { createdAt: { [ Op.gte ]: now.toISOString(), [ Op.lt ]: next.toISOString() } } })
            .then(hourlyData => {
              const consumption = hourlyData.map(d => {
                return d.getDataValue('power');
              });
              const max = Math.max(...consumption);
              const min = Math.min(...consumption);
              logger.info(`Min is ${min}, Max is ${max}`);
            });
        });*/
    models.List3Data.findOne({ order: [['createdAt', 'DESC']] })
      .then(r => {
        if (r) {
          // TODO: find the proper names
          //logger.verbose(`Set lastCumulativePower to ${r.getDataValue('cumuHourPowImpActive')}`);
          //pulse.lastCumulativePower = r.getDataValue('cumuHourPowImpActive');
        }
      });
    const priceLoader = new PriceLoader(config, logger);


    mqtt.stream.on('tibber', chunk => {
      pulse.handleMessages(chunk);
    });

    pulse.status
      .on('status', (event: { topic: string; announce: string; pubOpts?: IClientOptions }) => {
        mqtt.announce(event.topic, event.announce, event.pubOpts);
        if (event.topic === config.pubStatus) {
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
          mqtt.announce(`${config.haBaseTopic}/timestamp`, data.date, config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/power`, ( data.power ?? 0 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/maxPower`, ( data.power ?? 0 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/minPower`, ( data.power ?? 0 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/avgPower`, ( data.power ?? 0 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/voltagePhase1`, ( data.voltagePhase1 / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/voltagePhase2`, ( data.voltagePhase2 / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/voltagePhase3`, ( data.voltagePhase3 / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/currentL1`, ( data.currentL1 / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/currentL2`, ( data.currentL2 / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/currentL3`, ( data.currentL3 / 10 ).toString(), config.list2Opts);
          mqtt.announce(`${config.haBaseTopic}/signalStrength`, data.toString(), config.list2Opts);
        } catch ( ex ) {
          logger.error(ex);
        }
      });
    pulse.pulseData
      .on('list3', (data: typeof models.List3Data) => {
        models.List3Data.create(data)
          .catch(err => {
            logger.error('Failed to insert list3Data');
            logger.error(err);
          })
          .then(() => logger.verbose('Inserted List3 data'));
      });

    priceLoader.price
      .on('announce', (event: { topic: string; announce: string; pubOpts?: IClientOptions }) => {
        mqtt.announce(event.topic, event.announce, event.pubOpts);
      });

    priceLoader.loaded
      .on('loaded', (data: Array<PriceInfo>) => {
        addPrices(data, logger)
          .catch(err => logger.error(err));
      });


    models.Price.findOne({ where: { startTime: parseISO('2022-10-15T22:00:00.000Z') } })
      .catch(err => logger.error(err))
      .then(p => logger.info(p));

    priceLoader.init();
    pulse.init();

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

    rebootTibberDevice();

    const loadScheduledPrices = () => {
      const runSchedule = new RecurrenceRule();
      runSchedule.minute = 5;

      return scheduleJob(runSchedule, function () {
        logger.verbose('Loading prices');
        priceLoader.load()
          .catch(ex => logger.error('Failed to load prices: ', ex));
      });
    };

    const sendPriceToHomeAssistant = () => {
      const runSchedule = new RecurrenceRule();
      runSchedule.minute = 2;

      scheduleJob(runSchedule, function () {
        const now = new Date();
        models.Price.findOne({ where: { startTime: { lt: now }, endTime: { gt: now } } })
          .then(price => {
            if (price) {
              logger.debug(`Sending price for ${now} to home assistant`);
              logger.verbose('Price to send: ', price);
            } else {
              logger.info('No price found for current period');
            }
          });
      });
    };

    loadScheduledPrices();
    sendPriceToHomeAssistant();

    if (config.runNodeSchedule) {
      const runSchedule = new RecurrenceRule();
      runSchedule.hour = config.scheduleHours;
      runSchedule.minute = config.scheduleMinutes;
      scheduleJob(runSchedule, function () {
        priceLoader.load()
          .catch(ex => logger.error('Failed to load prices: ', ex));
      });
    }

  });

// A "kill -INT <process ID> will save the last cumulative power before killing the process
// Likewise a <Ctrl this.C> will do
process.on('SIGINT', () => {
  logger.info('\nGot SIGINT, power saved');
  process.exit(0);
});

// A "kill -TERM <process ID> will save the last cumulative power before killing the process
process.on('SIGTERM', () => {
  logger.info('\nGot SIGTERM, power saved');
  process.exit(0);
});

// A "kill -HUP <process ID> will read the stored last cumulative power file
process.on('SIGHUP', () => {
  logger.info('\nGot SIGHUP, config loaded');
  //      this.C = yaml.load(configFile);
  //      this.init();
});

