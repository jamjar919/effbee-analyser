// @flow
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Input, Header, Icon } from 'semantic-ui-react';

import routes from '../constants/routes';
import styles from './css/Menu.css';

type Props = {
    history: object
};



class Home extends Component<Props> {
  props: Props;

  render() {
    const {
        history
    } = this.props;

    const isActive = false
    return (
        <div className={styles.menuContainer}>
            <Header as='h1' icon textAlign='center'>
                <Icon name='facebook' circular />
                <Header.Content className={styles.title}>EffBee Analyser</Header.Content>
            </Header>
            <Menu vertical className={styles.menu}>
                <Menu.Item name="Home" active={isActive} onClick={() => { history.push(routes.HOME) }}>
                    Home
                </Menu.Item>
                <Menu.Item name="Counter" active={isActive} onClick={() => { history.push(routes.COUNTER) }}>
                    Counter
                </Menu.Item>
                <Menu.Item name="Settings" active={isActive} onClick={() => { history.push(routes.SETTINGS) }}>
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

export default withRouter(Home)