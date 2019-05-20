import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon, Container, Segment, Grid, Divider, Statistic, Progress } from 'semantic-ui-react'

import MessagesApi from '../facebookapi/messages'
import ProfileApi from '../facebookapi/profile'

import styles from './css/FriendPreview.css';

type Props = {
    name: string
};

class FriendPreview extends React.Component<Props> {
    props: Props;

    constructor(props) {
        super(props);
        this.state = {
            profileApi: new ProfileApi(),
            messagesApi: new MessagesApi()
        }
    }
  
    shouldComponentUpdate(nextProps) {
        const { name } = this.props;
        return nextProps.name !== name;
    }

    render() {
        const { name } = this.props;

        if (name === false) {
            // nothing selected
            return (
                <Container className={styles.placeholderHeader}>
                    <Header as='h2' icon>
                        <Icon name='sitemap' />
                        Nothing Selected
                        <Header.Subheader>Click on a friend or a connection in the network!</Header.Subheader>
                    </Header>
                </Container>
            );
        }

        const root = this.state.profileApi.getFullName()
        const chatsBetweenRoot = this.state.messagesApi.chatsBetween([root, name])
        const numGroupsWithRoot = chatsBetweenRoot.chats.length
        const numMessagesWithRoot = chatsBetweenRoot.count
        const numYouSent = chatsBetweenRoot.countBreakdown[root]
        const numTheySent = chatsBetweenRoot.countBreakdown[name]
        const numYouSentPercent = Math.floor(
                (numYouSent/numMessagesWithRoot) * 100
            )
        console.log(chatsBetweenRoot)

        return (
            <div>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='user' circular />
                    <Header.Content>{name}</Header.Content>
                </Header>
                <Divider horizontal>
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
                <Segment attached="bottom"><Progress percent={numYouSentPercent} color="red" progress /></Segment>
                <Segment>  
                    <Grid columns={2} relaxed='very'>
                        <Grid.Column>
                        </Grid.Column> 
                        <Grid.Column>
                        </Grid.Column>
                    </Grid>
                    <Divider vertical><Icon name="sync" /></Divider>
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

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendPreview);
