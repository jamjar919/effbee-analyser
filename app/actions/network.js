// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const TOGGLE_SHOWROOT = 'TOGGLE_SHOWROOT';

export function toggleShowRootAction(dispatch) {
  return () => dispatch({
    type: TOGGLE_SHOWROOT
  });
}

export const SAVE_NETWORK_DATA = 'SAVE_NETWORK_DATA';

export function saveNetworkDataAction(dispatch) {
  return api => dispatch({
    type: SAVE_NETWORK_DATA,
    payload: api
  });
}

export const NEXT_NETWORK_EDGE_OPTION = 'NEXT_NETWORK_EDGE_OPTION';

export function nextNetworkEdgeOptionAction(dispatch) {
  return api => dispatch({
    type: NEXT_NETWORK_EDGE_OPTION,
  });
}