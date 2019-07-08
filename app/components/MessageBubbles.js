import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import uuid from 'uuid/v4';

import Identicon from './Identicon';

import styles from './css/MessageBubbles.css'

const Bubble = (props) => (
    <div class={classNames(styles.messageWrapper, (props.isRoot ? styles.self : ''))}> 
        <div class={styles.imageWrapper}>
            <Identicon size={50} value={props.sender} className={styles.image} />
        </div>
        <div class={styles.messageContent}>
            <div class={styles.from}>{props.sender}</div>
            <div class={styles.message}>{props.content}</div>
        </div>
    </div>
);

Bubble.propTypes = {
    isRoot: PropTypes.bool,
    content: PropTypes.string,
    sender: PropTypes.string,
}

Bubble.defaultProps = {
    isRoot: false,
    content: "",
    sender: ""
}

export default class MessageBubbles extends Component<Props> {
    render() {
        const {
            messages,
            root
        } = this.props;

        const bubbles = messages.map(message => (
            <Bubble
                key={uuid()}
                content={message.content}
                sender={message.sender_name}
                isRoot={message.sender_name === root}
            />
        ))
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