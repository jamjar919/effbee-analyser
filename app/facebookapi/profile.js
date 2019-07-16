import fs from 'fs';
import FacebookApi from "./api";

class ProfileApi extends FacebookApi {
    constructor() {
        super();
        try {
            const file = `${super.getRoot()}/profile_information/profile_information.json`;
            this.profile = this.readFacebookJson(file).profile
            this.profile.name.prettyName = this.fixEncoding(this.profile.name.full_name)
            this.loaded = true;
        } catch(e) {
            console.log("couldn't load profile api")
            console.error(e)
            this.loaded = false;
        }
    }

    getFullName() {
        return this.profile.name.full_name;
    }

    getPrettyFullName() {
        return this.profile.name.prettyName;
    }

    getRelationships() {
        return this.profile.previous_relationships
    }
}

export default ProfileApi