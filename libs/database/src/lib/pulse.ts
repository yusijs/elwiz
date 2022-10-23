import { CreateOptions, DataTypes, Model, Op } from 'sequelize';
import { List1, List2, List3, Status } from '@elwiz/common';
import { startOfDay, startOfHour } from 'date-fns';
import { ModelHooks } from 'sequelize/types/hooks';
import { Attributes } from 'sequelize/types/model';

type WithHex<T> = T & { hex: string; createdAt?: Date; updatedAt?: Date; id?: number; };

export class List1Data extends Model<WithHex<Omit<List1, 'type'>>> {
}

export const List1Attributes = {
  power: {
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
    type: DataTypes.TEXT,
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
  power: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  maxPowerToday: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  minPowerToday: {
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
  powerProduction: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powerReactive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powerProductionReactive: {
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
  voltagePhase1: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltagePhase2: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltagePhase3: {
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

export const list2Hooks: Partial<ModelHooks<List2Data, Attributes<List2Data>>> = {
  beforeCreate: async function (list: List2Data, options: CreateOptions<unknown>): Promise<void> {
    const current = <Date>list.getDataValue('createdAt');
    const hr = startOfHour(current);
    const rest = await List2Data.findAll({ where: { createdAt: { [Op.gte]: hr } } });
    const power = rest.map(e => e.getDataValue('power'));
    const max = Math.max(...power, list.getDataValue('power'));
    const min = Math.min(...power, list.getDataValue('power'));
    const avg = (list.getDataValue('power') + power.reduce((a, b) => a + b, 0)) / (power.length + 1);
    list.setDataValue('maxPower', max);
    list.setDataValue('minPower', min);
    list.setDataValue('avgPower', avg);
  }
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
  power: {
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
  powerProduction: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powerReactive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  powerProductionReactive: {
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
  voltagePhase1: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltagePhase2: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  voltagePhase3: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  meterDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastMeterConsumption: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lastMeterProduction: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lastMeterConsumptionReactive: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lastMeterProductionReactive: {
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

export const list3Hooks: Partial<ModelHooks<List3Data, Attributes<List3Data>>> = {
  beforeCreate: async function (list: List3Data, options: CreateOptions<unknown>): Promise<void> {
    if ( !list ) {
      console.error('List3 value is undefined', list);
    }
    const current = <Date>list.getDataValue('createdAt');
    const hr = startOfDay(current);
    const rest = await List3Data.findAll({ where: { createdAt: { [ Op.gte ]: hr } }, order: [ [ 'createdAt', 'DESC' ] ] });
    const previous = await List3Data.findOne({ order: [ [ 'createdAt', 'DESC' ] ] });
    if ( previous ) {
      const lastMeterConsumption = previous.getDataValue('lastMeterConsumption');
      const lastMeterProduction = previous.getDataValue('lastMeterProduction');
      list.setDataValue('accumulatedConsumptionLastHour', list.getDataValue('lastMeterConsumption') - lastMeterConsumption);
      list.setDataValue('accumulatedProductionLastHour', list.getDataValue('lastMeterProduction') - lastMeterProduction);
    }
    const firstOfDay = rest[ rest.length - 1 ];
    if ( firstOfDay ) {
      const lastMeterConsumption = firstOfDay.getDataValue('lastMeterConsumption');
      const lastMeterProduction = firstOfDay.getDataValue('lastMeterProduction');
      list.setDataValue('accumulatedConsumption', list.getDataValue('lastMeterConsumption') - lastMeterConsumption);
      list.setDataValue('accumulatedProduction', list.getDataValue('lastMeterProduction') - lastMeterProduction);
    }
    const peak = rest.map(e => e.getDataValue('peakConsumptionSinceMidnight') ?? 0);
    const bottom = rest.map(e => e.getDataValue('lowestConsumptionSinceMidnight') ?? 0);
    const max = Math.max(...peak, list.getDataValue('peakConsumptionSinceMidnight') ?? 0);
    const min = Math.min(...bottom, list.getDataValue('lowestConsumptionSinceMidnight') ?? 0);
    list.setDataValue('peakConsumptionSinceMidnight', max);
    list.setDataValue('minPower', min);
  }
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
