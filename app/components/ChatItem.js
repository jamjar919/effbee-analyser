import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react'

import * as SelectionActions from '../actions/selection';
import routes from '../constants/routes';

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
                selectChat(chat.title);
                history.push(routes.CHAT);
                this.setState({ loading: false })
            }, 10)
        })
    }

    render() {
        const {
            chat
        } = this.props;

        let isPrivateChat = false;
        if (chat.participants.length === 2) {
            isPrivateChat = true
        }

        return (
            <Card color={isPrivateChat && 'red'}>
                <Card.Content>
                    <Card.Header
                        onClick={() => { this.toChat() }}
                        content={chat.title}
                    />
                    <Card.Description>
                        {chat.messages.length} messages in chat
                    </Card.Description>
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
