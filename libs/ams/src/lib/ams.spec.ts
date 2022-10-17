import { amsDecoder } from './ams';
import { ElwizConfig } from '@elwiz/common';
import { Logger } from 'winston';

describe('ams', () => {

  const kaifaBuf = Buffer.from('7EA027010201105A87E6E7000F40000000090C07E60A1007150012FF80000002010600000D5FA12E7E', 'hex');
  const aidonBuf = Buffer.from('7EA02A410883130413E6E7000F40000000000101020309060100010700FF060000020002020F00161BC12C7E', 'hex');
  const logger = console as unknown as Logger;
  const config = {} as ElwizConfig;

  it('should choose aidon from config', () => {
    config.meterType = 'aidon';
    const data = amsDecoder(aidonBuf, config, logger);
    expect(data.type).toBe('list1');
  });

  it('should choose kaifa from config', () => {
    config.meterType = 'kaifa';
    const data = amsDecoder(kaifaBuf, config, logger);
    expect(data.type).toBe('list1');
  });

  it('should try both and return functioning data if no metertype given', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.meterType = null;
    const data = amsDecoder(aidonBuf, config, logger);
    expect(data.type).toBe('list1');
  });
});
