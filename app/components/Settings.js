// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SettingsFile from '../SettingsFile';
import { app, BrowserWindow } from 'electron';
import path from 'path';

type Props = {};

export default class Settings extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const store = new SettingsFile();
    this.state = {
      store,
      dataDir: store.get("facebookDataDir")
    }
  }

  handleChangeDataDir(e) {
    let path = document.getElementById("facebookDataDir").files[0].path;
    path = path.replace(/\\/g , "/");
    this.state.store.set("facebookDataDir", path);
    this.setState({ dataDir: path });
  }

  render() {
    return (
      <div>
        <h2>Settings</h2>
        <label>Select Facebook Data Directory: <input id="facebookDataDir" type="file" webkitdirectory="true" onChange={this.handleChangeDataDir.bind(this)}/></label>
        <p>Current directory: {this.state.dataDir}</p>
      </div>
    );
  }
}
