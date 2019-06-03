// @flow
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Input, Header, Icon } from 'semantic-ui-react';

import routes from '../constants/routes';
import styles from './css/Menu.css';

type Props = {
    history: object
};

class MainMenu extends Component<Props> {
  props: Props;

  render() {
    const {
        history
    } = this.props;

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
                <Menu.Item name="Network" active={history.location.pathname === routes.NETWORK} onClick={() => { history.push(routes.NETWORK) }}>
                    Network
                </Menu.Item>
                <Menu.Item name="Counter" active={history.location.pathname === routes.COUNTER} onClick={() => { history.push(routes.COUNTER) }}>
                    Counter
                </Menu.Item>
                <Menu.Item name="Settings" active={history.location.pathname === routes.SETTINGS} onClick={() => { history.push(routes.SETTINGS) }}>
                    Settings
                </Menu.Item>
                <Menu.Item key="search">
                    <Input icon='search' placeholder='Search...' />
                </Menu.Item>
            </Menu>
        </div>
    );
  }
}

export default withRouter(MainMenu)