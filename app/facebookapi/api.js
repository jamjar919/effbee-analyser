import iconv from 'iconv-lite';
import fs from 'fs';
import SettingsFile from '../SettingsFile';

class FacebookApi {
    constructor() {
        const settings = new SettingsFile();
        this.root = settings.get("facebookDataDir")
    }

    getRoot() {
        return this.root;
    }

    readFacebookJson(filename) {
        var content = fs.readFileSync(filename, "utf8");
        const json = JSON.parse(content)
        return json
    }

    fixEncoding(string) {
        return iconv.decode(iconv.encode(string, "latin1"), "utf8")
    }
}

export default FacebookApi;
