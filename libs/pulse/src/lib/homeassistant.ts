export const getHomeAssistanDevices = (baseTopic: string, haTopic: string) => {
  return [
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}lastMeterConsumption/config`,
      name: 'Last meter consumption',
      uniqueId: 'last_meter_consumption',
      devClass: 'energy',
      staClass: 'total_increasing',
      unitOfMeasurement: 'kWh',
      stateTopic: 'lastMeterConsumption'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}accumulatedConsumption/config`,
      name: 'Accumulated consumption today',
      uniqueId: 'accumulated_consumption',
      devClass: 'energy',
      staClass: 'total',
      unitOfMeasurement: 'kWh',
      stateTopic: 'accumulatedConsumption'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}accumulatedConsumptionLastHour/config`,
      name: 'Accumulated consumption last hour',
      uniqueId: 'accumulated_consumption_last_hour',
      devClass: 'energy',
      staClass: 'total_increasing',
      unitOfMeasurement: 'kWh',
      stateTopic: 'accumulatedConsumptionLastHour'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}lastMeterProduction/config`,
      name: 'Last meter production',
      uniqueId: 'last_meter_production',
      devClass: 'energy',
      staClass: 'total_increasing',
      unitOfMeasurement: 'kWh',
      stateTopic: 'lastMeterProduction'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}accumulatedProduction/config`,
      name: 'Accumulated production today',
      uniqueId: 'accumulated_production',
      devClass: 'energy',
      staClass: 'total',
      unitOfMeasurement: 'kWh',
      stateTopic: 'accumulatedProduction'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}accumulatedProductionLastHour/config`,
      name: 'Accumulated production last hour',
      uniqueId: 'accumulated_production_last_hour',
      devClass: 'energy',
      staClass: 'total_increasing',
      unitOfMeasurement: 'kWh',
      stateTopic: 'accumulatedProductionLastHour'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}power/config`,
      name: 'Current power use',
      uniqueId: 'power_current_use',
      devClass: 'power',
      staClass: 'measurement',
      unitOfMeasurement: 'kW',
      stateTopic: 'power'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}minPower/config`,
      name: 'Min power since midnight',
      uniqueId: 'min_power_since_midnight',
      devClass: 'power',
      staClass: 'measurement',
      unitOfMeasurement: 'kW',
      stateTopic: 'minPower'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}maxPower/config`,
      name: 'Max power since midnight',
      uniqueId: 'max_power_since_midnight',
      devClass: 'power',
      staClass: 'measurement',
      unitOfMeasurement: 'kW',
      stateTopic: 'maxPower'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}voltagePhase1/config`,
      name: 'Voltage phase 1',
      uniqueId: 'voltage_phase_1',
      devClass: 'voltage',
      staClass: 'measurement',
      unitOfMeasurement: 'V',
      stateTopic: 'voltagePhase1'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}voltagePhase2/config`,
      name: 'Voltage phase 2',
      uniqueId: 'voltage_phase_2',
      devClass: 'voltage',
      staClass: 'measurement',
      unitOfMeasurement: 'V',
      stateTopic: 'voltagePhase2'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}voltagePhase3/config`,
      name: 'Voltage phase 3',
      uniqueId: 'voltage_phase_3',
      devClass: 'voltage',
      staClass: 'measurement',
      unitOfMeasurement: 'V',
      stateTopic: 'voltagePhase3'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}currentL1/config`,
      name: 'Current L1',
      uniqueId: 'current_L1',
      devClass: 'current',
      staClass: 'measurement',
      unitOfMeasurement: 'A',
      stateTopic: 'currentL1'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}currentL2/config`,
      name: 'Current L2',
      uniqueId: 'current_L2',
      devClass: 'current',
      staClass: 'measurement',
      unitOfMeasurement: 'A',
      stateTopic: 'currentL2'
    },
    {
      haBaseTopic: baseTopic,
      topic: `${haTopic}currentL3/config`,
      name: 'Current L3',
      uniqueId: 'current_L3',
      devClass: 'current',
      staClass: 'measurement',
      unitOfMeasurement: 'A',
      stateTopic: 'currentL3'
    },
  ];
};
