import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react'
import ChatItem from './ChatItem'

import uuid from 'uuid/v4';
import chatItemStyles from './css/ChatItem.css'

type Props = {
    chats: array,
    defaultNumToShow: number
};

export default class ChatList extends Component<Props> {
    static defaultProps = {
        defaultNumToShow: 10
    };

    constructor(props) {
        super(props)
        this.state = {
            numToShow: props.defaultNumToShow,
        }
    }

    render() {
        const {
            chats
        } = this.props;

        const {
            numToShow
        } = this.state;

        const chatItems = chats.map((chat, i) => {
            if (i < numToShow) {
                return (
                    <ChatItem
                        key={uuid()}
                        chat={chat}
                    />
                )
            }
            return '';
        });

        if (numToShow <= chats.length) {
            chatItems.push(
                <Card key="more" className={chatItemStyles.moreContent}>
                    <Card.Content>
                        <Button onClick={() => {
                            this.setState({ numToShow: numToShow + 10 })
                        }}>More</Button>
                    </Card.Content>
                </Card>
            )
        }
        
        return (
            <Card.Group centered>
                {chatItems}
            </Card.Group>
        );
    }
}
