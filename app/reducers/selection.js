// @flow
import { SELECT_FRIEND } from '../actions/selection';
import type { selectionType, Action } from './types';
import { defaultSelectionType } from './defaultTypes';

export default function selectFriend(state: selectionType = defaultSelectionType, action: Action) {
  switch (action.type) {
    case SELECT_FRIEND:
      return {
        type: 'FRIEND',
        selection: action.payload
      }
    default:
      return state;
  }
}
