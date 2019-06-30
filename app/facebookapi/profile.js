import fs from 'fs';
import FacebookApi from "./api";

class ProfileApi extends FacebookApi {
    constructor() {
        super();
        try {
            const file = `${super.getRoot()}/profile_information/profile_information.json`;
            const contents = fs.readFileSync(file, { encoding: "utf-8" })
            this.profile = JSON.parse(contents).profile
            this.loaded = true;
        } catch(e) {
            console.log("couldn't load profile api")
            this.loaded = false;
        }
    }

    getFullName() {
        return this.profile.name.full_name;
    }

    getRelationships() {
        return this.profile.previous_relationships
    }
}

export default ProfileApi