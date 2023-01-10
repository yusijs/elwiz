import { DeviceConfig } from './definition';
import { IClientPublishOptions } from 'mqtt';

export type HomeassistantConfig = {
  enabled: boolean;
  sensorTopic: string;
  configTopic: string;
  pubOpts: IClientPublishOptions;
  entities: Array<DeviceConfig>;
}
