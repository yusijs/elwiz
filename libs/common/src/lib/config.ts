import { IClientPublishOptions, QoS } from 'mqtt';

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

type PubOpts = {
  qos?: QoS;
  retain?: boolean;
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
  list1Opts: IClientPublishOptions;
  list2Opts: IClientPublishOptions;
  list3Opts: IClientPublishOptions;
  statusOpts: IClientPublishOptions;
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
  /**
   * kamstrup not supported right now
   */
  meterType: 'kaifa' | 'aidon' | 'kamstrup';
  // database: 'sqlite' | 'mysql' | 'postgres' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle';
  // sqlite: SqliteConnection;
  database: DatabaseConnection;
}
