import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, Icon, Segment, Grid, Divider, Statistic, Progress, Table, Transition, Button, Item } from 'semantic-ui-react'
import memoize from "memoize-one";

import Identicon from './Identicon';
import FriendList from './FriendList';
import routes from '../constants/routes'
import type { defaultFacebookType } from '../reducers/defaultTypes'

import styles from './css/FriendPreview.css';

type Props = {
    name: string,
    api: defaultFacebookType
};

class FriendPreview extends React.Component<Props> {
    props: Props;

    constructor(props) {
        super(props);
        this.state = {
            showDetails: false
        }
    }

    render() {
        const {
            name,
            api
        } = this.props;

        const {
            showDetails,
            memoizedChatsBetween
        } = this.state

        const root = api.profileApi.getFullName()
        const messageApi = api.messageApi;

        if (name === false) {
            // nothing selected
            return (
                <div className={styles.placeholderHeader}>
                    <Header as='h2' icon>
                        <Icon name='sitemap' />
                        Nothing Selected
                        <Header.Subheader>Click on a friend or a connection in the network!</Header.Subheader>
                    </Header>
                </div>
            );
        }
    
        // Chat Details With You
        const chatsBetweenRoot = messageApi.chatsBetween([root, name])
        const numGroupsWithRoot = chatsBetweenRoot.chats.length
        const numMessagesWithRoot = chatsBetweenRoot.count
        const numYouSent = chatsBetweenRoot.countBreakdown[root]
        const numTheySent = chatsBetweenRoot.countBreakdown[name]
        const numYouSentPercent = Math.floor(
                (numYouSent/numMessagesWithRoot) * 100
            )

        // sort chats in ascending order
        chatsBetweenRoot.chats = chatsBetweenRoot.chats.map(chat => ({
            ...chat,
            themCount: chat.participants.filter(p => p.name === name)[0].count,
            usCount: chat.participants.filter(p => p.name === root)[0].count
        }))
        const sortedChats = chatsBetweenRoot.chats.sort((a, b) => 
            (b.usCount + b.themCount) - (a.usCount + a.themCount)
        )

        const inDepthTableRows = sortedChats.map((chat, i) => (
                <React.Fragment key={i}>
                    <Table.Row>
                        <Table.Cell rowSpan={2}>{chat.title}</Table.Cell>
                        <Table.Cell rowSpan={2}>{chat.usCount + chat.themCount}</Table.Cell>
                        <Table.Cell>You: {chat.usCount}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Them: {chat.themCount}</Table.Cell>
                    </Table.Row>
                </React.Fragment>
            ));

        // Chat Details With Others
        const theirChats = messageApi.chats(name); 

        return (
            <div>
                <Header as='h1' icon textAlign='center'>
                    <Identicon size={200} value={name} className={styles.topIdenticon}/>
                    <Header.Content>{name}</Header.Content>
                </Header>
                <Link to={routes.FRIEND}>Investigate</Link>
                <Divider className={styles.divider} horizontal>
                    <Header as='h4'>
                        <Icon name='paper plane' />
                        With You
                    </Header>
                </Divider>
                <Segment>
                    <Grid columns={2} relaxed='very'>
                        <Grid.Column>
                            <Statistic>
                                <Statistic.Value>{numMessagesWithRoot}</Statistic.Value>
                                <Statistic.Label>Messages</Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic>
                                <Statistic.Value>{numGroupsWithRoot}</Statistic.Value>
                                <Statistic.Label>Groups</Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                    </Grid>
                    <Divider vertical>In</Divider>
                </Segment>
                <Segment attached>
                    <Grid columns={2} relaxed='very'>
                        <Grid.Column>
                            <Statistic>
                                <Statistic.Label>You sent</Statistic.Label>
                                <Statistic.Value>{numYouSent}</Statistic.Value>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic>
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
                <Button fluid content={showDetails ? 'Hide' : 'Show Details'} onClick={() => { this.setState({ showDetails: !showDetails }) }} />
                <Transition visible={showDetails} animation='slide down' duration={500}>
                    <div>
                        <Table celled structured>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Group</Table.HeaderCell>
                                    <Table.HeaderCell>Messages</Table.HeaderCell>
                                    <Table.HeaderCell colSpan={2}>Split totals</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {inDepthTableRows}
                            </Table.Body>
                        </Table>
                    </div>
                </Transition>
                <Divider className={styles.divider} horizontal>
                    <Header as='h3'>
                        <Icon name='paper plane' />
                        With Others
                    </Header>
                </Divider>

                <Segment>
                    <FriendList friends={theirChats.peopleRanking} />
                </Segment>
            </div>
        );
    }
  }
  
function mapStateToProps(state) {
    const api = state.facebook;
    if (state.selection.type === 'FRIEND') {
        return { 
            name: state.selection.selection,
            api
        };
    }
    return {
        name: false,
        api
    }
}

function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendPreview);
