// @flow
import { TOGGLE_SHOWROOT } from '../actions/network';
import type { networkType, Action } from './types';
import { defaultNetworkType } from './defaultTypes';

export default function toggleShowRoot(state: networkType = defaultNetworkType, action: Action) {
  switch (action.type) {
    case TOGGLE_SHOWROOT:
      return {
        ...state,
        showRoot: !state.showRoot
      }
    default:
      return state;
  }
}
