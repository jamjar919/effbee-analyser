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
        return {
            chats: this.messages.filter(details => (details.participants.map(p => p.name).indexOf(name) >= 0)),
            name
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