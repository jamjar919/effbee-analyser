import fs from 'fs';
import FacebookApi from "./api";

class ProfileApi extends FacebookApi {
    constructor() {
        super();
        try {
            const file = `${super.getRoot()}/profile_information/profile_information.json`;
            const contents = fs.readFileSync(file, { encoding: "utf-8" })
            this.profile = JSON.parse(contents).profile
        } catch (e) {
            console.error(e)
            return false;
        }
    }

    getFullName() {
        return this.profile.name.full_name;
    }
}

export default ProfileApi