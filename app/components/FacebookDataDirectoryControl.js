import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import path from 'path';
import { Container, Header, Icon, Segment } from 'semantic-ui-react';

import SettingsFile from '../SettingsFile';

import styles from './css/FacebookDataDirectoryControl.css';
import { refreshFacebookApiAction } from '../actions/facebook';

type Props = {
    refreshFacebookApi: () => void
};

class FacebookDataDirectoryControl extends Component<Props> {
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
        const {
            refreshFacebookApi
        } = this.props;

        let path = document.getElementById("facebookDataDir").files[0].path;
        path = path.replace(/\\/g , "/");
        this.state.store.set("facebookDataDir", path);
        this.setState({ dataDir: path }, () => {
            refreshFacebookApi()
        });
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

function mapStateToProps() {
    return {}
}
  
function mapDispatchToProps(dispatch) {
    return {
        refreshFacebookApi: refreshFacebookApiAction(dispatch)
    }
}
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(FacebookDataDirectoryControl));
  