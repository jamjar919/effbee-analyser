import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { Modal, Header, Icon, Message } from 'semantic-ui-react';

import routes from './constants/routes';
import App from './containers/App';
import NetworkPage from './containers/NetworkPage';
import CounterPage from './containers/CounterPage';
import FacebookDataDirectoryControl from './components/FacebookDataDirectoryControl';
import FriendsPage from './containers/FriendsPage';
import FriendsTimelinePage from './containers/FriendTimelinePage';
import ChatPage from './containers/ChatPage';
import Friend from './components/Friend';
import Menu from './components/Menu';
import styles from './app.global.css';
import type { facebookType } from './reducers/types';

type Props = {
    api: facebookType
}

function isApiLoaded(api) {
    return (
        api.profileApi.loaded &&
        api.messageApi.loaded &&
        api.friendsApi.loaded
    );
}

class Root extends Component<Props> {
    render() {
        const {
            api
        } = this.props;

        let content;
        if (isApiLoaded(api)) {
            content = (
                <React.Fragment>
                    <Menu />
                    <div className={styles.container}>
                        <Switch>
                            <Route path={routes.CHAT} component={ChatPage} />
                            <Route path={routes.FRIEND} component={Friend} />
                            <Route path={routes.COUNTER} component={CounterPage} />
                            <Route path={routes.NETWORK} component={NetworkPage} />
                            <Route path={routes.FRIENDS} component={FriendsPage} />
                            <Route path={routes.FRIENDSTIMELINE} component={FriendsTimelinePage} />
                            <Route path={routes.SETTINGS} component={SettingsPage} />
                        </Switch>
                    </div>
                </React.Fragment>
            )
        } else {
            let error = ''
            if (error !== false) {
                error = (
                    <Message negative>
                        Looks like that's not a valid Facebook Data Directory.
                    </Message>
                )
            }
            content = (
                <Modal open>
                    <Modal.Header><Icon name="facebook" /> Welcome to EffBee Analyser!</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Header>Here's how to get started...</Header>
                            You'll need to first download your Facebook data. 
                            <ol>
                                <li>First, visit the <a
                                    onClick={e => {
                                        e.preventDefault()
                                        require('electron').shell.openExternal("https://www.facebook.com/settings?tab=your_facebook_information");
                                    }}
                                >Facebook download your data</a> service. Click the option "Download Your Information".</li>
                                <li>Select the options "All of my Data", "JSON", and any Media quality, then click the Create File button.</li>
                                <li>Facebook will then start compiling your data. They'll email you when it's complete. This takes usually takes under 24 hours but in rare cases can take up to 7 days.</li>
                                <li>Download and unzip the file. Then, select the folder it with the picker below.</li>
                                <li>There's no more steps! Enjoy!</li>
                            </ol>
                            {error}
                            <FacebookDataDirectoryControl />
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            )
        }

        return (
            <App>
                {content}
            </App>
        );
    }
}

function mapStateToProps(state) {
    return {
        api: state.facebook
    };
}

function mapDispatchToProps() { 
    return {}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Root);
