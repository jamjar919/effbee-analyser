function isConnectedToRoot(edge) {
    return (edge.from === 'root') || (edge.to === 'root')
}

function isSubset(small, large) {
    if (small.length > large.length) {
        return false;
    }
    return small.reduce((val, current) => val && (large.indexOf(current) > -1), true)
}

export function getNetworkData(rootName, friends, messages, beforeTime = Math.round((new Date()).getTime() / 1000)) {
    // compute adjacency array
    const adjacency = {}
    messages
        .forEach(chat => {
            // count messages in chat
            const chatMessageCount = {}
            chat.participants.forEach(p => { chatMessageCount[p.name] = 0 })
            chat.messages
                .filter(message => (message.timestamp_ms < (beforeTime * 1000)))
                .forEach(message => { chatMessageCount[message.sender_name] += 1 })

            chat.participants.forEach(p1 => {
                chat.participants.forEach(p2 => {
                    if (typeof adjacency[p1.name] === "undefined") {
                        adjacency[p1.name] = {}
                    }
                    if (typeof adjacency[p1.name][p2.name] === "undefined") {
                        adjacency[p1.name][p2.name] = Object.assign({}, { numChats: 0, numMessages: 0 })
                    }
                    adjacency[p1.name][p2.name].numMessages += chatMessageCount[p2.name]
                    if (chatMessageCount[p2.name] > 0) {
                        adjacency[p1.name][p2.name].numChats += 1
                    }
                })
            })
        })

    console.log(adjacency)

    /** compute network data */
    const friendNodes = friends
        .map(friend => ({
            label: friend.prettyName,
            id: friend.name,
            name: friend.name,
            shape: "dot"
        }))
        .map(node => {
            let value = 0
            if (
                Object.prototype.hasOwnProperty.call(adjacency, node.id) &&
                Object.prototype.hasOwnProperty.call(adjacency[node.id], rootName)
            ) {
                value = adjacency[node.id][rootName].numMessages
            }
            return {
                ...node,
                value
            }
        });
    friendNodes.push({ label: rootName, id: 'root', physics: false, name: rootName })

    const friendEdges = []
    for (let i = 0; i < friendNodes.length; i += 1) {
        for (let j = i + 1; j < friendNodes.length; j += 1) {
            const f1 = friendNodes[i];
            const f2 = friendNodes[j];
            let numMessages = 0
            let numChats = 0
            if (
                Object.prototype.hasOwnProperty.call(adjacency, f1.name) &&
                Object.prototype.hasOwnProperty.call(adjacency[f1.name], f2.name)
            ) {
                numMessages = adjacency[f1.name][f2.name].numMessages
                numChats = adjacency[f1.name][f2.name].numChats
            }
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

    return {
        nodes: friendNodes,
        edges: friendEdges
    }
}

export function group(messages, networkData, GROUP_MAX) {
    let currentGroup = 1;
    const groups = {};
    if (networkData) {
        const {
            nodes,
            edges
        } = networkData

        // groups start at nil
        nodes.forEach(node => {
            groups[node.id] = false
        });

        // rank group chats
        const chats = messages.filter(chat => chat.participants.length > 2).map(chat => ({
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
    return groups;
}