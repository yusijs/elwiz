type ListCommon = {
  /**
   * type describes what type of dataset is returned
   */
  type?: 'list1' | 'list2' | 'list3';
  /**
   * powImpActive is the current consumption (instant)
   */
  power: number;
  /**
   * hex represents the buffer converted to hex
   */
  hex?: string;
}

export type List1 = ListCommon & {
  type: 'list1';
  date?: string;
  weekDay?: string;
  minPower?: number;
  maxPower?: number;
}

export type List2 = ListCommon & {
  type: 'list2';
  /**
   * Current date/time
   */
  date: string;
  /**
   * Day of week
   * @example Mon
   */
  weekDay: string;
  /**
   * Meter version
   * @example AIDON_V0001
   */
  meterVersion: string;
  /**
   * ID of your meter
   */
  meterId: string;
  /**
   * Meter type
   */
  meterType: string;
  minPower: number;
  maxPower: number;
  /**
   * Current export
   */
  powerProduction: number;
  powerReactive: number;
  powerProductionReactive: number;
  /**
   * Active current on phase1
   */
  currentL1: number;
  /**
   * Active current on phase2
   */
  currentL2: number;
  /**
   * Active current on phase3
   */
  currentL3: number;
  /**
   * Active load on phase1
   */
  voltagePhase1: number;
  /**
   * Active load on phase2
   */
  voltagePhase2: number;
  /**
   * Active load on phase3
   */
  voltagePhase3: number;
  /**
   * Date the information was sent from the meter
   */
  meterDate?: string;
}

export type List3 = Omit<List2, 'type'> & {
  type: 'list3';
  /**
   * How much power was used over the previous hour
   */
  lastHourActivePower?: number;
  /**
   * How much consumption is read from your meter (total)
   */
  lastMeterConsumption: number;
  /**
   * How much production is read from your meter (total)
   */
  lastMeterProduction: number;
  lastMeterConsumptionReactive: number;
  lastMeterProductionReactive: number;
  accumulatedConsumptionLastHour?: number;
  accumulatedConsumption?: number;
  accumulatedProductionLastHour?: number;
  accumulatedProduction?: number;
  customerPrice?: number;
  lastHourCost?: number;
  spotPrice?: number;
  startTime?: number;
  endTime?: number;
}

export type Lists = {
  [key in keyof Omit<List3, 'type'>]: List3[key] | null;
} & {
  /**
   * type describes what type of dataset is returned
   */
  type: 'list1' | 'list2' | 'list3' | null;
}
