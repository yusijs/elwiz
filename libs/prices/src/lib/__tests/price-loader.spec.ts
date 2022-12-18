import { ElwizConfig, ElwizLogger } from '@elwiz/common';
import { PriceLoader } from '../price-loader';

const config = {} as ElwizConfig;

config.priceRegion = 'NO2';

const logger = new ElwizLogger(config).logger;

describe('Priceloader', () => {
  let loader: PriceLoader;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    loader = new PriceLoader(config, logger);
    spy = jest.spyOn(loader.priceData, 'next');
  });
  it('should load prices for NO2', async () => {
    const expectFirstResult = {
      NOK_per_kWh: 0.44654,
      EUR_per_kWh: 0.04377,
      EXR: 10.2019,
      time_start: '2022-11-05T00:00:00+01:00',
      time_end: '2022-11-05T01:00:00+01:00'
    };
    const date = new Date();
    date.setMonth(11);
    date.setDate(5);
    date.setFullYear(2022);
    const val = await loader.load(date);
    expect(val[ 0 ]).toEqual(expectFirstResult);
    expect(spy).toHaveBeenCalledWith(val);
  });

  it('should load all prices for NO2 in November 2022', async () => {
    const date = new Date();
    date.setMonth(10);
    date.setFullYear(2022);
    date.setDate(10);
    const prices = await loader.loadMonth(date);
    expect(prices.length).toBe(721);
  });
});
