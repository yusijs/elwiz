import { ElwizPrice, List2, List3 } from '@elwiz/common';
import { eachDayOfInterval, endOfMonth, setHours, startOfMonth } from 'date-fns';

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

export const list2Data: Array<List2 & { hex: string }> = new Array(50)
  .fill({
    type: 'list2',
    date: '',
    power: parseFloat(( Math.random() * 10 ).toFixed(3)),
    meterVersion: 'AIDON_V0001',
    meterId: '7359992891237028',
    meterType: '6534',
    powerProduction: 0,
    powerReactive: 0,
    powerProductionReactive: 380,
    currentL1: 20,
    currentL2: 54,
    currentL3: 2,
    voltagePhase1: 234.3,
    voltagePhase2: 232.8,
    voltagePhase3: 236.1,
    weekDay: 'Sun',
    maxPower: 0,
    minPower: 0,
    hex: ''
  } as List2).map((r, i) => ( {
    ...r,
    date: `2022-10-01T10:${`${( i + 1 )}`.padStart(2, '0')}:00.000Z`,
  } ));

const d = new Date();
const start = startOfMonth(d);
const end = endOfMonth(d);
const interval: Interval = { start, end };
const range = eachDayOfInterval(interval);
export const priceData: Array<ElwizPrice> = range.flatMap(r => {
  const arr = new Array(23)
    .fill({
      date: null,
      time_start: null,
      time_end: null,
      price: null,
      monthlyAverage: null,
      dailyAverage: null,
    }).map((d, i) => {
      const time_start = setHours(r, i);
      const time_end = setHours(r, i + 1);
      return {
        date: r.toISOString(),
        time_start,
        time_end,
        price: Math.random() * 1000,
        monthlyAverage: 0,
        dailyAverage: 0,
      };
    });
  const avg = arr.map(v => v.price).reduce((a, b) => a + b, 0) / arr.length;
  return arr.map(v => ( { ...v, dailyAverage: avg, monthlyAverage: 0 } ));
});
