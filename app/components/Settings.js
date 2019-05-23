// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Segment, Container, Header, Icon, Button } from 'semantic-ui-react';
import SettingsFile from '../SettingsFile';
import { app, BrowserWindow } from 'electron';
import path from 'path';

import styles from './css/Settings.css';

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

  handleChangeDataDir() {
    let path = document.getElementById("facebookDataDir").files[0].path;
    path = path.replace(/\\/g , "/");
    this.state.store.set("facebookDataDir", path);
    this.setState({ dataDir: path });
  }

  render() {
    return (
        <Container text>
            <Header as='h2'>Settings</Header>
            <Segment>
                <p>Current directory: {this.state.dataDir}</p>
            </Segment>
            <Segment placeholder>
                <Header icon>
                    <Icon name='file outline' />
                    Facebook Data Directory
                </Header>
                <label>
                    <span className="ui primary button">Change</span>
                    <input
                        className={styles.facebookDataDir}
                        id="facebookDataDir"
                        type="file"
                        webkitdirectory="true"
                        onChange={this.handleChangeDataDir.bind(this)}
                    />
                </label>
            </Segment>
        </Container>
    );
  }
}
