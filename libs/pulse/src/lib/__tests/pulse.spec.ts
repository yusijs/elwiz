import { ElwizConfig, ElwizLogger } from '@elwiz/common';
import { Pulse } from '../pulse';

const config: ElwizConfig = {} as ElwizConfig;

config.database = {
  dialect: 'sqlite',
  storage: ':memory:'
};
config.logLevel = 'error';
config.haBaseTopic = '/elwiz';

const logger = new ElwizLogger(config).logger;
describe('pulse', () => {
  let pulse: Pulse;
  let deviceSpy: jest.SpyInstance;
  beforeEach(() => {
    pulse = new Pulse(config, logger);
    pulse.haBaseTopic = config.haBaseTopic;
    deviceSpy = jest.spyOn(pulse.device, 'emit');
  });
  it('should emit devices on init', () => {
    pulse.init();
    expect(deviceSpy).toHaveBeenCalledTimes(16);
  });
  it('should emit online', () => {
    const hex = '48656C6C6F';
    const buf = Buffer.from(hex, 'hex');
    pulse.handleMessages(buf);
    expect(deviceSpy).toHaveBeenCalledWith('announce', {
      topic: config.haBaseTopic + '/status',
      announce: 'online',
      pubOpts: { qos: 0, retain: false }
    });
  });
});
