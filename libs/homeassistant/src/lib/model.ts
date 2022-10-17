export type HomeAssistantList2 = {
  timestamp: string;
  // kW currently being used
  power: number;
  accumulatedConsumptionLastHour: number;
  accumulatedProductionLastHour: number;
  // kW (min consumption this hour)
  minPowerCurrentHour: number;
  // kW (max consumption this hour)
  maxPowerCurrentHour: number;
  voltagePhase1: number;
  voltagePhase2: number;
  voltagePhase3: number;
  currentL1: number;
  currentL2: number;
  currentL3: number;
};

export type HomeAssistantList3 = HomeAssistantList2 & {
  meterDate: string;
  timestamp: string;
  // kW currently being used
  power: number;
  // kWh - last meter import register
  lastMeterConsumption: number;
  // kWh - last meter export register
  lastMeterProduction: number;
  // kWh since midnight
  accumulatedConsumption: number;
  // kWh since midnight
  accumulatedProduction: number;
  accumulatedConsumptionLastHour: number;
  accumulatedProductionLastHour: number;
  // kW (min consumption since midnight)
  minPower: number;
  // kW (max consumption since midnight)
  maxPower: number;
  minPowerProduction: number;
  maxPowerProduction: number;
  voltagePhase1: number;
  voltagePhase2: number;
  voltagePhase3: number;
  currentL1: number;
  currentL2: number;
  currentL3: number;
};
