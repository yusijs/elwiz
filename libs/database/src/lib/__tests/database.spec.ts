import { ElwizConfig, ElwizLogger } from '@elwiz/common';
import { initModels } from '../database';
import { list2Data, list3Data } from './data';

const config: ElwizConfig = {} as ElwizConfig;

config.database = {
  dialect: 'sqlite',
  storage: ':memory:'
};
config.logLevel = 'error';

const logger = new ElwizLogger(config).logger;

describe('Database models', () => {
  let models: Awaited<ReturnType<typeof initModels>>;
  beforeEach(async () => {
    models = await initModels(config, logger);
    for ( const d of list3Data ) {
      await models.List3Data.create(d);
    }
    for ( const d of list2Data ) {
      await models.List2Data.create(d);
    }
  });
  it('should initialize with sqlite', async () => {
    expect(models.List1Data).toBeDefined();
  });

  describe('List3 postCreateHooks', () => {

    it('should calculate accumulatedConsumptionLastHour', async () => {
      const all = await models.List3Data.findAll();
      all.forEach((ent, index) => {
        if ( index === 0 ) {
          expect(ent.getDataValue('accumulatedConsumptionLastHour')).toBeNull();
        } else {
          const current = list3Data[ index ];
          const prev = list3Data[ index - 1 ];
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

  describe('List2 postCreateHooks', () => {
    it('should calculate min/max', async () => {
      const all = await models.List2Data.findAll();
      const expectMax = Math.max(...list2Data.map(v => v.power));
      const expectMin = Math.min(...list2Data.map(v => v.power));
      const actualMax = Math.max(...all.map(v => v.getDataValue('maxPower')));
      const actualMin = Math.min(...all.map(v => v.getDataValue('minPower')));
      expect(expectMax).toEqual(actualMax);
      expect(expectMin).toEqual(actualMin);
    });
    it('should calculate average', async () => {
      const last = await models.List2Data.findOne({ order: [ [ 'createdAt', 'DESC' ] ] });
      const expectAvg = list2Data.map(v => v.power).reduce((a, b) => a + b, 0) / list2Data.length;
      const actualAvg = last?.getDataValue('avgPower') ?? 0;
      expect(expectAvg).toEqual(actualAvg);
    });
  });
});
