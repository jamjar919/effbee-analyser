import fs from 'fs';
import FacebookApi from "./api";
import moment from 'moment';

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
        
        // bucket messages based on time interval
        // calculate number of buckets 
        console.log("aaaa")
        const timespan = lastTimestamp - firstTimestamp;
        const numBuckets = Math.ceil(timespan / timeInterval) + 1
        const buckets = []
        for (let i = 0; i < numBuckets; i += 1) {
            buckets.push({
                start: firstTimestamp + (timeInterval * i),
                end: firstTimestamp + (timeInterval * (i + 1)),
                messages: []
            })
        }

        console.log("span", timespan)
        console.log("range", firstTimestamp, lastTimestamp)

        messages.forEach(chat => {
            chat.messages.forEach(message => {
                
                const messageTimestamp = Math.floor(message.timestamp_ms/1000);
                let b = 0;
                while (
                    buckets[b].end < messageTimestamp
                ) {
                    b += 1;
                }
                
                buckets[b].messages.push(message)
            });
        });

        console.log(buckets)

        let er = 0;
        // sanity check 
        buckets.forEach((bucket, b) => {
            const s = bucket.start;
            const e = bucket.end;
            bucket.messages.forEach(message => {
                const messageTimestamp = Math.floor(message.timestamp_ms/1000);
                if (messageTimestamp < s ||
                    messageTimestamp > e) {
                        er += 1
                    }
            })
        })

        return buckets;
    }
}

export default FriendsApi