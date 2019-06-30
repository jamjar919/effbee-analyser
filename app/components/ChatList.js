import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react'
import ChatItem from './ChatItem'

import uuid from 'uuid/v4';

type Props = {
    chats: array
};

export default class ChatList extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            numToShow: 10,
        }
    }

    render() {
        const {
            chats
        } = this.props;

        const {
            numToShow
        } = this.state;

        console.log(chats)

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
                <Card key="more">
                    <Card.Content>
                        <Button onClick={() => {
                            this.setState({ numToShow: numToShow + 10 })
                        }}>More</Button>
                    </Card.Content>
                </Card>
            )
        }
        
        return (
            <Card.Group>
                {chatItems}
            </Card.Group>
        );
    }
}
