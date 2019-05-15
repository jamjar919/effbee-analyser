// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const TOGGLE_SHOWROOT = 'TOGGLE_SHOWROOT';

export function toggleShowRoot() {
  return {
    type: TOGGLE_SHOWROOT
  };
}
