import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon, Segment, Grid, Statistic, Divider, Progress, Menu } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';

import MessageTimeline from './MessageTimeline';
import Identicon from './Identicon';
import HourRadar from './HourRadar';
import FriendList from './FriendList';
import ChatList from './ChatList';
import PageContainer from '../containers/PageContainer';
import type { defaultFacebookType } from '../reducers/defaultTypes'

import styles from './css/Friend.css';
import menuStyles from './css/Menu.css';

type Props = {
    name: string,
    api: defaultFacebookType,
    history: object
};

class Friend extends Component<Props> {
    props: Props;

    render() {
        const {
            name,
            api,
            history
        } = this.props;

        if (name === false) {
            return (
                <>
                    Nothing selected!
                </>
            )
        }

        const { messageApi, profileApi } = api;
        const root = profileApi.getFullName();

        const chatsInterval = messageApi.chatsPerTimeInterval(root, name, 1209600);
        const chatsWithRoot = messageApi.chatsBetween([root, name], true);
        const chats = messageApi.chats(name);

        const timeDetails = messageApi.getTimeDetails(chatsWithRoot.chats);
        const numGroupsWithRoot = chatsWithRoot.chats.length;
        const numMessagesWithRoot = chatsWithRoot.count;
        const numYouSent = chatsWithRoot.countBreakdown[root];
        const numTheySent = chatsWithRoot.countBreakdown[name];
        const numYouSentPercent = Math.floor(
                (numYouSent/numMessagesWithRoot) * 100
            );

        return (
            <React.Fragment>
                <Menu className={menuStyles.topMenu}>
                    <Menu.Item
                        onClick={() => {
                            history.goBack()
                        }}
                    >
                        <Icon name="chevron left" />
                    </Menu.Item>
                </Menu>
                <PageContainer withMenu>
                    <Header as='h1'>
                        <Identicon size={100} value={name} className="ui circular image"/>
                        <Header.Content>
                            {name}
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
                        <Header as='h3'>
                            <Icon name='envelope' />
                            <Header.Content>Group Chats</Header.Content>
                            <Header.Subheader>Shared group chats</Header.Subheader>
                        </Header>
                        <ChatList chats={chats.chats} />
                    </Segment>
                    <Segment>
                        <Header as='h3'>
                            <Icon name='users' />
                            <Header.Content>Common connections</Header.Content>
                            <Header.Subheader>Message totals shared between this person and your friends</Header.Subheader>
                        </Header>
                        <FriendList friends={chats.peopleRanking} horizontal />
                    </Segment>
                </PageContainer>
            </React.Fragment>
        );
    }

}

function mapStateToProps(state) {
    const api = state.facebook;
    return {
        name: state.selection.friend,
        api
    };
}

function mapDispatchToProps() {
    return {};
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Friend)
);
