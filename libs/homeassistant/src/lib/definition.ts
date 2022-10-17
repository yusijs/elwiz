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
  valueTemplate?: string;
};


