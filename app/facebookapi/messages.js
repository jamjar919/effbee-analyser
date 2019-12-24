/* eslint-disable class-methods-use-this */
import fs from 'fs';
import { join } from 'path';
import moment from 'moment';
import FacebookApi from "./api";
import SettingsFile from '../SettingsFile';

function getAllMessageFiles(directory) {
  const store = new SettingsFile();
  const maxMessageFiles = store.get("maxMessageFiles") || 10000000;
  return fs.readdirSync(directory)
    .filter(name => name.match(/message_([0-9])+\.json/))
    .filter((name, i) => i < maxMessageFiles)
    .map(name => join(directory, name))
}


class MessagesApi extends FacebookApi {
    constructor() {
        super();
        try {
            const directories = `${super.getRoot()}/messages/inbox/`;
            const isDirectory = source => fs.lstatSync(source).isDirectory();
            const getDirectories = source =>
                fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory);
            const titleCount = {};
            this.messages = getDirectories(directories).map(directory => {
              console.log(directory, getAllMessageFiles(directory))
                const messages = getAllMessageFiles(directory).map(fileName => this.readFacebookJson(fileName))
                                        .reduce((result, next) => result.concat(next.messages), []);

                const file = `${directory}/message_1.json`;
                const newestDetails = this.readFacebookJson(file)

                // duplicate renaming
                const { title, participants } = newestDetails;

                if (!(title in titleCount)) {
                    titleCount[title] = 0;
                }
                titleCount[title] += 1;

                let modifiedTitle = title;
                if (titleCount[title] > 1) {
                    modifiedTitle += ` (${titleCount[title] - 1})`
                }

                return {
                    participants: participants.map(p => ({
                        name: p.name,
                        count: messages.filter(message => message.sender_name === p.name).length
                    })),
                    title: modifiedTitle,
                    prettyTitle: this.fixEncoding(modifiedTitle),
                    file,
                    messages: messages.map((message, index) => {
                        const toReturn = message;
                        toReturn.index = index;
                        toReturn.prettySenderName = this.fixEncoding(toReturn.sender_name)
                        if (typeof message.content !== "undefined") {
                            toReturn.content = this.fixEncoding(message.content)
                        }
                        return toReturn;
                    }),
                    directory
                };
            });

            // identify first and last message sent, ever...
            this.lastTimestamp = this.messages.reduce((currentLastTimestamp, chat) => {
                if (chat.messages.length < 1) {
                    return currentLastTimestamp
                }
                return chat.messages.reduce((currentLastTimestampTwo, message) => {
                    if (Math.floor(message.timestamp_ms/1000) > currentLastTimestampTwo) {
                        return Math.floor(message.timestamp_ms/1000);
                    }
                    return currentLastTimestampTwo;
                }, currentLastTimestamp)
            }, 0);

            this.firstTimestamp = this.messages.reduce((currentFirstTimestamp, chat) => {
                if (chat.messages.length < 1) {
                    return currentFirstTimestamp
                }
                if (Math.floor(chat.messages[chat.messages.length - 1].timestamp_ms/1000) < currentFirstTimestamp) {
                    return Math.floor(chat.messages[chat.messages.length - 1].timestamp_ms/1000)
                }
                return currentFirstTimestamp;
            }, moment().unix());

            this.loaded = true;
        } catch (e) {
            console.log("couldn't load messages api")
            console.error(e);
            this.messages = [];
            this.loaded = false;
        }
    }

    getMessages() {
        return this.messages;
    }

    chats(name) {
        // filter to chats where this member is present
        const chats = this.messages.filter(details =>
            (details.participants.map(p => p.name).indexOf(name) >= 0)
        );

        chats.sort((a, b) => b.messages.length - a.messages.length)

        // count message totals for all people in all the conversations
        const peopleMap = {}
        chats.forEach(chat => {
            chat.participants.forEach(p => {
                if (!(p.name in peopleMap)) {
                    peopleMap[p.name] = {
                        groups: 0,
                        messages: 0
                    }
                }
                peopleMap[p.name].messages += p.count
                peopleMap[p.name].groups += 1
            })
        });

        // remove self reference
        delete peopleMap[name];

        const peopleRanking = Object.keys(peopleMap).map(key => ({
                name: key,
                groups: peopleMap[key].groups,
                messages: peopleMap[key].messages
            })
        ).sort((a, b) => (
            b.messages - a.messages
        ))

        return {
            chats,
            name,
            peopleRanking
        }
    }

    // return only group chats with named participants in
    groupsWith(names) {
        return this.messages.filter(details => {
            const participants = details.participants.map(p => p.name);
            return (
                names.reduce((prev, current) => prev && (participants.indexOf(current) >= 0), true)
            )
        });
    }

    // Names is an array
    // filterMessages = true => filter to only messages by named people
    // afterTimestamp = 1000293 => filter to only messages after that unix time
    chatsBetween(names, filterMessages = false, afterTimestamp = false) {
        let chats = this.groupsWith(names)

        // filter messages to only include those by the named participants
        if (filterMessages) {
            chats = chats.map(chat => ({
                ...chat,
                messages: chat.messages.filter(message => (names.indexOf(message.sender_name) > -1))
            }))
        }

        if (afterTimestamp !== false) {
            chats = chats.map(chat => ({
                ...chat,
                messages: chat.messages.filter(message =>
                    message.timestamp_ms > (afterTimestamp*1000)
                )
            }))
        }

        // count total messages
        let count = 0;
        const countBreakdown = {};
        names.forEach(name => {
            countBreakdown[name] = 0
        })

        chats.forEach(chat => {
            chat.participants
            .forEach(participant => {
                if (names.indexOf(participant.name) >= 0) {
                    const toAdd = chat.messages.filter(message => message.sender_name === participant.name).length
                    count += toAdd
                    countBreakdown[participant.name] += toAdd
                }
            })
        })

        chats.sort((a, b) => b.messages.length - a.messages.length)

        return {
            chats,
            count,
            countBreakdown,
            names
        }
    }

    // root is the name of your person
    // to is the name of the messages
    // timeinterval is a number in seconds, the message counts will then be organised in portions this large
    // this can be improved performance wise
    chatsPerTimeInterval(root, to, timeInterval) {
        // find chats between names
        const names = [root, to]
        const chats = this.groupsWith(names).sort((a, b) => b.messages.length - a.messages.length);

        // find first message in the group
        let firstTimestamp = Math.floor((+ new Date()) / 1000); // current unix time in seconds
        let lastTimestamp = 0
        chats.forEach(chat => {
            chat.messages.forEach(message => {
                if (Math.floor(message.timestamp_ms/1000) < firstTimestamp) {
                    firstTimestamp = Math.floor(message.timestamp_ms/1000)
                }
                if (Math.floor(message.timestamp_ms/1000) > lastTimestamp) {
                    lastTimestamp = Math.floor(message.timestamp_ms/1000)
                }
            })
        })

        const messagesPerInterval = []
        for(let time = firstTimestamp; time < lastTimestamp; time += timeInterval) {

            const messages = {}
            chats.forEach(chat => {
                messages[chat.title] = []
            })

            const count = {}
            count[root] = 0;
            count[to] = 0;
            chats.forEach(chat => {
                chat.messages.forEach(message => {
                    const timestamp = Math.floor(message.timestamp_ms / 1000);
                    if (names.indexOf(message.sender_name) > -1) {
                        if (
                            (timestamp > time) &&
                            (timestamp < (time + timeInterval))
                        ) {
                            count[message.sender_name] += 1
                            messages[chat.title].push({
                                content: message.content,
                                timestamp: Math.floor(message.timestamp_ms/1000),
                                sender: message.sender_name
                            })
                        }
                    }
                })
            })

            messagesPerInterval.push({
                start: time,
                end: time + timeInterval,
                count,
                messages
            })
        }

        return {
            firstTimestamp,
            lastTimestamp,
            chatNames: chats.map(chat => chat.title),
            messagesPerInterval,
        }
    }

    // take a object with chats in form
    // [
    //  { messages: Array(Object), participants: Array(Object), title: string }
    // ]
    getTimeDetails(chats, locale = 'en-gb') {
        moment.locale(locale)

        // init hourmap
        const hourMap = {}
        const hourArray = [...Array(24).keys()]
        hourArray.forEach(hour => {
            hourMap[hour] = 0
        })

        chats.forEach(chat => {
            chat.messages.forEach(message => {
                hourMap[moment(message.timestamp_ms).hour()] += 1
            })
        })
        return hourMap;
    }

    bucketMessagesByTimeInterval(chats, firstTimestamp, lastTimestamp, timeInterval, filterBuckets = true) {
        // bucket messages based on time interval
        // calculate number of buckets
        const timespan = lastTimestamp - firstTimestamp;
        const numBuckets = Math.ceil(timespan / timeInterval) + 1
        let buckets = []
        for (let i = 0; i < numBuckets; i += 1) {
            buckets.push({
                start: firstTimestamp + (timeInterval * i),
                end: firstTimestamp + (timeInterval * (i + 1)),
                messages: []
            })
        }

        chats.forEach(chat => {
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

        // for each bucket, if there's no messages, remove it
        if (filterBuckets) {
            buckets = buckets.filter(bucket => bucket.messages.length > 0)
        }

        return buckets;
    }
}

export default MessagesApi
