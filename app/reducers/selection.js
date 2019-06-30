// @flow
import { SELECT_FRIEND, SELECT_CHAT } from '../actions/selection';
import type { selectionType, Action } from './types';
import { defaultSelectionType } from './defaultTypes';

export default function selectFriend(state: selectionType = defaultSelectionType, action: Action) {
  switch (action.type) {
    case SELECT_FRIEND:
      return {
        ...state,
        friend: action.payload
      }
    case SELECT_CHAT: 
      return {
        ...state,
        chat: action.payload
      }
    default:
      return state;
  }
}
