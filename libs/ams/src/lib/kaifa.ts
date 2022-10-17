import { format } from 'date-fns';
import { List1, List2, List3, Lists } from '@elwiz/common';
import { getIndexOfHex, getRelevantPayload, hex_to_ascii, hex_to_dec } from './hex';

export const amsDecoderKaifa = (hex: string): List1 | List2 | List3 => {
  const listData = {
    type: null,
    date: format(new Date(), `yyyy-MM-dd HH:mm:ss`),
    weekDay: format(new Date(), 'eee'),
    powImpActive: null,
    powExpActive: null,
    powImpReactive: null,
    powExpReactive: null,
    currentL1: null,
    currentL2: null,
    currentL3: null,
    voltageL1: null,
    voltageL2: null,
    voltageL3: null,
    accumulatedConsumption: null,
    accumulatedProduction: null,
    cumuHourPowImpReactive: null,
    cumuHourPowExpReactive: null,
    meterVersion: null,
    meterId: null,
    meterType: null,
    hex
  } as Lists;

  let index = getIndexOfHex(hex, 'FF800000', 8) ?? 0;
  const elementCount = index > 0 ? <number>hex_to_dec(hex.substring(index + 2, index + 4)) : 0;
  // 14/18 = list3
  // 9/13 = list2
  // 1 = list1

  if ( elementCount === 1 ) {
    listData.type = 'list1';
    listData.powImpActive = hex_to_dec(getRelevantPayload(hex, hex, index + 6, 8));
  }
  let offset: number;
  if ( elementCount >= 9 ) {
    listData.type = 'list2';
    index = index + 6;
    offset = <number>hex_to_dec(hex.substring(index, index + 2)) * 2;
    listData.meterVersion = hex_to_ascii(hex.substring(index + 2, index + offset));
    index = index + 4 + offset;
    offset = <number>hex_to_dec(hex.substring(index, index + 2)) * 2;
    listData.meterId = hex_to_ascii(hex.substring(index + 2, index + offset));
    index = index + 4 + offset;
    offset = <number>hex_to_dec(hex.substring(index, index + 2)) * 2;
    listData.meterType = hex_to_ascii(hex.substring(index + 2, index + offset));
    index = index + 4 + offset;
    listData.powImpActive = hex_to_dec(hex.substring(index, index + 8));
    listData.powExpActive = hex_to_dec(hex.substring(index + 10, index + 18));
    listData.powImpReactive = hex_to_dec(hex.substring(index + 20, index + 28));
    listData.powExpReactive = hex_to_dec(hex.substring(index + 30, index + 38));
    listData.currentL1 = hex_to_dec(hex.substring(index + 40, index + 48));
    listData.currentL2 = hex_to_dec(hex.substring(index + 50, index + 58));
    listData.currentL3 = hex_to_dec(hex.substring(index + 60, index + 68));
    listData.voltageL1 = hex_to_dec(hex.substring(index + 70, index + 78));
    listData.voltageL2 = hex_to_dec(hex.substring(index + 80, index + 88));
    listData.voltageL3 = hex_to_dec(hex.substring(index + 90, index + 98));
  }
  if ( elementCount >= 14 ) {
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
    listData.date = format(date, 'yyyy-MM-dd HH:mm:ss');
    listData.weekDay = format(date, 'eee');
    index = index + 10;
    listData.accumulatedConsumption = hex_to_dec(hex.substring(index, index + 8));
    listData.accumulatedProduction = hex_to_dec(hex.substring(index + 10, index + 18));
    listData.cumuHourPowImpReactive = hex_to_dec(hex.substring(index + 20, index + 28));
    listData.cumuHourPowExpReactive = hex_to_dec(hex.substring(index + 30, index + 38));
  }

  return { ...listData, hex: hex } as List1 | List2 | List3;
};


