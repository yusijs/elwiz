import { format } from 'date-fns';
import { List1, List2, List3, Lists } from '@elwiz/common';
import { getIndexOfHex, getRelevantPayload, hex_to_ascii, hex_to_dec, hex_to_dec_signed } from './hex';

const getDate = (payload: string) => {
  const pattern = hexPatterns.date;
  if (!pattern) {
    return null;
  }
  let index = getIndexOfHex(payload, pattern, 24);
  if (index === null) {
    return null;
  }
  const year = hex_to_dec(payload.substring(index, index + 4));
  index = index + 4;
  const month = hex_to_dec(payload.substring(index, index + 2));
  index = index + 2;
  const day = hex_to_dec(payload.substring(index, index + 2));
  index = index + 4;
  const hour = hex_to_dec(payload.substring(index, index + 2));
  index = index + 2;
  const min = hex_to_dec(payload.substring(index, index + 2));
  index = index + 2;
  const sek = hex_to_dec(payload.substring(index, index + 2));
  return `${year}-${month}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sek).padStart(2, '0')}`;
};

const hexPatterns: { [k in keyof Omit<List3, 'type' | 'weekDay' | 'minPower' | 'maxPower'>]: string } = {
  power: '020309060100010700FF06',
  meterVersion: '020209060101000281FF0A0B',
  meterId: '020209060000600100FF0A10',
  meterType: '020209060000600107FF0A04',
  powerProduction: '020309060100020700FF06',
  powerReactive: '020309060100030700FF06',
  powerProductionReactive: '020309060100040700FF06',
  currentL1: '0203090601001F0700FF10',
  currentL2: '020309060100330700FF10',
  currentL3: '020309060100470700FF10',
  voltagePhase1: '020309060100200700FF12',
  voltagePhase2: '020309060100340700FF12',
  voltagePhase3: '020309060100480700FF12',
  date: '020209060000010000FF090C',
  lastMeterConsumption: '020309060100010800FF06',
  lastMeterProduction: '020309060100020800FF06',
  lastMeterConsumptionReactive: '020309060100030800FF06',
  lastMeterProductionReactive: '020309060100040800FF06',
};

export const amsDecoderAidon = (hex: string): List1 | List2 | List3 => {
  const listData = {
    type: null,
    date: format(new Date(), `yyyy-MM-dd HH:mm:ss`)
  } as Lists;

  const _power = hex_to_dec(getRelevantPayload(hex, hexPatterns.power, 22, 8));
  listData.power = _power ? _power / 1000 : null;
  listData.meterVersion = hex_to_ascii(getRelevantPayload(hex, hexPatterns.meterVersion, 24, 22));
  listData.meterId = hex_to_ascii(getRelevantPayload(hex, hexPatterns.meterId, 24, 32));
  listData.meterType = hex_to_ascii(getRelevantPayload(hex, hexPatterns.meterType, 24, 8));
  listData.powerProduction = hex_to_dec(getRelevantPayload(hex, hexPatterns.powerProduction, 22, 8));
  listData.powerReactive = hex_to_dec(getRelevantPayload(hex, hexPatterns.powerReactive, 22, 8));
  listData.powerProductionReactive = hex_to_dec(getRelevantPayload(hex, hexPatterns.powerProductionReactive, 22, 8));
  listData.currentL1 = hex_to_dec_signed(getRelevantPayload(hex, hexPatterns.currentL1, 22, 4));
  listData.currentL2 = hex_to_dec_signed(getRelevantPayload(hex, hexPatterns.currentL2, 22, 4));
  listData.currentL3 = hex_to_dec_signed(getRelevantPayload(hex, hexPatterns.currentL3, 22, 4));
  listData.voltagePhase1 = hex_to_dec(getRelevantPayload(hex, hexPatterns.voltagePhase1, 22, 4));
  listData.voltagePhase2 = hex_to_dec(getRelevantPayload(hex, hexPatterns.voltagePhase2, 22, 4));
  listData.voltagePhase3 = hex_to_dec(getRelevantPayload(hex, hexPatterns.voltagePhase3, 22, 4));
  listData.date = getDate(hex);
  listData.weekDay = format(new Date(2022, 9, 16, 12, 0, 0), 'eee');
  const _lastMeterConsumption = hex_to_dec(getRelevantPayload(hex, hexPatterns.lastMeterConsumption, 22, 8));
  const _lastMeterProduction = hex_to_dec(getRelevantPayload(hex, hexPatterns.lastMeterProduction, 22, 8));
  const _lastMeterConsumptionReactive = hex_to_dec(getRelevantPayload(hex, hexPatterns.lastMeterConsumptionReactive, 22, 8));
  const _lastMeterProductionReactive = hex_to_dec(getRelevantPayload(hex, hexPatterns.lastMeterProductionReactive, 22, 8));
  // For some reason these numbers are missing a 0, so instead of just W they are W*10
  listData.lastMeterConsumption = _lastMeterConsumption !== null ? _lastMeterConsumption / 100 : null;
  listData.lastMeterProduction = _lastMeterProduction !== null ? _lastMeterProduction / 100 : null;
  listData.lastMeterConsumptionReactive = _lastMeterConsumptionReactive !== null ? _lastMeterConsumptionReactive / 100 : null;
  listData.lastMeterProductionReactive = _lastMeterProductionReactive !== null ? _lastMeterProductionReactive / 100 : null;

  if (listData.lastMeterConsumption) {
    listData.type = 'list3';
  } else if (listData.meterType) {
    listData.type = 'list2';
  } else if (listData.power) {
    listData.type = 'list1';
  }

  return { ...listData, hex: hex } as List1 | List2 | List3;
};


