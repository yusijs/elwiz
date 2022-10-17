import { QoS } from 'mqtt-packet';
import { programName, programPid } from './config';
import { ElwizConfig, List1, List2, List3 } from '@elwiz/common';
import { EventEmitter } from 'events';
import { getHassDevice } from './device';
import { amsDecoder } from '@elwiz/ams';
import { Logger } from 'winston';
import { IClientPublishOptions } from 'mqtt/types/lib/client-options';

const list1Name = 'list1';
const list2Name = 'list2';
const list3Name = 'list3';

export class Pulse {
  //lastHourConsumption: number;
  lastMeterProduction!: number;
  //lastHourProduction: number;
  pulseStatus: unknown;
  //pulseData3: List2;
  date!: Date;
  //lastMeterConsumption: undefined,
  //accumulatedConsumption: undefined,  // reset @ midnight
  //accumulatedConsumptionLastHour: undefined, // reset @ every lapsed hour
  //lastMeterProduction: undefined,
  //accumulatedProduction: undefined,  // reset @ midnight
  //accumulatedProductionLastHour: undefined, // reset @ every lapsed hour
  //lastDayConsumption: number;
  //mqttOptions: {};
  statOpts!: IClientPublishOptions;
  //lastDayProduction: number;
  list1Opts: unknown = {};
  //pulseData1: List1;
  //pulseData2: List2;
  list2Opts: unknown = {};
  //weekDay: number;
  //timerValue = watchValue;
  //timerExpired: boolean = false;
  //broker: string;
  list3Opts: unknown = {};
  republish = true;
  computePrices = false;
  public pulseData = new EventEmitter();
  public device = new EventEmitter();
  public status = new EventEmitter();
  // Home assistant (turn off in "config.yaml")
  haPublish!: boolean;
  haAnnounceTopic = 'homeassistant/sensor/ElWiz/';
  haBaseTopic = 'elwiz/sensor';
  public lastCumulativePower!: number | null;
  private minPowerHour!: number;
  private maxPowerHour!: number;
  private hour!: number;

  constructor(private config: ElwizConfig, private logger: Logger) {
  }


