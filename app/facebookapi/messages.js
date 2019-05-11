import FacebookApi from "./api";
import fs from 'fs';

class MessagesApi extends FacebookApi {
    constructor() {
        super();
        const directories = super.getRoot() + '/messages/inbox/';
        const isDirectory = source => fs.lstatSync(source).isDirectory()
        console.log(directories)
    }
}

export default MessagesApi