import { List1Data, List2Data, List3Data, Price, PulseStatus } from '@elwiz/database';

export type State = {
  db: {
    Price: typeof Price;
    List1Data: typeof List1Data;
    List2Data: typeof List2Data;
    List3Data: typeof List3Data;
    PulseStatus: typeof PulseStatus;
  }
}

export const state: State = {
  db: null
};
