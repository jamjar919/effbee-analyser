// @flow
import { TOGGLE_SHOWROOT, SAVE_NETWORK_DATA, NEXT_NETWORK_EDGE_OPTION, FIT_GROUPS } from '../actions/network';
import type { networkType, Action } from './types';
import { defaultNetworkType } from './defaultTypes';

const allEdgeTypes = ['continuous', 'dynamic']

function isConnectedToRoot(edge) {
    return (edge.from === 'root') || (edge.to === 'root')
}

function isSubset(small, large) {
    if (small.length > large.length) {
        return false;
    }
    return small.reduce((val, current) => val && (large.indexOf(current) > -1), true)
}

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
            console.log("computing network data...")

            /** compute network data */
            const rootName = profileApi.getFullName();

            const friendNodes = friendsApi.get()
                .map(friend => ({
                    label: friend.prettyName,
                    id: friend.name,
                    shape: "dot"
                }))
                .map(node => {
                    const chatsBetweenRoot = messageApi.chatsBetween([rootName, node.id])
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
                    const chatsBetween = messageApi.chatsBetween([f1.id, f2.id])
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
                            color: {
                                inherit: "both"
                            }
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
        }
        case FIT_GROUPS: {
            const api = action.payload.api;
            const {
                messageApi
            } = api

            const {
                nodes,
                edges
            } = state.networkData

            const GROUP_MAX = action.payload.maxGroupSize

            let currentGroup = 1;
            const groups = {};
            if (state.networkData) {
                // groups start at nil
                nodes.forEach(node => {
                    groups[node.id] = false
                });

                // rank group chats
                const chats = messageApi.messages.filter(chat => chat.participants.length > 2).map(chat => ({
                    ...chat,
                    score: ((chat.messages.length) / chat.participants.length)
                }))
                chats.sort((a,b) => b.score - a.score)

                // absorb subsets of chats with higher score
                for (let i = 0; i < chats.length; i += 1) {
                    const candidate = chats[i]
                    const toMergeIds = []
                    const toMerge = []
                    for (let j = i + 1; j < chats.length; j += 1) {
                        // detect subset 
                        const merge = chats[j]
                        if (isSubset(merge.participants.map(p => p.name), candidate.participants.map(p => p.name))) {
                            toMergeIds.push(j)
                            toMerge.push(chats[j])
                        }
                    }   
                    toMergeIds.sort((a, b) => b - a)
                    toMergeIds.forEach(id => {
                        chats.splice(id, 1)
                    })
                }

                // assign groups bottom up
                chats.reverse()
                chats.forEach(chat => {
                    chat.participants.forEach(person => {
                        groups[person.name] = currentGroup
                    })
                    currentGroup += 1
                })

                const hasBeenSwapped = {}
                Object.keys(groups).forEach(person => {
                    hasBeenSwapped[person] = false;
                })

                let madeSwap = true;
                while (madeSwap) {
                    madeSwap = false
                    // count number of groups
                    const countGroups = {}
                    for (let i = 0; i < currentGroup; i += 1) {
                        countGroups[i] = 0;
                    }
                    Object.keys(groups).forEach(person => {
                        countGroups[groups[person]] += 1
                    })

                    // merge smaller groups into larger ones 
                    // eslint-disable-next-line no-loop-func
                    Object.keys(groups).forEach(person => {
                        const group = groups[person]
                        if (
                            (countGroups[group] <= GROUP_MAX) &&
                            (hasBeenSwapped[person] === false)
                        ) {
                            // reassign to highest weighted group
                            const connectingEdges = edges.filter(edge => (edge.to === person || edge.from === person));
                            const edgeCount = {}
                            connectingEdges.forEach(edge => {
                                let otherPerson = edge.to;
                                if (otherPerson === person) {
                                    otherPerson = edge.from
                                }
                                const potentialGroup = groups[otherPerson]
                                if (typeof edgeCount[potentialGroup] === "undefined") {
                                    edgeCount[potentialGroup] = 0
                                }
                                edgeCount[potentialGroup] += edge.numMessages
                            })
                            delete edgeCount.false;

                            // find group with highest connection to node 
                            const maxGroup = Object.keys(edgeCount).reduce((currentMaxGroup, currentGroup) => {
                                if (
                                    (currentMaxGroup === false) ||
                                    (edgeCount[currentGroup] > edgeCount[currentMaxGroup])
                                ) {
                                    return currentGroup;
                                }
                                return currentMaxGroup;
                            }, false)

                            // reassign the group
                            groups[person] = maxGroup;
                            madeSwap = true
                            hasBeenSwapped[person] = true
                        }
                    })
                }

                // reassign numbers to a sensible range
                let newCurrentGroup = 1;
                const mapping = {}
                Object.keys(groups).forEach(person => {
                    const currentGroup = groups[person]
                    if (typeof mapping[currentGroup] === "undefined") {
                        mapping[currentGroup] = newCurrentGroup
                        newCurrentGroup += 1
                    }
                    groups[person] = mapping[currentGroup]
                }) 
            }
            return {
                ...state,
                groups
            }
        }
        default:
            return state;
    }
}
