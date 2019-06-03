// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import network from './network';
import selection from './selection';
import facebook from './facebook';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    selection,
    counter,
    network,
    facebook
  });
}
