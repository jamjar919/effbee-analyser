// @flow
import { TOGGLE_SHOWROOT, SAVE_NETWORK_DATA, NEXT_NETWORK_EDGE_OPTION } from '../actions/network';
import type { networkType, Action } from './types';
import { defaultNetworkType } from './defaultTypes';

const allEdgeTypes = ['continuous', 'dynamic']

function isConnectedToRoot(edge) {
    return (edge.from === 'root') || (edge.to === 'root')
}

export default function toggleShowRoot(state: networkType = defaultNetworkType, action: Action) {
  switch (action.type) {
    case TOGGLE_SHOWROOT:
        return {
            ...state,
            showRoot: !state.showRoot
        }
    case NEXT_NETWORK_EDGE_OPTION:
        const currentEdgeType = state.edgeType;
        let nextIndex = allEdgeTypes.indexOf(currentEdgeType) + 1
        if (nextIndex > allEdgeTypes.length - 1) {
            nextIndex = 0; 
        }
        return {
            ...state,
            edgeType: allEdgeTypes[nextIndex]
        }
    case SAVE_NETWORK_DATA:
        console.log("computing network data...")

        const api = action.payload;

        /** compute network data */
        const rootName = api.profileApi.getFullName();
        const messageApi = api.messageApi;
        const friendsApi = api.friendsApi;

        const friendNodes = friendsApi.get()
        .map(friend => friend.name)
        .map(name => ({
            label: name,
            id: name,
            shape: "dot"
        }))
        .map(node => {
            const chatsBetweenRoot = messageApi.chatsBetween([rootName, node.label])
            return {
                ...node,
                value: chatsBetweenRoot.count
            }
        });
        friendNodes.push({ label: rootName, id: 'root', physics: false })

        const friendEdges = []
        for (let i = 0; i < friendNodes.length; i += 1) {
            for (let j = i + 1; j < friendNodes.length; j += 1) {
                const f1 = friendNodes[i];
                const f2 = friendNodes[j];
                const chatsBetween = messageApi.chatsBetween([f1.label, f2.label])
                const numMessages = chatsBetween.count
                const numChats = chatsBetween.chats.length
                const isRoot = isConnectedToRoot({from: f1.id, to: f2.id})
                if (numChats > 0) {
                    friendEdges.push({
                        from: f1.id,
                        to: f2.id,
                        numMessages,
                        numChats,
                        value: numChats,
                        length: 300,
                        physics: !isRoot,
                        dashed: isRoot,
                    });
                }
            }
        }

        const networkData = {
            nodes: friendNodes,
            edges: friendEdges
        }

        return {
            ...state,
            networkData
        }
    default:
        return state;
    }
}
