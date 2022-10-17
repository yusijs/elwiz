import { DataTypes, Model } from 'sequelize';
import { List1, List2, List3, Status } from '@elwiz/common';

type WithHex<T> = T & { hex: string; createdAt?: Date; updatedAt?: Date; id?: number; };

export class List1Data extends Model<WithHex<Omit<List1, 'type'>>> {
}

export const List1Attributes = {
  powImpActive: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  hex: {
    type: DataTypes.STRING,
    allowNull: true
  }
};

export class List2Data extends Model<WithHex<Omit<List2, 'type'>>> {
}

export const List2Attributes = {
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  hex: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weekDay: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meterVersion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meterId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meterType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  powImpActive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  minPower: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  maxPower: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  avgPower: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powExpActive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powImpReactive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powExpReactive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  currentL1: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  currentL2: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  currentL3: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltageL1: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltageL2: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltageL3: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  meterDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
};

export class List3Data extends Model<WithHex<Omit<List3, 'type'>>> {
}

export const List3Attributes = {
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  hex: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weekDay: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meterVersion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meterId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meterType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  powImpActive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  minPower: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  maxPower: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powExpActive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powImpReactive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powExpReactive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  currentL1: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  currentL2: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  currentL3: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltageL1: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltageL2: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltageL3: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  meterDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cumuHourPowImpActive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  cumuHourPowExpActive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  cumuHourPowImpReactive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  cumuHourPowExpReactive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  accumulatedConsumptionLastHour: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  accumulatedConsumption: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  accumulatedProductionLastHour: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  accumulatedProduction: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  customerPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lastHourCost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  spotPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
};

export class PulseStatus extends Model<Status> {
}


export const PulseStatusAttributes = {
  rssi: {
    type: DataTypes.INTEGER,
  },
  ch: {
    type: DataTypes.INTEGER,
  },
  ssid: {
    type: DataTypes.STRING,
  },
  usbV: {
    type: DataTypes.STRING,
  },
  Vin: {
    type: DataTypes.STRING,
  },
  Vcap: {
    type: DataTypes.STRING,
  },
  Vbck: {
    type: DataTypes.STRING,
  },
  Build: {
    type: DataTypes.STRING,
  },
  Hw: {
    type: DataTypes.STRING,
  },
  bssid: {
    type: DataTypes.STRING,
  },
  Uptime: {
    type: DataTypes.INTEGER,
  },
  mqttcon: {
    type: DataTypes.INTEGER,
  },
  pubcnt: {
    type: DataTypes.INTEGER,
  },
  rxcnt: {
    type: DataTypes.INTEGER,
  },
  wificon: {
    type: DataTypes.INTEGER,
  },
  wififail: {
    type: DataTypes.INTEGER,
  },
  bits: {
    type: DataTypes.INTEGER,
  },
  cSet: {
    type: DataTypes.INTEGER,
  },
  Ic: {
    type: DataTypes.INTEGER,
  },
  crcerr: {
    type: DataTypes.INTEGER,
  },
  cAx: {
    type: DataTypes.FLOAT,
  },
  cB: {
    type: DataTypes.INTEGER,
  },
  heap: {
    type: DataTypes.INTEGER,
  },
  baud: {
    type: DataTypes.INTEGER,
  },
  meter: {
    type: DataTypes.STRING,
  },
  ntc: {
    type: DataTypes.FLOAT,
  },
  ct: {
    type: DataTypes.INTEGER,
  },
  dtims: {
    type: DataTypes.INTEGER,
  },
};
