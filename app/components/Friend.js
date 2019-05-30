import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon, Segment, Container, Grid } from 'semantic-ui-react'

import MessagesApi from '../facebookapi/messages'
import ProfileApi from '../facebookapi/profile'
import MessageTimeline from './MessageTimeline';
import Identicon from './Identicon';
import HourRadar from './HourRadar';

import styles from './css/Friend.css';

type Props = {
    name: string
};

class Friend extends Component<Props> {
    props: Props;

    render() {
        const {
            name
        } = this.props;

        if (name === false) {
            return (
                <div>
                    Nothing selected!
                </div>
            )
        }

        const messageApi = new MessagesApi();
        const profileApi = new ProfileApi();
        const root = profileApi.getFullName(); 
        const chatsInterval = messageApi.chatsPerTimeInterval(root, name, 1209600);
        const chats = messageApi.chatsBetween([root, name], true)
        const timeDetails = messageApi.getTimeDetails(chats.chats);

        return (
            <div className={styles.friendContainer}>
                <Header as='h2'>
                    <Identicon size={75} value={name} className="ui circular image"/>
                    <Header.Content>
                        {name}
                        <Header.Subheader>Awards here...</Header.Subheader>
                    </Header.Content>
                </Header>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Segment>Left</Segment>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment>
                                <Header as='h3'>
                                    <Icon name='clock outline' />
                                    <Header.Content>Heatmap</Header.Content>
                                    <Header.Subheader>Organised by hour of day</Header.Subheader>
                                </Header>
                                <HourRadar
                                    className={styles.hourRadar}
                                    data={timeDetails}
                                    size={400}
                                />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Segment>
                    <Header as='h3'>
                        <Icon name='facebook messenger' />
                        <Header.Content>Message Frequency</Header.Content>
                    </Header>
                    <MessageTimeline 
                        chats={chatsInterval}
                        people={[ root, name ]}
                    />
                </Segment>
            </div>
        );
    }

}

function mapStateToProps(state) {
    if (state.selection.type === 'FRIEND') {
        return { 
            name: state.selection.selection
        };
    }
    return { name: false }
}

function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Friend);
