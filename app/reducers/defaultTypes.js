import ProfileApi from '../facebookapi/profile'
import FriendsApi from '../facebookapi/friends'
import MessagesApi from '../facebookapi/messages'

export const defaultNetworkType = {
    showRoot: false,
    networkData: false,
    edgeType: 'continuous',
    groups: {}
}

export const defaultSelectionType = {
    friend: false,
    chat: false,
    messages: {
        allMessages: [],
        selectedWord: "",
        index: -1
    },
}

export const defaultFacebookType = {
    profileApi: new ProfileApi(),
    friendsApi: new FriendsApi(),
    messageApi: new MessagesApi()
}