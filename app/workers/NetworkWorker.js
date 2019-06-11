
onmessage = (e) => {
    const api = e.data;
    const messageApi = api.messageApi;

    const friendNodes = api.friendsApi.get()
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

    const edgesChats = []
    for (let i = 0; i < friendNodes.length; i += 1) {
        for (let j = i + 1; j < friendNodes.length; j += 1) {
            const f1 = friendNodes[i];
            const f2 = friendNodes[j];
            const chatsBetween = messageApi.chatsBetween([f1.label, f2.label])
            const numMessages = chatsBetween.count
            const numChats = chatsBetween.chats.length
            const isRoot = isConnectedToRoot({from: f1.id, to: f2.id})
            if (numChats > 0) {
                edgesChats.push({
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

    postMessage({
        friendNodes,
        edgesChats
    })
}