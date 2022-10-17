import { Device, DeviceConfig } from './definition';

export function getHassDevice(sensorTopic: string, {
  name,
  uniqueId,
  devClass,
  staClass,
  unitOfMeasurement,
  stateTopic,
  valueTemplate
}: DeviceConfig): Device {
  return {
    name: name,
    uniq_id: uniqueId,
    dev_cla: devClass, // device_class
    stat_cla: staClass, // state_class
    unit_of_meas: unitOfMeasurement,
    avty_t: `${sensorTopic}/status`,    // availability_topic
    stat_t: `${sensorTopic}/${stateTopic}`,
    val_tpl: valueTemplate ?? '{{value}}',
    dev: {
      ids: [ 'elwiz_pulse_enabler' ],
      name: 'ElWiz Pulse Enabler',
      sw: 'https://github.com/iotux/ElWiz',
      mdl: 'ElWiz',
      mf: 'iotux'
    }
  };
}
