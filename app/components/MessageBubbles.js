import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import uuid from 'uuid/v4';

import Identicon from './Identicon';
import SettingsFile from '../SettingsFile';
import { PhotoThumbnail, PhotoThumbnailGroup } from './PhotoThumbnail';

import styles from './css/MessageBubbles.css'

const BubbleContent = (props) => {
    const { message, dataDir } = props;
    if (Object.prototype.hasOwnProperty.call(message, "content")) {
        return <div className={styles.message}>{message.content}</div>
    }
    if (Object.prototype.hasOwnProperty.call(message, "sticker")) {
        return <div><img src={`${dataDir}/${message.sticker.uri}`} alt="sticker" /></div>
    }
    if (Object.prototype.hasOwnProperty.call(message, "photos")) {
        return (
            <PhotoThumbnailGroup dataDir={dataDir}>
                {message.photos.map(photo => <PhotoThumbnail uri={photo.uri} key={uuid()} />)}
            </PhotoThumbnailGroup>
        )
    }
    return <div className={styles.message}>{JSON.stringify(message)}</div>;
}

const Bubble = (props) => (
    <div className={classNames(styles.messageWrapper, (props.isRoot ? styles.self : ''))}> 
        <div className={styles.imageWrapper}>
            <Identicon size={50} value={props.sender} className={styles.image} />
        </div>
        <div className={styles.messageContent}>
            <div className={styles.from}>{props.sender}</div>
            { props.messages.map(m => <BubbleContent message={m} dataDir={props.dataDir} key={uuid()} />) } 
        </div>
    </div>
);

Bubble.propTypes = {
    isRoot: PropTypes.bool,
    messages: PropTypes.arrayOf(PropTypes.any),
    sender: PropTypes.string,
    dataDir: PropTypes.string,
}

Bubble.defaultProps = {
    isRoot: false,
    messages: [],
    sender: "",
    dataDir: ""
}

export default class MessageBubbles extends Component<Props> {
    render() {
        const {
            messages,
            root
        } = this.props;

        const dataDir = new SettingsFile().get("facebookDataDir");

        const bubbles =  []
        let messageGroup = []
        messages.forEach((message, i) => {
            messageGroup.push(message)
            const nextMessage = messages[i + 1]
            if (
                (nextMessage) &&
                (nextMessage.sender_name !== message.sender_name) &&
                (messageGroup.length)
            ) {
                bubbles.push(
                    <Bubble
                        key={uuid()}
                        messages={messageGroup}
                        sender={messageGroup[0].sender_name}
                        isRoot={messageGroup[0].sender_name === root}
                        dataDir={dataDir}
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
                    dataDir={dataDir}
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
    root: "root",
}