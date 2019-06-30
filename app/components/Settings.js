// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Icon } from 'semantic-ui-react';

import FacebookDataDirectoryControl from './FacebookDataDirectoryControl';

type Props = {};

export default class Settings extends Component<Props> {
    props: Props;

    render() {
        return (
            <Container text>
                <Header as='h1'>
                    <Icon name="settings" />
                    <Header.Content>Settings</Header.Content>
                </Header>
                <FacebookDataDirectoryControl />
            </Container>
        );
    }
}
