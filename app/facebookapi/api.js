import SettingsFile from '../SettingsFile';

class FacebookApi {
    constructor() {
        const settings = new SettingsFile();
        this.root = settings.get("facebookDataDir")
    }
    
    getRoot() {
        return this.root;
    }

}

export default FacebookApi;