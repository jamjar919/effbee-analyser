// @flow
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Input, Header, Icon, Search } from 'semantic-ui-react';
import { connect } from 'react-redux';

import FriendSearchForm from './FriendSearchForm';
import routes from '../constants/routes';
import * as SelectionActions from '../actions/selection';
import styles from './css/Menu.css';

type Props = {
    history: object,
    selectFriend: (string) => void,
};

class MainMenu extends Component<Props> {
    props: Props;

    render() {
        const {
            history,
            selectFriend
        } = this.props;

        return (
            <div className={styles.menuContainer}>
                <Header as='h1' icon textAlign='center'>
                    <Icon name='facebook' circular />
                    <Header.Content className={styles.title}>EffBee Analyser</Header.Content>
                </Header>
                <Menu vertical pointing className={styles.menu}>
                    <Menu.Item name="You" active={history.location.pathname === routes.YOU} onClick={() => { history.push(routes.YOU) }}>
                        You
                    </Menu.Item>
                    <Menu.Item>
                        Your Friends
                        <Menu.Menu>
                            <Menu.Item
                                name="Friends"
                                active={history.location.pathname === routes.FRIENDS}
                                onClick={() => { history.push(routes.FRIENDS) }}
                            >
                                List
                            </Menu.Item>
                            <Menu.Item 
                                name="Friends"
                                active={history.location.pathname === routes.FRIENDSTIMELINE}
                                onClick={() => { history.push(routes.FRIENDSTIMELINE) }}
                            >
                                Timeline
                            </Menu.Item>

                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item name="Network" active={history.location.pathname === routes.NETWORK} onClick={() => { history.push(routes.NETWORK) }}>
                        Network
                    </Menu.Item>
                    <Menu.Item name="Settings" active={history.location.pathname === routes.SETTINGS} onClick={() => { history.push(routes.SETTINGS) }}>
                        Settings
                    </Menu.Item>
                    <Menu.Item key="search">
                        <FriendSearchForm
                            onResultSelect={(name) => {
                                selectFriend(name)
                                history.push(routes.FRIEND)
                            }}
                        />
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        selectFriend: SelectionActions.selectFriendAction(dispatch)
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(MainMenu)
);