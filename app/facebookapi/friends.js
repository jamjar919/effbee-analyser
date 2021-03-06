import FacebookApi from "./api";

class FriendsApi extends FacebookApi {
    constructor() {
      super();
      try {
            const file = `${super.getRoot()}/friends/friends.json`;
            this.friends = this.readFacebookJson(file).friends
                .map(friend => ({ ...friend, prettyName: this.fixEncoding(friend.name) }))
                .filter(
                    (friend, i, arr) => arr.filter(
                        friend2 => friend2.name === friend.name
                    ).length < 2
                );
            this.loaded = true;
        } catch (e) {
            console.log("couldn't load friends api")
            this.loaded = false;
        } finally {
            this.ranking = {
                cached: false,
                afterTimestamp: false
            }
        }
    }

    get(beforeTime = Math.round((new Date()).getTime() / 1000)) {
        return this.friends.filter(f => f.timestamp < beforeTime);
    }

    getRanking(root, messageApi, afterTimestamp = false) {
        // ranking doesn't change, so return local
        if ((this.ranking.cached) && (this.ranking.afterTimestamp === afterTimestamp)) {
            return this.ranking.ranking
        }

        // need to query message data so an api object must be provided
        if (!messageApi) {
            return false;
        }

        const friends = this.get()

        const ranking = friends.map(friend => {
            const chats = messageApi.chatsBetween([root, friend.name], true, afterTimestamp)
            return {
                name: friend.name,
                messages: chats.count,
                groups: chats.chats.length,
                ...chats
            }
        })

        ranking.sort((a, b) => b.count - a.count)

        this.ranking = {
            cached: true,
            afterTimestamp,
            ranking
        };

        return this.ranking.ranking;
    }

    getRankingPerTimeInterval(root, messageApi, timeInterval) {
        // need to query message data so an api object must be provided
        if (!messageApi) {
            return false;
        }

        const friends = this.get();
        const messages = messageApi.getMessages();

        const firstTimestamp = messageApi.firstTimestamp
        const lastTimestamp = messageApi.lastTimestamp

        const buckets = messageApi.bucketMessagesByTimeInterval(messages, firstTimestamp, lastTimestamp, timeInterval)

        return buckets.map(bucket => {
            const count = {}
            bucket.messages.forEach(message => {
                if (!count[message.sender_name]) {
                    count[message.sender_name] = 0
                }
                count[message.sender_name] += 1
            })
            return {
                ranking: Object.keys(count).map(key => ({
                            name: key,
                            count: count[key]
                        }))
                        .sort((a, b) =>  b.count - a.count)
                        .filter(v => (v.name !== root)),
                start: bucket.start,
                end: bucket.end
            }
        })
    }
}

export default FriendsApi
