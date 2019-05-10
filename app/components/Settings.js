// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const { app, BrowserWindow } = require('electron');
const path = require('path');
const FileStore = require('../FileStore.js');

type Props = {};

export default class Settings extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      store: new FileStore({
        defaults: {
          facebookDataDir: false
        }
      })
    }
  }

  handleChangeDataDir(e) {
    const path = document.getElementById("facebookDataDir").files[0].path;
    this.state.store.set("facebookDataDir", path);
  }

  render() {
    return (
      <div>
        <h2>Settings</h2>
        <label>Select Facebook Data Directory: <input id="facebookDataDir" type="file" webkitdirectory="true" onChange={this.handleChangeDataDir.bind(this)}/></label>
        <p>Current directory: {this.state.store.get("facebookDataDir")}</p>
      </div>
    );
  }
}
