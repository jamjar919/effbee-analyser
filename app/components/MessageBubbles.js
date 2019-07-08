import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import uuid from 'uuid/v4';

import Identicon from './Identicon';

import styles from './css/MessageBubbles.css'

const BubbleContent = (props) => {
    const message = props.message;
    if (message.hasOwnProperty("content")) {
        return <div class={styles.message} key={uuid()}>{message.content}</div>
    }
    if (message.hasOwnProperty("sticker")) {
        return <div class={styles.message} key={uuid()}>{message.sticker.uri}</div>
    }
    if (message.hasOwnProperty("photos")) {
        return <div class={styles.message} key={uuid()}>{JSON.stringify(message.photos)}</div>
    }
    return <div class={styles.message} key={uuid()}>{JSON.stringify(message)}</div>;
}

const Bubble = (props) => (
    <div class={classNames(styles.messageWrapper, (props.isRoot ? styles.self : ''))}> 
        <div class={styles.imageWrapper}>
            <Identicon size={50} value={props.sender} className={styles.image} />
        </div>
        <div class={styles.messageContent}>
            <div class={styles.from}>{props.sender}</div>
            { props.messages.map(m => <BubbleContent message={m} />) } 
        </div>
    </div>
);

Bubble.propTypes = {
    isRoot: PropTypes.bool,
    messages: PropTypes.arrayOf(PropTypes.any),
    sender: PropTypes.string,
}

Bubble.defaultProps = {
    isRoot: false,
    messages: [],
    sender: ""
}

export default class MessageBubbles extends Component<Props> {
    render() {
        const {
            messages,
            root
        } = this.props;

        console.log(messages)

        let bubbles =  []
        
        let messageGroup = []
        messages.forEach((message, i) => {
            messageGroup.push(message)
            const nextMessage = messages[i + 1]
            if (
                (nextMessage) &&
                (nextMessage.sender_name !== message.sender_name) &&
                (messageGroup.length)
            ) {
                console.log("grouped")
                bubbles.push(
                    <Bubble
                        key={uuid()}
                        messages={messageGroup}
                        sender={messageGroup[0].sender_name}
                        isRoot={messageGroup[0].sender_name === root}
                    />
                )
                messageGroup = []
            }
        })

        if (messageGroup.length > 0) {
            bubbles.push(
                <Bubble
                    key={uuid()}
                    messages={messageGroup}
                    sender={messageGroup[0].sender_name}
                    isRoot={messageGroup[0].sender_name === root}
                />
            )
        }
        
        return (
            <div className={styles.messages}>
                {bubbles}
            </div>
        )
    }
}

MessageBubbles.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({ content: PropTypes.string, timestamp_ms: PropTypes.number, sender_name: PropTypes.string })),
    root: PropTypes.string,
}

MessageBubbles.defaultProps = {
    messages: [],
    root: "root"
}