import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Label } from 'semantic-ui-react'

import Identicon from './Identicon';
import * as SelectionActions from '../actions/selection';
import routes from '../constants/routes';
import styles from './css/ChatItem.css'

type Props = {
    chat: object,
    selectChat: (string) => void,
    history: object
}

class ChatItem extends React.Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    toChat() {
        const {
            chat,
            selectChat,
            history
        } = this.props;

        this.setState({ loading: true }, () => {
            setTimeout(() => {
                selectChat(chat);
                history.push(routes.CHAT);
                this.setState({ loading: false })
            }, 10)
        })
    }

    render() {
        const {
            chat
        } = this.props;

        const labelMax = 5;

        let isPrivateChat = false;
        if (chat.participants.length === 2) {
            isPrivateChat = true
        }

        if (!chat.title) {
            chat.title = 'Unnamed Chat'
        }

        chat.participants.sort((a, b) => b.count - a.count)
        const participantLabels = chat.participants.map((participant, i) => {
            return (
                <Label as='a' key={i}>
                    <Identicon value={participant.name} size={25} className={styles.labelImage} />
                    { participant.name }
                </Label>
            )
        }).filter((l, i) => (i < labelMax))

        if (chat.participants.length > labelMax) {
            participantLabels.push(
                <Label as='a' key="more">
                    And {chat.participants.length - labelMax} More
                </Label>
            )
        }

        return (
            <Card color={isPrivateChat ? 'red' : 'blue'} className={styles.chatItem}>
                <Card.Content>
                    <Label as='a' color={isPrivateChat ? 'red' : 'blue'} ribbon='right' className={styles.chatTypeLabel}>
                        {isPrivateChat ? 'Private' : 'Group'}
                    </Label>
                    <Card.Header
                        className={styles.chatItemHeader}
                        onClick={() => { this.toChat() }}
                    >
                        {chat.prettyTitle}
                    </Card.Header>
                    <Card.Description>
                        {chat.messages.length} messages in chat
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Label.Group>
                        {participantLabels}
                    </Label.Group>
                </Card.Content>
            </Card>
        )
    }
}

function mapStateToProps() { return {} }

function mapDispatchToProps(dispatch) {
    return {
        selectChat: SelectionActions.selectChatAction(dispatch)
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ChatItem)
);
