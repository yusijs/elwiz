import { List3 } from '@elwiz/common';

export const list3Data: Array<List3 & { hex: string }> = new Array(23)
  .fill({
    type: 'list3',
    date: '',
    power: 1.743,
    meterVersion: 'AIDON_V0001',
    meterId: '7359992891237028',
    meterType: '6534',
    powerProduction: 0,
    powerReactive: 0,
    powerProductionReactive: 380,
    currentL1: 20,
    currentL2: 54,
    currentL3: 2,
    voltagePhase1: 2343,
    voltagePhase2: 2328,
    voltagePhase3: 2361,
    lastMeterConsumption: 1000,
    lastMeterProduction: 0,
    lastMeterConsumptionReactive: 872.65,
    lastMeterProductionReactive: 6283.08,
    weekDay: 'Sun',
    maxPower: 0,
    minPower: 0,
    hex: ''
  }).map((r, i) => ( {
    ...r,
    date: `2022-10-01T${`${i}`.padStart(2, '0')}:05:00.000Z`,
    lastMeterConsumption: 1000 * ( i + 1 )
  } ));
