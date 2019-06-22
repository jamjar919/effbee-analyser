// @flow
import React, { Component } from 'react';
import { Icon, Header, Menu } from 'semantic-ui-react'
import styles from './css/TopMenuNetwork.css';

type Props = {
    toggleShowRoot: () => void,
    showRoot: boolean
};

export default class TopMenuNetwork extends Component<Props> {
    props: Props;

    render() {
        const {
            toggleShowRoot
        } = this.props

        return (
            <Menu className={styles.container}>
                <Menu.Item>
                    <Header as='h3'>
                        <Icon name='sitemap' /> 
                        <Header.Content>
                            Network
                        </Header.Content>
                    </Header>
                </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item onClick={() => toggleShowRoot()}>
                        Show/Hide Root
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}
