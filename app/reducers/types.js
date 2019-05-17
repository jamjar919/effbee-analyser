import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type networkType = {
  showRoot: boolean
}

export type selectionType = {
  type: string,
  selection: object
}

export type stateType = {
  +counter: number,
  network: networkType
};

export type Action = {
  +type: string,
  payload: object
};

export type GetState = () => stateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
