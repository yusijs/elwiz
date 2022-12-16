import { Component, Input } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { MultiChart, Series } from './models';
import { DecimalPipe, JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'elwiz-current',
  styles: [
    `.grid {
      display: grid;
      grid-template-columns: 450px 750px;
    }`
  ],
  template: `
    <div class="grid">
      <ngx-charts-gauge
        [view]="[400, 400]"
        [scheme]="colorScheme"
        [results]="currentConsumption"
        [legend]="false"
        [min]="0"
        [max]="30"
        units="kW"></ngx-charts-gauge>

      <ngx-charts-bar-vertical-2d
        [view]="[700, 400]"
        [scheme]="colorScheme"
        [results]="data"
        [xAxis]="true"
        [yAxis]="true"
        legendTitle="Forklaring"
        [legend]="true">
        <ng-template #tooltipTemplate
                     let-model="model">
          <span style="font-weight: bold">{{ model.name }}:</span>
          <span *ngIf="model.name !== 'Voltage'"> {{ model.value | number:'1.2-2' }}</span>
          <span *ngIf="model.name === 'Voltage'"> {{ model.value * 100 | number:'1.2-2' }}</span>
        </ng-template>
      </ngx-charts-bar-vertical-2d>
    </div>
  `,
  imports: [
    NgxChartsModule,
    JsonPipe,
    DecimalPipe
  ]
})
export class CurrentComponent {
  @Input()
  data: Array<MultiChart> | null = [];
  @Input()
  currentConsumption: Array<Series> = [];

  colorScheme: Color = {
    domain: [ '#5AA454', '#A10A28', '#C7B42C', '#AAAAAA' ],
    name: '',
    selectable: true,
    group: ScaleType.Linear
  };
}
