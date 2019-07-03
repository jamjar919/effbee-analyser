// @flow
import { TOGGLE_SHOWROOT, SAVE_NETWORK_DATA, NEXT_NETWORK_EDGE_OPTION, FIT_COLORS } from '../actions/network';
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
        case FIT_COLORS: {
            const api = action.payload;
            const {
                messageApi
            } = api

            const {
                nodes,
                edges
            } = state.networkData

            const GROUP_MAX = 3

            let currentColor = 1;
            const colors = {};
            if (state.networkData) {
                // colors start at nil
                nodes.forEach(node => {
                    colors[node.id] = false
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

                // color bottom up
                chats.reverse()
                chats.forEach(chat => {
                    chat.participants.forEach(person => {
                        colors[person.name] = currentColor
                    })
                    currentColor += 1
                })

                const hasBeenSwapped = {}
                Object.keys(colors).forEach(person => {
                    hasBeenSwapped[person] = false;
                })

                let madeSwap = true;
                while (madeSwap) {
                    madeSwap = false
                    // count number of colors
                    const countColors = {}
                    for (let i = 0; i < currentColor; i += 1) {
                        countColors[i] = 0;
                    }
                    Object.keys(colors).forEach(person => {
                        countColors[colors[person]] += 1
                    })

                    console.log(countColors)

                    // merge smaller groups into larger ones 
                    // eslint-disable-next-line no-loop-func
                    Object.keys(colors).forEach(person => {
                        const color = colors[person]
                        if (
                            (countColors[color] <= GROUP_MAX) &&
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
                                const potentialColor = colors[otherPerson]
                                if (typeof edgeCount[potentialColor] === "undefined") {
                                    edgeCount[potentialColor] = 0
                                }
                                edgeCount[potentialColor] += edge.numMessages
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

                            // reassign the color
                            console.log("merging", person, "into group", maxGroup, "from group", colors[person])
                            colors[person] = maxGroup;
                            madeSwap = true
                            hasBeenSwapped[person] = true
                        }
                    })
                }

                // assign false (ungrouped) to a color
                Object.keys(colors).forEach(person => {
                    if (colors[person] === false) {
                        colors[person] = 0
                    }
                })

                // actually generate random colors
                const actualColors = {}
                for (let i = 0; i < currentColor; i += 1) {
                    actualColors[i] = `#${(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)}`
                }
                Object.keys(colors).forEach(person => {
                    colors[person] = actualColors[colors[person]]
                })
            }
            return {
                ...state,
                colors
            }
        }
        default:
            return state;
    }
}
