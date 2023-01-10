import { QoS } from 'mqtt';

export type MqttSubjectData = {
  topic: string;
  announce: string;
  pubOpts?: {
    qos?: QoS;
    retain?: boolean;
  }
}
