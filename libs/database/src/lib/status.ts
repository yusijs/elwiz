import { DataTypes, Model } from 'sequelize';

type Status = {
  status: string;
}

export class OnlineStatus extends Model<Status> {
}

export const OnlineStatusAttributes = {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  }
};
