import { format } from 'date-fns';
import { DataTypes, Model, Sequelize } from 'sequelize';
import {
  List1Attributes,
  List1Data,
  List2Attributes,
  List2Data,
  List3Attributes,
  List3Data,
  PulseStatus,
  PulseStatusAttributes
} from './pulse';
import { ElwizConfig, PriceInfo } from '@elwiz/common';
import { Logger } from 'winston';


export class Price extends Model<PriceInfo> {
}

export async function addPrices(prices: Array<PriceInfo>, logger: Logger) {
  try {
    const date = prices[ 0 ].date;
    const exists = await Price.findOne({ where: { date: date } });
    if ( exists === null ) {
      for ( const price of prices ) {
        try {
          await Price.create({ ...price, date });
        } catch ( ex ) {
          logger.error(ex);
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
      logging: (sql: string, timing?: unknown) => { // "timing" contains details on insert statement
        return logger.debug(`${sql}`);
      }
    });
  }
  try {
    Price.init({
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
        get() {
          const rawValue = this.getDataValue('startTime') as unknown as Date;
          return format(rawValue, `yyyy-MM-dd HH:mm:ss`);
        }
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
    }, { sequelize, modelName: 'Price' });
    await Price.sync();
    await PulseStatus.init(PulseStatusAttributes, { sequelize, modelName: 'PulseStatus' });
    await List1Data.init(List1Attributes, { sequelize, modelName: 'List1' });
    await List2Data.init(List2Attributes, { sequelize, modelName: 'List2' });
    await List3Data.init(List3Attributes, { sequelize, modelName: 'List3' });
    await List1Data.sync();
    await List2Data.sync();
    await List3Data.sync();
    await PulseStatus.sync();
  } catch ( ex ) {
    logger.error(ex);
  }
  return {
    Price,
    List1Data,
    List2Data,
    List3Data,
    PulseStatus
  };
}

