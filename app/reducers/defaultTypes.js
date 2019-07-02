import ProfileApi from '../facebookapi/profile'
import FriendsApi from '../facebookapi/friends'
import MessagesApi from '../facebookapi/messages'

export const defaultNetworkType = {
    showRoot: false,
    networkData: false,
    edgeType: 'continuous'
}

export const defaultSelectionType = {
    friend: false,
    chat: false,
}

export const defaultFacebookType = {
    profileApi: new ProfileApi(),
    friendsApi: new FriendsApi(),
    messageApi: new MessagesApi()
}