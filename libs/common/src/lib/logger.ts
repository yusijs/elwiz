import { createLogger, format, Logger, transports } from 'winston';
import { ElwizConfig } from './config';

const logLevels = {
  1: 'info',
  2: 'verbose',
  3: 'debug',
};

const logTypes = {
  1: format.json,
  2: format.simple,
  3: format.prettyPrint
};

const logOutput = {
  file: transports.File,
  console: transports.Console
};

export class ElwizLogger {
  public logger: Logger;

  constructor(config: ElwizConfig) {
    let logtype = config.logFormat ?? 1;
    if ( !logTypes[ logtype ] ) {
      logtype = 1;
    }
    this.logger = createLogger({
      level: config.logLevel ?? 'info',
      format: format.combine(format.timestamp(), logTypes[ logtype ]()),
      transports: new logOutput[ config.logOutput ?? 'console' ]()
    });
  }
}
