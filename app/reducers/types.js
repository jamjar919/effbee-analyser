import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type networkType = {
  showRoot: boolean
}

export type stateType = {
  +counter: number,
  network: networkType
};

export type Action = {
  +type: string
};

export type GetState = () => stateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
