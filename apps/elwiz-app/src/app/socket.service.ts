import { inject, Injectable } from '@angular/core';
import * as mqtt from 'paho-mqtt';
import { BehaviorSubject, combineLatest, filter, map, Observable, ReplaySubject } from 'rxjs';
import { MultiChart } from './models';
import { HttpClient } from '@angular/common/http';
import { ElwizConfig } from '@elwiz/common';

export type Data = {
  path: string;
  payload: number | string;
}

const KEYS = [
  'status',
  'power',
  'timestamp',
  'voltagePhase1',
  'voltagePhase2',
  'voltagePhase3',
  'currentL1',
  'currentL2',
  'currentL3',
  'lastMeterConsumption',
  'accumulatedConsumptionLastHour',
  'price',
  'averagePrice',
  'averageMonthPrice'
] as const;

@Injectable()
export class SocketService {
  private http = inject(HttpClient);
  private socket!: mqtt.Client;
  private stream$ = new ReplaySubject<Data>();
  public data$ = this.stream$.asObservable();
  private error$ = new ReplaySubject<mqtt.MQTTError>();
  private reconnectAttempts = 1;
  private current$ = new BehaviorSubject<Array<{ name: string; value: number }>>([
    { name: 'currentL1', value: 0.1 },
    { name: 'currentL2', value: 0.1 },
    { name: 'currentL3', value: 0.1 },
  ]);
  private voltage$ = new BehaviorSubject<Array<{ name: string; value: number }>>([
    { name: 'voltagePhase1', value: 0.1 },
    { name: 'voltagePhase2', value: 0.1 },
    { name: 'voltagePhase3', value: 0.1 },
  ]);
  public consumptions$: Observable<Array<MultiChart>> = combineLatest([ this.current$, this.voltage$ ])
    .pipe(map(([ current, voltage ]) => {
      return current.map(c => {
        const matcher = c.name.charAt(c.name.length - 1);
        const match = voltage.find(v => v.name.endsWith(matcher));
        const voltageValue = match?.value ?? 1;
        const currentValue = c.value;
        return {
          name: `Fase ${matcher}`,
          series: [
            { name: `kW`, value: ( voltageValue * currentValue ) / 1000 },
            { name: 'Ampere', value: Number(currentValue) },
            { name: 'Volt', value: Number(voltageValue) / 100 }
          ]
        };
      });
    }));

  constructor() {
    this.init()
      .subscribe(config => this.initSocket(config));
  }

  init() {
    return this.http.get<ElwizConfig>(`/api/config`);
  }

  private initSocket(config: ElwizConfig) {
    this.socket = new mqtt.Client('192.168.86.38', 9001, '/', 'elwiz-app');
    this.connect();
    this.socket.onMessageArrived = message => {
      const value = message.payloadString as unknown as number;
      const split = message.destinationName.split('/');
      const name = split[ split.length - 1 ];
      const data: Data = {
        path: message.destinationName,
        payload: isNaN(value) ? value : Number(value)
      };
      this.stream$.next(data);
      if ( name.startsWith('current') ) {
        this.setCurrent(name, value);
      }
      if ( name.startsWith('voltagePhase') ) {
        this.setVoltage(name, value);
      }
    };
    this.socket.onConnectionLost = err => {
      this.error$.next(err);
      setTimeout(() => {
        this.connect();
        this.reconnectAttempts += 1;
      }, this.reconnectAttempts * 30_000);
    };
  }

  public getData<T = string | number>(key: typeof KEYS[number]): Observable<T> {
    return this.data$.pipe(
      filter(d => d.path.endsWith(key)),
      map(v => v.payload as T)
    );
  }

  private connect() {
    this.socket.connect({
      onSuccess: () => {
        this.socket.subscribe('elwiz/#');
      },
      onFailure: err => this.error$.next(err),
      reconnect: false
    });
  }

  private setCurrent(name: string, value: number) {
    const currentValue = this.current$.value;
    this.current$
      .next(currentValue.map(v => {
        if ( name === v.name ) {
          return { name, value };
        }
        return v;
      }));
  }

  private setVoltage(name: string, value: number) {
    const currentValue = this.voltage$.value;
    this.voltage$
      .next(currentValue.map(v => {
        if ( name === v.name ) {
          return { name, value };
        }
        return v;
      }));
  }
}
