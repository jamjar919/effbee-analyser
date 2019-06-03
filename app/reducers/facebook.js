import type { Action, facebookType } from './types';
import { defaultFacebookType } from './defaultTypes'

export default function facebook(state: facebookType = defaultFacebookType, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}
