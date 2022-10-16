import { QoS } from 'mqtt-packet';

type SqliteConnection = {
  dialect: 'sqlite';
  storage: string;
};

type DatabaseConnection = {
  database?: string;
  username?: string;
  password?: string;
  host?: string;
  port?: number;
  storage?: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle'
}

export interface ElwizConfig {
  mqttBroker: string;
  brokerPort: number;
  userName: string;
  password?: any;
  topic: string;
  pubTopic: string;
  pubStatus: string;
  pubNotice: string;
  willMessage: string;
  greetMessage: string;
  onlineMessage: string;
  offlineMessage: string;
  DEBUG: boolean;
  REPUBLISH: boolean;
  haPublish: boolean;
  haBaseTopic: string;
  statusRetain: boolean;
  statusQos: QoS;
  list1Retain: boolean;
  list1Qos: QoS;
  list2Retain: boolean;
  list2Qos: QoS;
  list3Retain: boolean;
  list3Qos: QoS;
  keepDays: number;
  runNodeSchedule: boolean;
  scheduleHours: number[];
  scheduleMinutes: number[];
  computePrices: boolean;
  priceCurrency: string;
  priceRegion: number;
  supplierKwhPrice: number;
  supplierMonthPrice: number;
  supplierVatPercent: number;
  spotVatPercent: number;
  gridKwhPrice: number;
  gridDayPrice: number;
  gridVatPercent: number;
  logLevel?: 'error' | 'warn' | 'info' | 'verbose' | 'debug';
  logFormat?: number;
  logOutput?: 'file' | 'console';
  // database: 'sqlite' | 'mysql' | 'postgres' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle';
  // sqlite: SqliteConnection;
  database: DatabaseConnection;
}
