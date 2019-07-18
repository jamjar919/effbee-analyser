import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import uuid from 'uuid/v4';
import moment from 'moment';
import { Popup } from 'semantic-ui-react'

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
    if (Object.prototype.hasOwnProperty.call(message, "gifs")) {
        return (
            <PhotoThumbnailGroup dataDir={dataDir}>
                {message.gifs.map(gif => <PhotoThumbnail uri={gif.uri} key={uuid()} />)}
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

const Announcement = (props) => (
    <div className={ styles.announcement }>{ props.content }</div>
)

export default class MessageBubbles extends Component<Props> {
    render() {
        const {
            messages,
            root
        } = this.props;

        const dataDir = new SettingsFile().get("facebookDataDir");

        const bubbles = []

        bubbles.push(
            <Announcement key={uuid()} content={moment(messages[0].timestamp_ms).format("MMM D, YYYY, h:mm A")} />
        )

        let messageGroup = []
        messages.forEach((message, i) => {
            messageGroup.push(message)
            const nextMessage = messages[i + 1]
            if (
                (nextMessage) && (
                    (
                        (nextMessage.sender_name !== message.sender_name) &&            // make message group if sender is different
                        (messageGroup.length)                                           // and we have messages in the group
                    ) || (                                                              // or
                        (nextMessage.timestamp_ms - message.timestamp_ms > 21600000)    // difference in timestamps is more than 6 hours
                    )
                )
            ) {
                bubbles.push(
                    <Bubble
                        key={uuid()}
                        messages={messageGroup}
                        sender={messageGroup[0].prettySenderName}
                        isRoot={messageGroup[0].sender_name === root}
                        dataDir={dataDir}
                    />
                )
                if (nextMessage.timestamp_ms - message.timestamp_ms > 21600000) {
                    bubbles.push(
                        <Announcement key={uuid()} content={moment(nextMessage.timestamp_ms).format("MMM D, YYYY, h:mm A")} />
                    )
                }
                messageGroup = []
            }
        })

        if (messageGroup.length > 0) {
            bubbles.push(
                <Bubble
                    key={uuid()}
                    messages={messageGroup}
                    sender={messageGroup[0].prettySenderName}
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