  hassAnnounce() {
    const haTopic = this.haAnnounceTopic;
    const qos = 1 as QoS;
    const pubOpts = { qos, retain: true };

    const entities = [
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}lastMeterConsumption/config`,
        name: 'Last meter consumption',
        uniqueId: 'last_meter_consumption',
        devClass: 'energy',
        staClass: 'total_increasing',
        unitOfMeasurement: 'kWh',
        stateTopic: 'lastMeterConsumption'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}accumulatedConsumption/config`,
        name: 'Accumulated consumption today',
        uniqueId: 'accumulated_consumption',
        devClass: 'energy',
        staClass: 'total',
        unitOfMeasurement: 'kWh',
        stateTopic: 'accumulatedConsumption'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}accumulatedConsumptionLastHour/config`,
        name: 'Accumulated consumption last hour',
        uniqueId: 'accumulated_consumption_last_hour',
        devClass: 'energy',
        staClass: 'total_increasing',
        unitOfMeasurement: 'kWh',
        stateTopic: 'accumulatedConsumptionLastHour'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}lastMeterProduction/config`,
        name: 'Last meter production',
        uniqueId: 'last_meter_production',
        devClass: 'energy',
        staClass: 'total_increasing',
        unitOfMeasurement: 'kWh',
        stateTopic: 'lastMeterProduction'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}accumulatedProduction/config`,
        name: 'Accumulated production today',
        uniqueId: 'accumulated_production',
        devClass: 'energy',
        staClass: 'total',
        unitOfMeasurement: 'kWh',
        stateTopic: 'accumulatedProduction'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}accumulatedProductionLastHour/config`,
        name: 'Accumulated production last hour',
        uniqueId: 'accumulated_production_last_hour',
        devClass: 'energy',
        staClass: 'total_increasing',
        unitOfMeasurement: 'kWh',
        stateTopic: 'accumulatedProductionLastHour'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}power/config`,
        name: 'Current power use',
        uniqueId: 'power_current_use',
        devClass: 'power',
        staClass: 'measurement',
        unitOfMeasurement: 'kW',
        stateTopic: 'power'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}minPower/config`,
        name: 'Min power since midnight',
        uniqueId: 'min_power_since_midnight',
        devClass: 'power',
        staClass: 'measurement',
        unitOfMeasurement: 'kW',
        stateTopic: 'minPower'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}maxPower/config`,
        name: 'Max power since midnight',
        uniqueId: 'max_power_since_midnight',
        devClass: 'power',
        staClass: 'measurement',
        unitOfMeasurement: 'kW',
        stateTopic: 'maxPower'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}voltagePhase1/config`,
        name: 'Voltage phase 1',
        uniqueId: 'voltage_phase_1',
        devClass: 'voltage',
        staClass: 'measurement',
        unitOfMeasurement: 'V',
        stateTopic: 'voltagePhase1'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}voltagePhase2/config`,
        name: 'Voltage phase 2',
        uniqueId: 'voltage_phase_2',
        devClass: 'voltage',
        staClass: 'measurement',
        unitOfMeasurement: 'V',
        stateTopic: 'voltagePhase2'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}voltagePhase3/config`,
        name: 'Voltage phase 3',
        uniqueId: 'voltage_phase_3',
        devClass: 'voltage',
        staClass: 'measurement',
        unitOfMeasurement: 'V',
        stateTopic: 'voltagePhase3'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}currentL1/config`,
        name: 'Current L1',
        uniqueId: 'current_L1',
        devClass: 'current',
        staClass: 'measurement',
        unitOfMeasurement: 'A',
        stateTopic: 'currentL1'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}currentL2/config`,
        name: 'Current L2',
        uniqueId: 'current_L2',
        devClass: 'current',
        staClass: 'measurement',
        unitOfMeasurement: 'A',
        stateTopic: 'currentL2'
      },
      {
        haBaseTopic: this.haBaseTopic,
        topic: `${haTopic}currentL3/config`,
        name: 'Current L3',
        uniqueId: 'current_L3',
        devClass: 'current',
        staClass: 'measurement',
        unitOfMeasurement: 'A',
        stateTopic: 'currentL3'
      },
    ];
    entities
      .forEach(d => {
        const { topic, ...rest } = d;
        const announce = getHassDevice(rest);
        this.device.emit('announce', { announce: JSON.stringify(announce), topic, pubOpts });
      });

    // Set retain flag (pubOpts) on status message to let HA find it after a stop/restart
    this.device.emit('announce', { topic: this.haBaseTopic + '/status', announce: 'online', pubOpts });
    // Populate lastMeterConsumption from storage to prevent up to one hour wait after a restart or stop
  }

  init() {
    this.logger.info(programName + ' is performing, PID: ', programPid);

    this.logger.debug(this.config);

    if ( this.config.mqttBroker === null ) {
      this.logger.info('\nBroker IP address or hostname missing');
      this.logger.info('Edit your "config.yaml" file\n');
      process.exit(0);
    }

    this.republish = this.config.REPUBLISH;

    if ( this.config.computePrices !== undefined )
      this.computePrices = this.config.computePrices;

    if ( this.computePrices ) {
      // TODO: Sequelize?
      /*if ( existsSync('./data/prices-' + today() + '.json') ) {
        this.dayPrices = require('./data/prices-' + today() + '.json');
      }*/
    }

    this.hassAnnounce();

    // Home Assistant Base Topic
    this.haPublish = this.config.haPublish;
    this.haBaseTopic = this.config.haBaseTopic;

    this.list1Opts = { qos: this.config.list1Qos, retain: this.config.list1Retain };
    this.list2Opts = { qos: this.config.list2Qos, retain: this.config.list2Retain };
    this.list3Opts = { qos: this.config.list3Qos, retain: this.config.list3Retain };
    this.statOpts = { qos: this.config.statusQos, retain: this.config.statusRetain };

  }


  public handleMessages(message: Buffer) {
    const buf = Buffer.from(message);
    const hex = message.toString('hex');
    // JSON data
    if ( hex === '48656C6C6F' ) { // hello
      this.device.emit('announce', { topic: this.haBaseTopic + '/status', announce: 'online', pubOpts: { qos: 0, retain: false } });
    } else if ( buf[ 0 ] === 0x7b ) { // 0x7b, 123, "{" = Pulse status
      const msg = message.toString();
      // BREAKING change
      const m = JSON.parse(msg);
      this.pulseStatus = m.status;
      if ( this.pulseStatus !== undefined )
        this.status.emit('status', {
          topic: this.config.pubStatus,
          announce: JSON.stringify(this.pulseStatus, null, 2),
          pubOpts: this.statOpts
        });
    }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    else if ( buf[ 0 ] === 'H' ) {
      const msg = message.toString();
      if ( this.republish )
        this.status.emit('status', { topic: this.config.pubNotice, announce: this.config.greetMessage, pubOpts: this.statOpts });
      this.logger.debug('Pulse is starting: ' + this.config.pubNotice + ' ', msg);
    } else {
      const data = amsDecoder(message, this.config, this.logger);
      switch ( data.type ) {
        case 'list1':
          this.announce(`pulse/meter/${list1Name}`, data);
          break;
        case 'list2':
          this.announce(`pulse/meter/${list2Name}`, data);
          break;
        case 'list3': {
          const list3Data = this.convertList3Data(data);
          this.announce(`pulse/meter/${list3Name}`, list3Data);
        }
          break;
        default:
          this.logger.debug('Unknown data from AMS');
          this.logger.debug(`hex: ${buf.toString('hex').toUpperCase()}`);
          this.logger.debug(`str value: ${buf.toString()}`);
      }
    }
  }

  private convertList3Data(json: List3) {
    // meterDate is 10 seconds late. Is it a Pulse bug or a feature from the meter?
    // According to NVE "OBIS List Information":
    // The values are generated at XX:00:00 and streamed out from the
    // HAN interface 10 second later (XX:00:10)
    // It makes sense to "backdate" the value by 10 secs to
    // make for easier lookup the correct price data from Nordpool
    if ( this.lastCumulativePower! > 0 && json.cumuHourPowImpActive ) {
      const lastHourActivePower = Number(( json.cumuHourPowImpActive - this.lastCumulativePower! ).toFixed(3));
      return {
        ...json,
        accumulatedConsumptionLastHour: lastHourActivePower,
      };
    }
    // AggregatedData.findOne().then(ent => ent.update({cumulativePower: this.lastCumulativePower}));
    return json;
  }

  private announce(topic: string, data: List1 | List2 | List3) {
    this.pulseData.emit('announce', { topic, announce: JSON.stringify(data) });

    const d = new Date();
    const hour = d.getHours();
    if ( data.powImpActive ) {
      if ( hour !== this.hour ) {
        this.minPowerHour = data.powImpActive;
        this.maxPowerHour = data.powImpActive;
      } else {
        this.minPowerHour = this.minPowerHour < data.powImpActive ? this.minPowerHour : data.powImpActive;
        this.maxPowerHour = this.maxPowerHour > data.powImpActive ? this.maxPowerHour : data.powImpActive;
      }
    }
    this.hour = hour;
    data.minPower = this.minPowerHour;
    data.maxPower = this.maxPowerHour;
    const pubOpts = { qos: 1, retain: true };
    if ( data.type === 'list1' ) {
      this.pulseData.emit(data.type, data);
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/power', announce: data.powImpActive.toString(), pubOpts });
    } else if ( data.type === 'list2' ) {
      this.pulseData.emit(data.type, data);
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/timestamp', announce: data.date, pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/power', announce: ( data.powImpActive ?? 0 ).toString(), pubOpts });

      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/voltagePhase1',
        announce: ( data.voltageL1 / 10 ).toString(),
        pubOpts
      });
      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/voltagePhase2',
        announce: ( data.voltageL2 / 10 ).toString(),
        pubOpts
      });
      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/voltagePhase3',
        announce: ( data.voltageL3 / 10 ).toString(),
        pubOpts
      });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/currentL1', announce: ( data.currentL1 / 10 ).toString(), pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/currentL2', announce: ( data.currentL2 / 10 ).toString(), pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/currentL3', announce: ( data.currentL3 / 10 ).toString(), pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/signalStrength', announce: data.toString(), pubOpts });
    } else if ( data.type === 'list3' ) {

      // this.pulseData.emit('announce', { topic: this.haBaseTopic + '/timestamp', announce: data.date, pubOpts });
      // writeFileSync(join(__dirname, 'data', 'data3.json'), JSON.stringify({data, haData}, null, 2))
      this.pulseData.emit('list3', data);
      this.lastCumulativePower = data.cumuHourPowImpActive!;
      if ( data.accumulatedConsumptionLastHour ) {
        this.pulseData.emit('announce', {
          topic: this.haBaseTopic + '/accumulatedConsumptionLastHour',
          announce: ( data.accumulatedConsumptionLastHour ?? this.lastCumulativePower )?.toString() ?? '',
          pubOpts
        });
      }
      if ( data.cumuHourPowImpActive ) {
        this.pulseData.emit('announce', {
          topic: this.haBaseTopic + '/lastMeterConsumption',
          announce: ( data.cumuHourPowImpActive ?? this.lastCumulativePower )?.toString() ?? '',
          pubOpts
        });
      }

      /*
           let haData = {
        meterDate: data.meterDate,
        timestamp: data.date,
        power: data.powImpActive,
        lastMeterConsumption: data.cumuHourPowImpActive,     // kWh - last meter import register
        lastMeterProduction: data.cumuHourPowExpActive,      // kWh - last meter export register
        accumulatedConsumption: data.accumulatedConsumption, // kWh since midnight
        accumulatedProduction: data.accumulatedProduction,   // kWh since midnight
        accumulatedConsumptionLastHour: data.accumulatedConsumptionLastHour, // since last hour shift
        accumulatedProductionLastHour: data.accumulatedProductionLastHour,   // since last hour shift
        //---------------------
        //accumulatedCost: 0,                   // (Tibber) accumulated cost since midnight
        //accumulatedReward: 0,                 // (Tibber) accumulated reward since midnight
        //currency: "NOK",                      // (Tibber) currency of displayed cost
        //---------------------
        minPower: data.minPower,                // Watt (min consumption since midnight)
        //averagePower: json.averagePower,        // Watt (avg consumption since midnight)
        maxPower: data.maxPower,                // Watt (max consumption since midnight)
        //powerProduction: json.poweProduction, // Watt (A- at the moment)
        //powerReactive: 0,                     // kWAr (current reactive consumption, Q+)
        //powerProductionReactive: 0,           // kWAr (current net reactive production Q-)
        minPowerProduction: 0,                  // Watt (since midnight)
        maxPowerProduction: 0,                  // Watt (since midnight)
        //powerFactor: 0,                       // (active power / apparent power)
        voltagePhase1: data.voltageL1,
        voltagePhase2: data.voltageL3,
        voltagePhase3: data.voltageL3,
        currentL1: data.currentL1,
        currentL2: data.currentL2,
        currentL3: data.currentL3,
      };
       */
      /*this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/lastMeterConsumption',
        announce: haData.lastMeterConsumption.toString(),
        pubOpts
      });
      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/lastMeterProduction',
        announce: haData.lastMeterProduction.toString(),
        pubOpts
      });
      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/accumulatedConsumption',
        announce: haData.accumulatedConsumption.toString(),
        pubOpts
      });
      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/accumulatedProduction',
        announce: haData.accumulatedProduction.toString()
      });
      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/accumulatedConsumptionLastHour',
        announce: haData.accumulatedConsumptionLastHour.toString(),
        pubOpts
      });
      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/accumulatedProductionLastHour',
        announce: haData.accumulatedProductionLastHour.toString(),
        pubOpts
      });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/minPower', announce: haData.minPower.toString(), pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/maxPower', announce: haData.maxPower.toString(), pubOpts });
      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/minPowerProduction',
        announce: haData.minPowerProduction.toString(),
        pubOpts
      });
      this.pulseData.emit('announce', {
        topic: this.haBaseTopic + '/maxPowerProduction',
        announce: haData.maxPowerProduction.toString(),
        pubOpts
      });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/voltagePhase1', announce: data.voltageL1.toString(), pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/voltagePhase2', announce: data.voltageL2.toString(), pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/voltagePhase3', announce: data.voltageL3.toString(), pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/currentL1', announce: data.currentL1.toString(), pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/currentL2', announce: data.currentL2.toString(), pubOpts });
      this.pulseData.emit('announce', { topic: this.haBaseTopic + '/currentL3', announce: data.currentL3.toString(), pubOpts });*/
      // this.pulseData.emit(this.haBaseTopic + "signalStrength", signal.toString(), list3Opts);
    }
  }
}
