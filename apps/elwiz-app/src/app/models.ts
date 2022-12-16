export type Series = {
  name: string;
  value: number;
}

export type MultiChart = {
  name: string;
  series: Array<Series>
};
