import { amsDecoderKaifa } from './kaifa';

const hex = {
  list3: '7EA09B01020110EEAEE6E7000F40000000090C07E60A100715000AFF800000021209074B464D5F30303109103639373036333134303337353736313509084D413330344833450600000D6206000000000600000000060000003306000029250600002FED0600001210060000091506000000000600000929090C07E60A100715000AFF8000000604F00BD4060000000006022388EB060020B37DAB327E',
  list2: '7EA079010201108093E6E7000F40000000090C07E60A1007150014FF800000020D09074B464D5F30303109103639373036333134303337353736313509084D413330344833450600000D62060000000006000000000600000034060000291A0600002FF4060000120D06000009150600000000060000092802527E',
  list1: '7EA027010201105A87E6E7000F40000000090C07E60A1007150012FF80000002010600000D5FA12E7E'
};

const values = {
  list3: {
    'type': 'list3',
    'powImpActive': 3426,
    'powExpActive': 0,
    'powImpReactive': 0,
    'powExpReactive': 51,
    'currentL1': 10533,
    'currentL2': 12269,
    'currentL3': 4624,
    'voltageL1': 2325,
    'voltageL2': 0,
    'voltageL3': 2345,
    'accumulatedConsumption': 82840532,
    'accumulatedProduction': 0,
    'cumuHourPowImpReactive': 35883243,
    'cumuHourPowExpReactive': 2143101,
    'meterVersion': 'KFM_00',
    'meterId': '697063140375761',
    'meterType': 'MA304H3',
    'weekDay': 'Wed',
    'date': '2022-11-16 21:00:10'
  },
  list2: {
    'type': 'list2',
    'powImpActive': 3426,
    'powExpActive': 0,
    'powImpReactive': 0,
    'powExpReactive': 52,
    'currentL1': 10522,
    'currentL2': 12276,
    'currentL3': 4621,
    'voltageL1': 2325,
    'voltageL2': 0,
    'voltageL3': 2344,
    'accumulatedConsumption': null,
    'accumulatedProduction': null,
    'cumuHourPowImpReactive': null,
    'cumuHourPowExpReactive': null,
    'meterVersion': 'KFM_00',
    'meterId': '697063140375761',
    'meterType': 'MA304H3',
  },
  list1: {
    'type': 'list1',
    'powImpActive': 3423,
    'powExpActive': null,
    'powImpReactive': null,
    'powExpReactive': null,
    'currentL1': null,
    'currentL2': null,
    'currentL3': null,
    'voltageL1': null,
    'voltageL2': null,
    'voltageL3': null,
    'accumulatedConsumption': null,
    'accumulatedProduction': null,
    'cumuHourPowImpReactive': null,
    'cumuHourPowExpReactive': null,
    'meterVersion': null,
    'meterId': null,
    'meterType': null,
  }
};

describe('amsDecoderKaifa', () => {
  it('should decode list3 correctly', () => {
    const list3Data = amsDecoderKaifa(hex.list3);
    const { hex: _hex, ...data } = list3Data;
    expect(data).toEqual(values.list3);
  });
  it('should decode list2 correctly', () => {
    const list2Data = amsDecoderKaifa(hex.list2);
    const { hex: _hex, date, weekDay, ...data } = list2Data;
    expect(data).toEqual(values.list2);
  });
  it('should decode list1 correctly', () => {
    const list1Data = amsDecoderKaifa(hex.list1);
    const { hex: _hex, date, weekDay, ...data } = list1Data;
    expect(data).toEqual(values.list1);
  });
  it('should return list.type = null when invalid hex', () => {
    const invalidData = amsDecoderKaifa('AABBCC');
    expect(invalidData.type).toBeNull();
  });
});
