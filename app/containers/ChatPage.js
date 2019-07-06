import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Header, Icon, Segment, Menu, Placeholder, Item, Grid, Statistic } from 'semantic-ui-react'

import TextAnalysisTimeline from '../components/TextAnalysisTimeline';
import FriendBreakdownPie from '../components/FriendBreakdownPie';
import PageContainer from './PageContainer';
import FriendTimeline from '../components/FriendTimeline';
import type { defaultFacebookType } from '../reducers/defaultTypes'

import menuStyles from '../components/css/Menu.css';
import styles from './css/ChatPage.css';

type Props = {
    history: object,
    api: defaultFacebookType
};

class ChatPage extends Component<Props> {
    props: Props;

    render() {
        const {
            history,
            api,
            chat
        } = this.props;

        const {
            messageApi
        } = api

        if (chat === false) {
            return 'Nothing selected!';
        }

        const isPrivateChat = (chat.participants.length === 2)

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

        const firstMessage = chat.messages[chat.messages.length - 1];
        const lastMessage = chat.messages[0]
        const firstTimestamp = Math.floor(firstMessage.timestamp_ms / 1000)
        const lastTimestamp = Math.floor(lastMessage.timestamp_ms / 1000)
        const messagesByInterval = messageApi.bucketMessagesByTimeInterval([chat], firstTimestamp, lastTimestamp, 1209600, false)

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
                <PageContainer>
                    <Header as='h1'>
                        <Icon name='envelope' />
                        <Header.Content>
                            {chat.title}
                        </Header.Content>
                        <Header.Subheader>{isPrivateChat ? 'Private Chat' : 'Group Chat' }</Header.Subheader>
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
                                            <Statistic.Value text>{maxPerson.name}</Statistic.Value>
                                            <Statistic.Label>{maxPerson.count} Messages</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Label>Bottom Contributor</Statistic.Label>
                                            <Statistic.Value text>{minPerson.name}</Statistic.Value>
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
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Segment>
                                    <Header as='h3'>
                                        <Icon name='text width' />
                                        <Header.Content>
                                            Text Analysis
                                        </Header.Content>
                                        <Header.Subheader>Topics ordered by month</Header.Subheader>
                                    </Header>
                                    <TextAnalysisTimeline
                                        messages={chat.messages}
                                        api={api}
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
                </PageContainer>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const api = state.facebook
    return {
        api,
        chat: state.selection.chat
    };
}
  
function mapDispatchToProps(dispatch) {
    return {}
}
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPage));
  