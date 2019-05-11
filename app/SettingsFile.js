const electron = require('electron');
const path = require('path');
const fs = require('fs');

class SettingsFile {
  constructor() {
    this.defaults = {
      "facebookDataDir": false,
    };
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, 'effbee_settings.json');
    this.data = parseDataFile(this.path, this.defaults);
  }
  
  get(key) {
    return this.data[key];
  }
  
  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return this.defaults;
  }
}

module.exports = SettingsFile;