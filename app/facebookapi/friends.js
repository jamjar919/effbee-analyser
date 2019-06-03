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
        }
    }

    get() {
        return this.friends;
    }
}

export default FriendsApi