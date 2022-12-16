import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';
import { Component, inject, LOCALE_ID } from '@angular/core';
import { SocketService } from './socket.service';
import { map, Observable, tap } from 'rxjs';
import { AsyncPipe, DatePipe, DecimalPipe, JsonPipe, NgIf, registerLocaleData, TitleCasePipe } from '@angular/common';
import localeNo from '@angular/common/locales/no';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CurrentComponent } from './current.component';
import { MultiChart } from './models';

registerLocaleData(localeNo);


@Component({
  standalone: true,
  imports: [ NxWelcomeComponent, RouterModule, AsyncPipe, DecimalPipe, JsonPipe, DatePipe, MatToolbarModule, MatIconModule, CurrentComponent, TitleCasePipe, NgIf ],
  selector: 'elwiz-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  providers: [
    SocketService,
    { provide: LOCALE_ID, useValue: 'no-NO' },
  ]
})
export class AppComponent {
  private service = inject(SocketService);
  public power$: Observable<number> = this.service.getData('power');
  public currentComsumption$ = this.power$.pipe(map(value => [ { name: 'Consumption', value: value } ]));
  public status$: Observable<string> = this.service.getData('status');
  public lastUpdate$: Observable<string> = this.service.getData('timestamp');
  public meter$: Observable<number> = this.service.getData('lastMeterConsumption');
  public lastHour$: Observable<number> = this.service.getData('accumulatedConsumptionLastHour');
  public consumption$: Observable<Array<MultiChart>> = this.service.consumptions$.pipe(tap(console.log));
}
