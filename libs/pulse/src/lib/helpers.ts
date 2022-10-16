import { format } from 'date-fns';

export function addZero(num: string | number): string {
  return `${num}`.padStart(2, '0');
}


export function getMacAddress(id: string) {
  return id.substr(10, 2)
    + ':' + id.substr(8, 2)
    + ':' + id.substr(6, 2)
    + ':' + id.substr(4, 2)
    + ':' + id.substr(2, 2)
    + ':' + id.substr(0, 2);
}

export function upTime(secsUp: number) {
  const d = new Date();
  d.setSeconds(secsUp);
  const up = format(new Date(), `yyyy-MM-dd'T'HH:mm:ss`);
  return Number(up.substr(8, 2)) - 1
    + ' day(s) ' + up.substr(11, 8);
}
