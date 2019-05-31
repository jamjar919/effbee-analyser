import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon, Segment, Container, Grid, Statistic, Divider, Progress } from 'semantic-ui-react'

import MessagesApi from '../facebookapi/messages'
import ProfileApi from '../facebookapi/profile'
import MessageTimeline from './MessageTimeline';
import Identicon from './Identicon';
import HourRadar from './HourRadar';

import styles from './css/Friend.css';
import FriendList from './FriendList';

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
        const chatsWithRoot = messageApi.chatsBetween([root, name], true)
        const chats = messageApi.chats(name);

        const timeDetails = messageApi.getTimeDetails(chatsWithRoot.chats);
        const numGroupsWithRoot = chatsWithRoot.chats.length
        const numMessagesWithRoot = chatsWithRoot.count
        const numYouSent = chatsWithRoot.countBreakdown[root]
        const numTheySent = chatsWithRoot.countBreakdown[name]
        const numYouSentPercent = Math.floor(
                (numYouSent/numMessagesWithRoot) * 100
            )
        
        console.log(chats)

        return (
            <div className={styles.friendContainer}>
                <Header as='h1'>
                    <Identicon size={100} value={name} className="ui circular image"/>
                    <Header.Content>
                        {name}
                        <Header.Subheader>Awards here...</Header.Subheader>
                    </Header.Content>
                </Header>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            <Segment.Group>
                                <Segment>
                                    <Header as='h3'>
                                        <Icon name='area graph' />
                                        <Header.Content>Basic Statistics</Header.Content>
                                    </Header>
                                </Segment>
                                <Segment>
                                    <Grid columns={2} centered>
                                        <Grid.Column className={styles.gridColumnCenter}>
                                            <Statistic className={styles.gridColumnCenterItem}>
                                                <Statistic.Value>{numMessagesWithRoot}</Statistic.Value>
                                                <Statistic.Label>Messages</Statistic.Label>
                                            </Statistic>
                                        </Grid.Column>
                                        <Grid.Column className={styles.gridColumnCenter}>
                                            <Statistic className={styles.gridColumnCenterItem}>
                                                <Statistic.Value>{numGroupsWithRoot}</Statistic.Value>
                                                <Statistic.Label>Groups</Statistic.Label>
                                            </Statistic>
                                        </Grid.Column>
                                    </Grid>
                                    <Divider vertical>In</Divider>
                                </Segment>
                                <Segment>
                                    <Grid columns={2} relaxed='very'>
                                        <Grid.Column className={styles.gridColumnCenter}>
                                            <Statistic className={styles.gridColumnCenterItem}>
                                                <Statistic.Label>You sent</Statistic.Label>
                                                <Statistic.Value>{numYouSent}</Statistic.Value>
                                            </Statistic>
                                        </Grid.Column>
                                        <Grid.Column className={styles.gridColumnCenter}>
                                            <Statistic className={styles.gridColumnCenterItem}>
                                                <Statistic.Label>They sent</Statistic.Label>
                                                <Statistic.Value>{numTheySent}</Statistic.Value>
                                            </Statistic>
                                        </Grid.Column>
                                    </Grid>
                                    <Divider vertical><Icon name="sync" /></Divider>
                                </Segment>
                                <Segment attached="bottom" className={styles.inlineProgress}>
                                    <Progress percent={numYouSentPercent} color="red" progress className={styles.inlineProgressBar} />
                                </Segment>
                            </Segment.Group>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Segment>
                                <Header as='h3'>
                                    <Icon name='clock outline' />
                                    <Header.Content>Heatmap</Header.Content>
                                    <Header.Subheader>Organised by hour of day</Header.Subheader>
                                </Header>
                                <HourRadar
                                    className={styles.hourRadar}
                                    data={timeDetails}
                                    size={250}
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
                <Segment>
                    <FriendList friends={chats.peopleRanking} />
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
