export type Device = {
  unit_of_meas: string;
  stat_cla: string;
  uniq_id: string;
  avty_t: string;
  stat_t: string;
  json_attributes_topic?: string;
  dev: {
    sw: string;
    mdl: string;
    name: string;
    ids: string[]
    mf: string
  };
  val_tpl: string;
  name: string;
  dev_cla?: string | null
}

export type DeviceConfig = {
  name: string;
  uniqueId: string;
  devClass: string | null;
  staClass: string;
  unitOfMeasurement: string;
  stateTopic: string;
  haBaseTopic: string;
};

export function getHassDevice({ name, uniqueId, devClass, staClass, unitOfMeasurement, stateTopic, haBaseTopic }: DeviceConfig): Device {
  return {
    name: name,
    uniq_id: uniqueId,
    dev_cla: devClass, // device_class
    stat_cla: staClass, // state_class
    unit_of_meas: unitOfMeasurement,
    avty_t: haBaseTopic + '/status',    // availability_topic
    stat_t: haBaseTopic + '/' + stateTopic,
    val_tpl: '{{value|round(3)}}',
    dev: {
      ids: [ 'elwiz_pulse_enabler' ],
      name: 'ElWiz Pulse Enabler',
      sw: 'https://github.com/iotux/ElWiz',
      mdl: 'ElWiz',
      mf: 'iotux'
    }
  };
}
