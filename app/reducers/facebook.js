import type { Action, facebookType } from './types';
import { defaultFacebookType } from './defaultTypes';
import ProfileApi from '../facebookapi/profile'
import FriendsApi from '../facebookapi/friends'
import MessagesApi from '../facebookapi/messages'
import { REFRESH_API } from '../actions/facebook';
import AdsAndBusinessesApi from '../facebookapi/adsbusinesses';

export default function facebook(state: facebookType = defaultFacebookType, action: Action) {
    switch (action.type) {
        case REFRESH_API:
            return {
                profileApi: new ProfileApi(),
                friendsApi: new FriendsApi(),
                messageApi: new MessagesApi(),
                adsAndBusinessesApi: new AdsAndBusinessesApi()
            };
        default:
            return state;
    }
}
