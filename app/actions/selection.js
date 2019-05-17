// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const SELECT_FRIEND = 'SELECT_FRIEND';

export function selectFriendAction(dispatch) {
  return name => dispatch({
    type: SELECT_FRIEND,
    payload: name
  });
}
