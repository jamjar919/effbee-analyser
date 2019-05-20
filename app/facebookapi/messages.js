import fs from 'fs';
import { join } from 'path';
import FacebookApi from "./api";

class MessagesApi extends FacebookApi {
    constructor() {
        super();
        const directories = `${super.getRoot()}/messages/inbox/`;
        const isDirectory = source => fs.lstatSync(source).isDirectory()
        const getDirectories = source =>
            fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)
        this.messages = getDirectories(directories).map(directory => {
            const file = `${directory}/message_1.json`;
            const details = JSON.parse(fs.readFileSync(file, { encoding: "utf-8" }))
            return {
                participants: details.participants.map(p => ({
                    name: p.name,
                    count: details.messages.filter(message => message.sender_name == p.name).length
                })),
                title: details.title,
                file
            };
        })
    }

    chats(name) {
        // filter to chats where this member is present
        const chats = this.messages.filter(details => 
            (details.participants.map(p => p.name).indexOf(name) >= 0)
        );

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
        })

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

    // Names is an array
    chatsBetween(names) {
        const chats = this.messages.filter(details => {
            const participants = details.participants.map(p => p.name);
            return (
                names.reduce((prev, current) => prev && (participants.indexOf(current) >= 0), true)
            )
        });

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
                    count += participant.count
                    countBreakdown[participant.name] += participant.count
                }
            })
        })
        return {
            chats,
            count,
            countBreakdown,
            names
        }
    }
}

export default MessagesApi