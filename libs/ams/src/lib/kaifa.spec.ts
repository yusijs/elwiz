import { amsDecoderKaifa } from './kaifa';


const sampleDataSets = [
  {
    'type': 'list3',
    'power': 3426,
    'powerProduction': 0,
    'powerReactive': 0,
    'powerProductionReactive': 51,
    'currentL1': 10533,
    'currentL2': 12269,
    'currentL3': 4624,
    'voltagePhase1': 2325,
    'voltagePhase2': 0,
    'voltagePhase3': 2345,
    'lastMeterConsumption': 82840532,
    'lastMeterProduction': 0,
    'lastMeterConsumptionReactive': 35883243,
    'lastMeterProductionReactive': 2143101,
    'meterVersion': 'KFM_001',
    'meterId': '6970631403757615',
    'meterType': 'MA304H3E',
    'meterDate': '2022-11-16 21:00:10',
    hex: '7EA09B01020110EEAEE6E7000F40000000090C07E60A100715000AFF800000021209074B464D5F30303109103639373036333134303337353736313509084D413330344833450600000D6206000000000600000000060000003306000029250600002FED0600001210060000091506000000000600000929090C07E60A100715000AFF8000000604F00BD4060000000006022388EB060020B37DAB327E'
  },
  {
    'type': 'list2',
    'power': 3426,
    'powerProduction': 0,
    'powerReactive': 0,
    'powerProductionReactive': 52,
    'currentL1': 10522,
    'currentL2': 12276,
    'currentL3': 4621,
    'voltagePhase1': 2325,
    'voltagePhase2': 0,
    'voltagePhase3': 2344,
    'lastMeterConsumption': null,
    'lastMeterProduction': null,
    'lastMeterConsumptionReactive': null,
    'lastMeterProductionReactive': null,
    'meterVersion': 'KFM_001',
    'meterId': '6970631403757615',
    'meterType': 'MA304H3E',
    hex: '7EA079010201108093E6E7000F40000000090C07E60A1007150014FF800000020D09074B464D5F30303109103639373036333134303337353736313509084D413330344833450600000D62060000000006000000000600000034060000291A0600002FF4060000120D06000009150600000000060000092802527E',
  },
  {
    'type': 'list1',
    'power': 3423,
    'powerProduction': null,
    'powerReactive': null,
    'powerProductionReactive': null,
    'currentL1': null,
    'currentL2': null,
    'currentL3': null,
    'voltagePhase1': null,
    'voltagePhase2': null,
    'voltagePhase3': null,
    'lastMeterConsumption': null,
    'lastMeterProduction': null,
    'lastMeterConsumptionReactive': null,
    'lastMeterProductionReactive': null,
    'meterVersion': null,
    'meterId': null,
    'meterType': null,
    hex: '7EA027010201105A87E6E7000F40000000090C07E60A1007150012FF80000002010600000D5FA12E7E'
  },
  {
    type: 'list2',
    power: 370,
    powerProduction: 0,
    powerReactive: 0,
    powerProductionReactive: 401,
    currentL1: 1024,
    currentL2: 698,
    currentL3: 904,
    voltagePhase1: 2391,
    voltagePhase2: 2382,
    voltagePhase3: 2385,
    lastMeterConsumption: null,
    lastMeterProduction: null,
    lastMeterConsumptionReactive: null,
    lastMeterProductionReactive: null,
    meterVersion: 'KFM_001',
    meterId: '6970631409038480',
    meterType: 'MA304H4',
    hex: '7EA07801020110C498E6E7000F40000000090C07E60A1606163728FF800000020D09074B464D5F30303109103639373036333134303930333834383009074D4133303448340600000172060000000006000000000600000191060000040006000002BA06000003880600000957060000094E0600000951E7027E',
  },
  {
    type: 'list3',
    power: 364,
    powerProduction: 0,
    powerReactive: 0,
    powerProductionReactive: 401,
    currentL1: 1012,
    currentL2: 681,
    currentL3: 909,
    voltagePhase1: 2390,
    voltagePhase2: 2384,
    voltagePhase3: 2384,
    lastMeterConsumption: 2102885,
    lastMeterProduction: 0,
    lastMeterConsumptionReactive: 292,
    lastMeterProductionReactive: 1365041,
    meterVersion: 'KFM_001',
    meterId: '6970631409038480',
    meterType: 'MA304H4',
    meterDate: '2022-11-22 23:00:10',
    hex: '7EA09A01020110AAA5E6E7000F40000000090C07E60A160617000AFF800000021209074B464D5F30303109103639373036333134303930333834383009074D413330344834060000016C06000000000600000000060000019106000003F406000002A9060000038D060000095606000009500600000950090C07E60A160617000AFF800000060020166506000000000600000124060014D431684D7E'
  }
]

describe('amsDecoderKaifa', () => {
  describe('Convert hex to data', () => {
    sampleDataSets
      .forEach((ent, index) => {
        it(`${index.toString().padStart(3, '0')}: should convert data for ${ent.type}`, () => {
          const { hex, ...result } = ent;
          const { hex: _hex, date, weekDay, ...data } = amsDecoderKaifa(hex);
          expect(data).toEqual(result);
        });
      });
  });
  it('should return list.type = null when invalid hex', () => {
    const invalidData = amsDecoderKaifa('AABBCC');
    expect(invalidData.type).toBeNull();
  });
});
