// @flow
import { TOGGLE_SHOWROOT, SAVE_NETWORK_DATA, NEXT_NETWORK_EDGE_OPTION, FIT_GROUPS } from '../actions/network';
import { getNetworkData, group } from '../facebookapi/network'
import type { networkType, Action } from './types';
import { defaultNetworkType } from './defaultTypes';

const allEdgeTypes = ['continuous', 'dynamic']

export default function toggleShowRoot(state: networkType = defaultNetworkType, action: Action) {
    switch (action.type) {
        case TOGGLE_SHOWROOT:
            return {
                ...state,
                showRoot: !state.showRoot
            }
        case NEXT_NETWORK_EDGE_OPTION: {
            const currentEdgeType = state.edgeType;
            let nextIndex = allEdgeTypes.indexOf(currentEdgeType) + 1
            if (nextIndex > allEdgeTypes.length - 1) {
                nextIndex = 0; 
            }
            return {
                ...state,
                edgeType: allEdgeTypes[nextIndex]
            }
        }
        case SAVE_NETWORK_DATA: {
            const api = action.payload;
            const {
                profileApi,
                messageApi,
                friendsApi
            } = api

            const networkData = getNetworkData(profileApi.getFullName(), friendsApi.get(), messageApi.getMessages())
            return {
                ...state,
                networkData
            }
        }
        case FIT_GROUPS: {
            const api = action.payload.api;
            const {
                messageApi
            } = api

            const groups = group(messageApi.getMessages(), state.networkData, action.payload.maxGroupSize)
            return {
                ...state,
                groups
            }
        }
        default:
            return state;
    }
}
