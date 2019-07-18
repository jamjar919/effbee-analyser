import React, { Component } from 'react';
import { Header, Icon, Segment, Menu, Placeholder, Item, Grid, Statistic, Search } from 'semantic-ui-react'

import FriendTimeline from '../components/FriendTimeline';
import MessageBubbles from '../components/MessageBubbles';
import ChatNamesHistory from '../components/ChatNamesHistory';
import TalkedAbout from '../components/TalkedAbout';
import TextAnalysisTimeline from '../components/TextAnalysisTimeline';
import FriendBreakdownPie from '../components/FriendBreakdownPie';
import ButtonToMessages from '../components/ButtonToMessages';

import styles from './css/ChatPage.css';

export default class ChatPageContent extends Component<Props> {

    shouldComponentUpdate(nextProps, nextState) {
        const {
            chat,
            selectMessages
        } = this.props;

        if (chat.messages !== nextProps.chat.messages) {
            selectMessages(chat.messages, "")
        }

        if (chat !== nextProps.chat) {
            return true;
        }
        return false;
    }

    render() {
        const {
            api,
            chat,
            isPrivateChat,
            selectMessages
        } = this.props;

        const {
            messageApi,
            profileApi
        } = api;

        const maxPerson = chat.participants.reduce((max, current) => {
            if (max.count < current.count) {
                return current;
            }
            return max;
        })

        const minPerson = chat.participants.reduce((min, current) => {
            if (min.count > current.count) {
                return current;
            }
            return min;
        })

        const numFirstMessagesToShow = 10
        const firstMessages = chat.messages.slice(chat.messages.length - numFirstMessagesToShow, chat.messages.length)
        firstMessages.reverse()

        const firstMessage = chat.messages[chat.messages.length - 1];
        const lastMessage = chat.messages[0]
        const firstTimestamp = Math.floor(firstMessage.timestamp_ms / 1000)
        const lastTimestamp = Math.floor(lastMessage.timestamp_ms / 1000)
        const messagesByInterval = messageApi.bucketMessagesByTimeInterval([chat], firstTimestamp, lastTimestamp, 1209600, false)
        const root = profileApi.getFullName()

        return (
            <Grid>
                { !isPrivateChat ? 
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
                                <Statistic.Group widths="two">
                                    <Statistic>
                                        <Statistic.Value>{chat.messages.length}</Statistic.Value>
                                        <Statistic.Label>Total Messages</Statistic.Label>
                                    </Statistic>
                                    <Statistic>
                                    <Statistic.Value>
                                        <Icon name='user' />
                                        {chat.participants.length}
                                        </Statistic.Value>
                                        <Statistic.Label>Participants</Statistic.Label>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>Top Contributor</Statistic.Label>
                                        <Statistic.Value text className={styles.nameStatistic}>{maxPerson.name}</Statistic.Value>
                                        <Statistic.Label>{maxPerson.count} Messages</Statistic.Label>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>Bottom Contributor</Statistic.Label>
                                        <Statistic.Value text className={styles.nameStatistic}>{minPerson.name}</Statistic.Value>
                                        <Statistic.Label>{minPerson.count} Messages</Statistic.Label>
                                    </Statistic>
                                </Statistic.Group>
                            </Segment>
                        </Segment.Group>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Segment>
                            <FriendBreakdownPie friends={chat.participants} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row> : '' }
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Segment>
                            <Menu secondary>
                                <Menu.Item>
                                    <Header as='h3'>
                                        <Icon name='thumbtack' />
                                        <Header.Content>First Messages</Header.Content>
                                    </Header>
                                </Menu.Item>
                            </Menu>
                            <MessageBubbles
                                messages={firstMessages}
                                root={root}
                            />
                            <ButtonToMessages index={chat.messages.length - 1} text="Go to conversation" />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        { !isPrivateChat ? <Segment>
                            <Header as='h3'>
                                <Icon name='address card' />
                                <Header.Content>Group Names</Header.Content>
                                <Header.Subheader>Group Chat Name History</Header.Subheader>
                            </Header>
                            <ChatNamesHistory 
                                messages={chat.messages}
                            />
                        </Segment> : '' }
                        <Segment>
                            <Header as='h3'>
                                <Icon name='users' />
                                <Header.Content>Talked About</Header.Content>
                                <Header.Subheader>Who's mentioned most in your chat from your friends list</Header.Subheader>
                            </Header>
                            <TalkedAbout 
                                messages={chat.messages}
                                participants={chat.participants}
                                api={api}
                            />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Segment>
                            <Menu secondary>
                                <Menu.Item>
                                    <Header as='h3'>
                                        <Icon name='text width' />
                                        <Header.Content>Text Analysis</Header.Content>
                                        <Header.Subheader>Popular conversation topics ordered by month</Header.Subheader>
                                    </Header>
                                </Menu.Item>
                            </Menu>
                            <TextAnalysisTimeline
                                messages={chat.messages}
                                api={api}
                                onSelectWord={(word) => { selectMessages(chat.messages , word) }}
                            />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Segment>
                            <Header as='h3'>
                                <Icon name='users' />
                                <Header.Content>Friends Area Chart</Header.Content>
                            </Header>
                            <FriendTimeline 
                                messages={messagesByInterval}
                                participants={chat.participants}
                                firstTimestamp={firstTimestamp}
                                lastTimestamp={lastTimestamp}
                            />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

}