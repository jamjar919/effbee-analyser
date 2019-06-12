import ProfileApi from '../facebookapi/profile'
import FriendsApi from '../facebookapi/friends'
import MessagesApi from '../facebookapi/messages'

export const defaultNetworkType = {
    showRoot: false,
    networkData: false
}

export const defaultSelectionType = {
    type: '',
    selection: false
}

export const defaultFacebookType = {
    profileApi: new ProfileApi(),
    friendsApi: new FriendsApi(),
    messageApi: new MessagesApi()
}