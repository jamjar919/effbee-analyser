// @flow
import React, { Component } from 'react';
import { Icon, Header, Menu } from 'semantic-ui-react'
import styles from './css/TopMenuNetwork.css';

type Props = {
    toggleShowRoot: () => void,
    nextNetworkEdgeOption: () => void,
    fitColors: () => void,
    showRoot: boolean,
    edgeType: string
};

export default class TopMenuNetwork extends Component<Props> {
    props: Props;

    render() {
        const {
            toggleShowRoot,
            nextNetworkEdgeOption,
            fitColors,
            edgeType
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
                    <Menu.Item onClick={() => { nextNetworkEdgeOption() }}>
                        Next Edge Type
                    </Menu.Item>
                    <Menu.Item onClick={() => { fitColors() }}>
                        Fit Colors
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}
