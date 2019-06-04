import fs from 'fs';
import FacebookApi from "./api";

class FriendsApi extends FacebookApi {
    constructor() {
        try {
            super()
            const file = `${super.getRoot()}/friends/friends.json`;
            const contents = fs.readFileSync(file, { encoding: "utf-8" })
            this.friends = JSON.parse(contents).friends
                .filter(
                    (friend, i, arr) => arr.filter(
                        friend2 => friend2.name === friend.name
                    ).length < 2
                )
                
        } catch (e) {
            console.error(e)
            return undefined;
        } finally {
            this.ranking = {
                cached: false,
                afterTimestamp: false
            }
        }
    }

    get() {
        return this.friends;
    }

    getRanking(root, messageApi, afterTimestamp = false) {
        console.log(afterTimestamp)

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
}

export default FriendsApi