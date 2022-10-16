import { Client, connect, IClientOptions, IClientPublishOptions } from 'mqtt';
import { ElwizConfig } from '@elwiz/common';
import { EventEmitter } from 'events';
import { differenceInSeconds, format, formatDistance } from 'date-fns';
import { Logger } from 'winston';

export class MqttHandler {
  public client: Client;
  public stream = new EventEmitter();
  private lastMessageReceived: number = Date.now();
  private timedOut = false;

  constructor(public config: ElwizConfig, private logger: Logger) {
    const options: IClientOptions = {
      username: this.config.userName,
      password: this.config.password,
      will: {
        topic: this.config.pubNotice,
        payload: this.config.willMessage,
        qos: 1,
        retain: false
      }
    };
    this.client = connect(`mqtt://${this.config.mqttBroker}:${this.config.brokerPort}`, options);
    this.events();
  }

  public announce(topic: string, data: string, pubOpts: IClientPublishOptions = {}) {
    this.client.publish(topic, data, pubOpts);
  }

  public init() {
    setInterval(() => {
      const now = Date.now();
      if ( Math.abs(differenceInSeconds(this.lastMessageReceived, now)) > 15 ) {
        if ( !this.timedOut ) {
          this.client.publish('elwiz/sensor/status', 'offline', { retain: true, qos: 0 });
          this.logger.error(`${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}: tibber timed out`);
        }

        this.timedOut = true;
      }
    }, 1000);
    setInterval(() => {
      if ( this.timedOut ) {
        this.logger.debug('Tibber has been quiet for: ', formatDistance(this.lastMessageReceived, Date.now(), { includeSeconds: true }));
      }
    }, 30_000);

    this.client.on('message', (topic, message) => {
      if ( topic === 'tibber' ) {
        this.lastMessageReceived = Date.now();
        if ( this.timedOut ) {
          this.logger.info(`${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} Tibber back online`);
          this.client.publish('elwiz/sensor/status', 'online', { retain: true, qos: 0 });
          this.timedOut = false;
        }
        this.stream.emit('tibber', message);
      }
    });
  }

  private events() {
    this.client.on('error', (err) => {
      if ( ( err as any ).errno === 'ENOTFOUND' ) {
        this.logger.crit('\nNot connectd to broker');
        this.logger.crit('Check your "config.yaml" file\n');
        process.exit(0);
      } else
        this.logger.error(`Client error: ${err}`);
    });

    this.client.on('connect', () => {
      this.client.subscribe(this.config.topic, (err) => {
        if ( err ) {
          this.logger.error(`Subscription error: ${err}`);
        }
      });
      this.client.publish(this.config.pubNotice, this.config.greetMessage);
    });
  }
}
