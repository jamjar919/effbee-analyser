import FacebookApi from "./api";
import fs from 'fs';

class FriendsApi extends FacebookApi {
    get() {
        try {
            const file = super.getRoot() + '/friends/friends.json';
            const contents = fs.readFileSync(file, { encoding: "utf-8" })
            return JSON.parse(contents).friends
                .filter(
                    (friend, i, arr) => arr.filter(
                        (friend2, i, arr) => friend2.name == friend.name
                    ).length < 2
                )
                
        } catch {
            return false;
        }
    }
}

export default FriendsApi