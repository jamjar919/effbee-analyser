// @flow
import { SELECT_FRIEND, SELECT_CHAT, SELECT_MESSAGES, SELECT_MESSAGES_INDEX } from '../actions/selection';
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
        case SELECT_MESSAGES: {
            const { allMessages, selectedWord } = action.payload
            return {
                ...state,
                messages: {
                    allMessages,
                    selectedWord,
                    index: -1
                },
            }
        }
        case SELECT_MESSAGES_INDEX: {
            return {
                ...state,
                messages: {
                    ...state.messages,
                    index: action.payload
                }
            }
        }
        default:
            return state;
    }
}
