/*export const Price = sequelize.define('Prices', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
    get() {
      const rawValue = this.getDataValue('startTime') as Date;
      return format(rawValue, `yyyy-MM-dd HH:mm:ss`)
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
})*/


import { DataTypes, Model } from 'sequelize';
import { PriceInfo } from '@elwiz/common';

export class Price extends Model<PriceInfo> {
}

export const PriceAttributes = {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
};
