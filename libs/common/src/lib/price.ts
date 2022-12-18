export type ExtPrice = {
  NOK_per_kWh: number;
  EUR_per_kWh: number;
  EXR: number;
  time_start: Date;
  time_end: Date;
}

export type ElwizPrice = {
  price: number;
  time_start: Date;
  time_end: Date;
  dailyAverage: number;
  monthlyAverage: number;
}
