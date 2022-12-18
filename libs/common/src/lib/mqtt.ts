export type MqttSubjectData = {
  topic: string;
  announce: string;
  pubOpts?: {
    qos?: number;
    retain?: boolean;
  }
}
