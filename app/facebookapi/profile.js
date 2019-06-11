import fs from 'fs';
import FacebookApi from "./api";

class ProfileApi extends FacebookApi {
    constructor() {
        super();
        const file = `${super.getRoot()}/profile_information/profile_information.json`;
        const contents = fs.readFileSync(file, { encoding: "utf-8" })
        this.profile = JSON.parse(contents).profile
        console.log(this.profile)
    }

    getFullName() {
        return this.profile.name.full_name;
    }

    getRelationships() {
        return this.profile.previous_relationships
    }
}

export default ProfileApi