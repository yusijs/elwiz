import { Sequelize } from 'sequelize';
import {
  List1Attributes,
  List1Data,
  List2Attributes,
  List2Data,
  list2Hooks,
  List3Attributes,
  List3Data,
  list3Hooks,
  PulseStatus,
  PulseStatusAttributes
} from './pulse';
import { ElwizConfig, ElwizPrice } from '@elwiz/common';
import { Logger } from 'winston';
import { Price, PriceAttributes, priceHooks } from './price';
import { OnlineStatus, OnlineStatusAttributes } from './status';


export async function addPrices(prices: Array<ElwizPrice>, logger: Logger) {
  try {
    const date = prices[ 0 ].time_start;
    const exists = await Price.findOne({ where: { time_start: date } });
    if ( exists === null ) {
      for ( const price of prices ) {
        try {
          await Price.create({ ...price });
        } catch ( ex ) {
          logger.error('Failed to add prices', ex);
        }
      }
      logger.verbose(`Inserted prices for ${date}`);
    }
  } catch ( ex ) {
    logger.error('Exception on price-check', ex);
  }
}

export async function initModels(config: ElwizConfig, logger: Logger) {
  const db = config.database;
  let sequelize: Sequelize;
  if ( !db.dialect ) {
    logger.info('No db dialect specified, falling back to sqlite::memory');
    sequelize = new Sequelize('sqlite::memory:');
  } else {
    sequelize = new Sequelize({
      ...db,
      logging: (sql: string) => {
        return logger.debug(`${sql}`);
      }
    });
  }
  try {
    Price.init(PriceAttributes, { sequelize, modelName: 'Price', hooks: priceHooks });
    OnlineStatus.init(OnlineStatusAttributes, { sequelize, modelName: 'OnlineStatus' });
    PulseStatus.init(PulseStatusAttributes, { sequelize, modelName: 'PulseStatus' });
    List1Data.init(List1Attributes, { sequelize, modelName: 'List1' });
    List2Data.init(List2Attributes, {
      sequelize, modelName: 'List2', hooks: list2Hooks
    });
    List3Data.init(List3Attributes, { sequelize, modelName: 'List3', hooks: list3Hooks });
    await Price.sync();
    await OnlineStatus.sync({});
    await List1Data.sync({});
    await List2Data.sync({});
    await List3Data.sync({});
    await PulseStatus.sync({});
  } catch ( ex ) {
    logger.error(ex);
  }
  return {
    Price,
    List1Data,
    List2Data,
    List3Data,
    PulseStatus,
    OnlineStatus
  };
}

