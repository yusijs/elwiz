import { HomeassistantConfig } from './config';
import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { getHassDevice } from './generate-entities';
import { IClientPublishOptions } from 'mqtt';
import { List1, List2, List3 } from '@elwiz/common';
import { HomeAssistantList2, HomeAssistantList3 } from './model';

export function homeassistant(): string {
  return 'homeassistant';
}

export type HomeAssistantAnnounce = {
  topic: string;
  device: string;
  pubOpts: IClientPublishOptions;
};

export type HomeAssistantPlugin = (data: List3) => unknown;

export type HomeAssistantPlugins = {
  [ key: string ]: HomeAssistantPlugin;
}

export class Homeassistant {
  public announce = new EventEmitter();

  constructor(private config: HomeassistantConfig, private logger: Logger, private plugins: HomeAssistantPlugins = {}) {
  }

  public static list3Handler(data: List3, previous: List3, firstOfDay: List3, measurementsSinceMidnight: Array<List1>, thisHour: Array<List2>): HomeAssistantList3 {
    const measurements = thisHour
      .map(r => r.powImpActive);
    const minPowerCurrentHour = Math.min(...measurements);
    const maxPowerCurrentHour = Math.max(...measurements);
    const power = measurementsSinceMidnight.map(m => m.powImpActive);
    const maxPower = Math.max(...power);
    const minPower = Math.min(...power);
    const hassData = {
      meterDate: data.meterDate ?? data.date,
      timestamp: data.date,
      power: data.powImpActive,
      minPowerCurrentHour,
      maxPowerCurrentHour,
      lastMeterConsumption: data.cumuHourPowImpActive,
      lastMeterProduction: data.cumuHourPowExpActive,
      accumulatedConsumption: data.cumuHourPowImpActive - firstOfDay.cumuHourPowImpActive,
      accumulatedProduction: data.cumuHourPowExpActive - firstOfDay.cumuHourPowExpActive,
      accumulatedConsumptionLastHour: data.cumuHourPowImpActive - previous.cumuHourPowImpActive,
      accumulatedProductionLastHour: data.cumuHourPowExpActive - previous.cumuHourPowExpActive,
      minPower,
      maxPower,
      minPowerProduction: 0,
      maxPowerProduction: 0,
      voltagePhase1: data.voltageL1,
      voltagePhase2: data.voltageL2,
      voltagePhase3: data.voltageL3,
      currentL1: data.currentL1,
      currentL2: data.currentL2,
      currentL3: data.currentL3,
    };
    return hassData;
  }

  public static list2Handler(current: List2, {
    maxPower,
    minPower,
    total
  }: { maxPower: number, minPower: number, total: number }): HomeAssistantList2 {

    const hassData = {
      timestamp: current.date,
      power: current.powImpActive,
      accumulatedConsumptionLastHour: total,
      accumulatedProductionLastHour: 0,
      minPowerCurrentHour: minPower,
      maxPowerCurrentHour: maxPower,
      voltagePhase1: current.voltageL1,
      voltagePhase2: current.voltageL2,
      voltagePhase3: current.voltageL3,
      currentL1: current.currentL1,
      currentL2: current.currentL2,
      currentL3: current.currentL3,
    };
    return hassData;
  }

  public init() {
    if ( !this.config.enabled ) {
      this.logger.warn('Homeassistant plugin did not start: Enable in config');
      return;
    }
    this.config.entities
      .map(device => getHassDevice(this.config.sensorTopic, device))
      .map(device => ( {
        topic: `${this.config.configTopic}/${device.stat_t}/config`,
        device: JSON.stringify(device),
        pubOpts: this.config.pubOpts
      } ) as HomeAssistantAnnounce)
      .forEach(data => this.announce.emit('configure', data));
  }
}
