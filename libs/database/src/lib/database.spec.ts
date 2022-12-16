/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ElwizConfig, ElwizLogger } from '@elwiz/common';
import { initModels } from './database';
import { list3Data } from './__tests/data';

const config: ElwizConfig = {} as ElwizConfig;

config.database = {
  dialect: 'sqlite',
  storage: ':memory:'
};
config.logLevel = 'error';

const logger = new ElwizLogger(config).logger;

describe('Init models', () => {
  let models: Awaited<ReturnType<typeof initModels>>;
  beforeEach(async () => {
    models = await initModels(config, logger);
    for ( const d of list3Data ) {
      await models.List3Data.create(d);
    }
  });
  it('should initialize with sqlite', async () => {
    expect(models.List1Data).toBeDefined();
  });

  describe('List3', () => {

    it('should calculate accumulatedConsumptionLastHour', async () => {
      const all = await models.List3Data.findAll();
      all.forEach((ent, index) => {
        if ( index === 0 ) {
          expect(ent.getDataValue('accumulatedConsumptionLastHour')).toBeNull();
        } else {
          const current = list3Data[ index ];
          const prev = list3Data[ index - 1 ];
          // @ts-ignore
          const actual = current.lastMeterConsumption - prev.lastMeterConsumption;
          const saved = ent.getDataValue('accumulatedConsumptionLastHour');
          expect(saved).toEqual(actual);
        }
      });
    });

    it('should calculate accumulatedConsumption', async () => {
      const all = await models.List3Data.findAll();
      const lastSaved = all[ all.length - 1 ].getDataValue('accumulatedConsumption');
      const actualFirst = list3Data[ 0 ].lastMeterConsumption;
      const actualLast = list3Data[ list3Data.length - 1 ].lastMeterConsumption;
      console.info(`Expecting ${lastSaved} to equal ${actualLast - actualFirst}`);
      expect(lastSaved).toEqual(actualLast - actualFirst);
    });
  });
});
