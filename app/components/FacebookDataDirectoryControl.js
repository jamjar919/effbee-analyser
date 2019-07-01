import React, { Component } from 'react';
import SettingsFile from '../SettingsFile';
import path from 'path';
import { Container, Header, Icon, Segment } from 'semantic-ui-react';

import styles from './css/FacebookDataDirectoryControl.css';

type Props = {};

export default class FacebookDataDirectoryControl extends Component<Props> {
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
            <React.Fragment>
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
            </React.Fragment>
        );
    }
}