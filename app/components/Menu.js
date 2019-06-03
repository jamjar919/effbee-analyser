// @flow
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Input, Header, Icon, Search } from 'semantic-ui-react';
import { connect } from 'react-redux';

import type { defaultFacebookType } from '../reducers/defaultTypes'
import routes from '../constants/routes';
import * as SelectionActions from '../actions/selection';
import styles from './css/Menu.css';

type Props = {
    history: object,
    api: defaultFacebookType,
    selectFriend: (string) => void,
};

class MainMenu extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            results: [],
            friends: props.api.friendsApi.get().map(f => ({ title: f.name }))
        }
    }

    render() {
        const {
            history,
            api,
            selectFriend
        } = this.props;

        const {
            isLoading,
            value,
            results,
            friends
        } = this.state

        return (
            <div className={styles.menuContainer}>
                <Header as='h1' icon textAlign='center'>
                    <Icon name='facebook' circular />
                    <Header.Content className={styles.title}>EffBee Analyser</Header.Content>
                </Header>
                <Menu vertical className={styles.menu}>
                    <Menu.Item name="You" active={history.location.pathname === routes.YOU} onClick={() => { history.push(routes.YOU) }}>
                        You
                    </Menu.Item>
                    <Menu.Item name="Friends" active={history.location.pathname === routes.FRIENDS} onClick={() => { history.push(routes.FRIENDS) }}>
                        Your Friends
                    </Menu.Item>
                    <Menu.Item name="Network" active={history.location.pathname === routes.NETWORK} onClick={() => { history.push(routes.NETWORK) }}>
                        Network
                    </Menu.Item>
                    <Menu.Item name="Settings" active={history.location.pathname === routes.SETTINGS} onClick={() => { history.push(routes.SETTINGS) }}>
                        Settings
                    </Menu.Item>
                    <Menu.Item key="search">
                        <Search
                            loading={isLoading}
                            onResultSelect={(e, { result }) => {
                                selectFriend(result.title)
                                history.push(routes.FRIEND)
                            }}
                            onSearchChange={(e, { value }) => {
                                this.setState({ isLoading: true }, () => {
                                    const re = new RegExp(value, 'i')
                                    this.setState({
                                        results: friends.filter(f => re.test(f.title)),
                                        isLoading: false
                                    })
                                })
                            }}
                            results={results}
                        />
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        api: state.facebook
    };
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