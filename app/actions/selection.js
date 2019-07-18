// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const SELECT_FRIEND = 'SELECT_FRIEND';
export function selectFriendAction(dispatch) {
  return name => dispatch({
    type: SELECT_FRIEND,
    payload: name
  });
}

export const SELECT_CHAT = 'SELECT_CHAT'
export function selectChatAction(dispatch) {
  return chat => dispatch({
    type: SELECT_CHAT,
    payload: chat
  });
}

export const SELECT_MESSAGES = 'SELECT_MESSAGES'
export function selectMessagesAction(dispatch) {
  return (allMessages, selectedWord = "", dateRange = [-1, -1]) => dispatch({
    type: SELECT_MESSAGES,
    payload: { allMessages, selectedWord, dateRange }
  });
}

export const SELECT_MESSAGES_INDEX = 'SELECT_MESSAGES_INDEX'
export function selectMessagesIndexAction(dispatch) {
  return (messagesIndex) => dispatch({
    type: SELECT_MESSAGES_INDEX,
    payload: messagesIndex 
  });
}