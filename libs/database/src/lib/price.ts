import { CreateOptions, DataTypes, Model, Op } from 'sequelize';
import { ElwizPrice } from '@elwiz/common';
import { ModelHooks } from 'sequelize/types/hooks';
import { Attributes, ModelAttributes } from 'sequelize/types/model';
import { endOfMonth, startOfMonth } from 'date-fns';

export class Price extends Model<ElwizPrice> {
}


export const PriceAttributes: ModelAttributes<Price> = {
  time_start: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,

  },
  time_end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dailyAverage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  monthlyAverage: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
};


export const priceHooks: Partial<ModelHooks<Price, Attributes<Price>>> = {
  beforeCreate: async function (list: Price, options: CreateOptions<unknown>): Promise<void> {
    const pricesForMonth = await Price.findAll({
      where: {
        time_start: {
          [ Op.gte ]: startOfMonth(list.getDataValue('time_start'))
        },
        time_end: {
          [ Op.lte ]: endOfMonth(list.getDataValue('time_start'))
        }
      }
    });
    const withThis = [ ...pricesForMonth, list ];
    const monthlyAverage = withThis
      .map(price => price.getDataValue('dailyAverage'))
      .reduce((a, b) => a + b, 0) / withThis.length;
    list.setDataValue('monthlyAverage', parseFloat(monthlyAverage.toFixed(3)));
  }
};
