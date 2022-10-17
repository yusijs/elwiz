import { amsDecoderAidon } from './aidon';

const hex = {
  list3: '7EA18A41088313EBFDE6E7000F40000000000112020209060101000281FF0A0B4149444F4E5F5630303031020209060000600100FF0A1037333539393932383931323337303238020209060000600107FF0A0436353334020309060100010700FF06000006CF02020F00161B020309060100020700FF060000000002020F00161B020309060100030700FF060000000002020F00161D020309060100040700FF060000017C02020F00161D0203090601001F0700FF10001402020FFF1621020309060100330700FF10003602020FFF1621020309060100470700FF10000202020FFF1621020309060100200700FF12092702020FFF1623020309060100340700FF12091802020FFF1623020309060100480700FF12093902020FFF1623020209060000010000FF090C07E60A0F06140000FF000000020309060100010800FF0600F9E77D02020F01161E020309060100020800FF060000000002020F01161E020309060100030800FF06000154E102020F011620020309060100040800FF060009965402020F0116202CB07E',
  list2: '7EA11E41088313EEEEE6E7000F4000000000010D020209060101000281FF0A0B4149444F4E5F5630303031020209060000600100FF0A1037333539393932383931323337303238020209060000600107FF0A0436353334020309060100010700FF060000068802020F00161B020309060100020700FF060000000002020F00161B020309060100030700FF060000000002020F00161D020309060100040700FF06000001E802020F00161D0203090601001F0700FF10001802020FFF1621020309060100330700FF10003102020FFF1621020309060100470700FF10000402020FFF1621020309060100200700FF12090C02020FFF1623020309060100340700FF12091002020FFF1623020309060100480700FF12092302020FFF16233F557E',
  list1: '7EA02A410883130413E6E7000F40000000000101020309060100010700FF060000020002020F00161BC12C7E'
};

const values = {
  list3: {
    type: 'list3',
    date: '2022-10-15 20:00:00',
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
    lastMeterConsumption: 163777.25,
    lastMeterProduction: 0,
    lastMeterConsumptionReactive: 872.65,
    lastMeterProductionReactive: 6283.08,
    weekDay: 'Sun'
  },
  list2: {
    type: 'list2',
    power: 1.672,
    meterVersion: 'AIDON_V0001',
    meterId: '7359992891237028',
    meterType: '6534',
    powerProduction: 0,
    powerReactive: 0,
    powerProductionReactive: 488,
    currentL1: 24,
    currentL2: 49,
    currentL3: 4,
    voltagePhase1: 2316,
    voltagePhase2: 2320,
    voltagePhase3: 2339,
    lastMeterConsumption: null,
    lastMeterProduction: null,
    lastMeterConsumptionReactive: null,
    lastMeterProductionReactive: null,
  },
  list1: {
    type: 'list1',
    power: 0.512,
    meterVersion: null,
    meterId: null,
    meterType: null,
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
  }
};
const list3Data = amsDecoderAidon(hex.list3);
const list2Data = amsDecoderAidon(hex.list2);
const list1Data = amsDecoderAidon(hex.list1);

describe('amsDecoderAidon', () => {
  it('should decode list3 correctly', () => {
    const { hex, ...data } = list3Data;
    expect(data).toEqual(values.list3);
  });
  it('should decode list2 correctly', () => {
    const { hex, date, weekDay, ...data } = list2Data;
    expect(data).toEqual(values.list2);
  });
  it('should decode list1 correctly', () => {
    const { hex, date, weekDay, ...data } = list1Data;
    expect(data).toEqual(values.list1);
  });
  it('should return list.type = null when invalid hex', () => {
    const invalidData = amsDecoderAidon('AABBCC');
    expect(invalidData.type).toBeNull();
  });
});
