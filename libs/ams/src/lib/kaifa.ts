import { format } from 'date-fns';
import { List1, List2, List3, Lists } from '@elwiz/common';
import { getIndexOfHex, getRelevantPayload, hex_to_ascii, hex_to_dec } from './hex';

export const amsDecoderKaifa = (hex: string): List1 | List2 | List3 => {
  const listData = {
    type: null,
    date: format(new Date(), `yyyy-MM-dd HH:mm:ss`),
    weekDay: format(new Date(), 'eee'),
    power: null,
    powerProduction: null,
    powerReactive: null,
    powerProductionReactive: null,
    currentL1: null,
    currentL2: null,
    currentL3: null,
    voltagePhase1: null,
    voltagePhase2: null,
    voltagePhase3: null,
    lastMeterConsumption: null,
    lastMeterProduction: null,
    lastMeterConsumptionReactive: null,
    lastMeterProductionReactive: null,
    meterVersion: null,
    meterId: null,
    meterType: null,
    hex
  } as Lists;

  let index = getIndexOfHex(hex, 'FF800000', 8) ?? 0;
  const elementCount = index > 0 ? <number>hex_to_dec(hex.substring(index + 2, index + 4)) : 0;
  const extraOffsetPhase3 = elementCount === 13 || elementCount === 18 ? 2 : 0;
  // 14/18 = list3. single/3-phase
  // 9/13 = list2. single/3-phase
  // 1 = list1

  if ( elementCount === 1 ) {
    listData.type = 'list1';
    listData.power = hex_to_dec(getRelevantPayload(hex, hex, index + 6, 8));
  }
  let offset: number;
  if ( elementCount >= 9 ) {
    listData.type = 'list2';
    index = index + 6;
    offset = <number>hex_to_dec(hex.substring(index, index + 2)) * 2;
    listData.meterVersion = hex_to_ascii(hex.substring(index + 2, index + offset + extraOffsetPhase3));
    index = index + 4 + offset;
    offset = <number>hex_to_dec(hex.substring(index, index + 2)) * 2;
    listData.meterId = hex_to_ascii(hex.substring(index + 2, index + offset + extraOffsetPhase3));
    index = index + 4 + offset;
    offset = <number>hex_to_dec(hex.substring(index, index + 2)) * 2;
    listData.meterType = hex_to_ascii(hex.substring(index + 2, index + offset + extraOffsetPhase3));
    index = index + 4 + offset;
    listData.power = hex_to_dec(hex.substring(index, index + 8));
    listData.powerProduction = hex_to_dec(hex.substring(index + 10, index + 18));
    listData.powerReactive = hex_to_dec(hex.substring(index + 20, index + 28));
    listData.powerProductionReactive = hex_to_dec(hex.substring(index + 30, index + 38));
    listData.currentL1 = hex_to_dec(hex.substring(index + 40, index + 48));
    listData.currentL2 = hex_to_dec(hex.substring(index + 50, index + 58));
    listData.currentL3 = hex_to_dec(hex.substring(index + 60, index + 68));
    listData.voltagePhase1 = hex_to_dec(hex.substring(index + 70, index + 78));
    listData.voltagePhase2 = hex_to_dec(hex.substring(index + 80, index + 88));
    listData.voltagePhase3 = hex_to_dec(hex.substring(index + 90, index + 98));
  }
  if (elementCount >= 14) {
    listData.type = 'list3';
    index = index + 102;
    const year = <number>hex_to_dec(hex.substring(index, index + 4));
    index = index + 4;
    const month = <number>hex_to_dec(hex.substring(index, index + 2));
    index = index + 2;
    const day = <number>hex_to_dec(hex.substring(index, index + 2));
    index = index + 4;
    const hour = <number>hex_to_dec(hex.substring(index, index + 2));
    index = index + 2;
    const min = <number>hex_to_dec(hex.substring(index, index + 2));
    index = index + 2;
    const sek = <number>hex_to_dec(hex.substring(index, index + 2));
    index = index + 2;
    const date = new Date(year, month, day, hour, min, sek);
    listData.meterDate = format(date, 'yyyy-MM-dd HH:mm:ss');
    listData.weekDay = format(date, 'eee');
    index = index + 10;
    listData.lastMeterConsumption = hex_to_dec(hex.substring(index, index + 8));
    listData.lastMeterProduction = hex_to_dec(hex.substring(index + 10, index + 18));
    listData.lastMeterConsumptionReactive = hex_to_dec(hex.substring(index + 20, index + 28));
    listData.lastMeterProductionReactive = hex_to_dec(hex.substring(index + 30, index + 38));
  }

  return { ...listData, hex: hex } as List1 | List2 | List3;
};


