import React, { Component } from 'react';
import natural from 'natural';
import uuid from 'uuid';
import { Card } from 'semantic-ui-react';
import moment from 'moment';

import stopwords from '../facebookapi/stopwords'
import MessageBubbles from './MessageBubbles';
import ButtonToMessages from './ButtonToMessages';

import styles from './css/HighlightedMessages.css'

export default class HighlightedMessages extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            tokenisedMessages: []
        }
    }

    componentDidMount() {
        this.updateTokenisedWords()
    }

    componentDidUpdate(prevProps) {
        const {
            messages
        } = this.props
        if (prevProps.messages !== messages) {
            console.info("updating tokenised words")
            this.updateTokenisedWords()
        }
    }

    updateTokenisedWords() {
        // resource intensive (avoid doing if not neccecary)
        const { messages } = this.props;
        const tokenizer = new natural.WordTokenizer();
        const tokenisedMessages = messages
            .map(message => {
                let content = ''
                if (message.content) {
                    content = message.content.toLowerCase()
                }
                return {
                    ...message,
                    tokens: tokenizer.tokenize(content)
                        .filter(word => stopwords.indexOf(word) < 0) // stop words
                        .filter(word =>  !(/^\d+$/.test(word))) // digits
                }
        })
        this.setState({ tokenisedMessages })
    }

    render() {
        const {
            selectedWord,
            messageDateRange
        } = this.props;

        const {
            tokenisedMessages
        } = this.state;

        if (!tokenisedMessages || selectedWord === "") {
            return 'Failed to find any messages';
        }

        const previewSize = 5;

        console.log(messageDateRange)
        let dateFilteredMessages = tokenisedMessages
        if (messageDateRange) {
            dateFilteredMessages = tokenisedMessages
                .filter(message => ((message.timestamp_ms > messageDateRange[0] * 1000) && (message.timestamp_ms < messageDateRange[1] * 1000)))
        }

        const bubbles = dateFilteredMessages
        .filter(message => (
            message.tokens.indexOf(selectedWord.word.toLowerCase()) > -1
        )).map(message => {
            let startIndex = 0;
            if (message.index - previewSize > 0) {
                startIndex = message.index - previewSize;
            }
            let endIndex = tokenisedMessages.length;
            if (message.index + previewSize < tokenisedMessages.length) {
                endIndex = message.index + previewSize
            }

            const toShow = tokenisedMessages.slice(startIndex, endIndex);
            toShow.reverse();

            return (
                <Card key={uuid()} className={styles.highlightContainer} fluid>
                    <MessageBubbles 
                        messages={toShow}
                    />
                    <ButtonToMessages index={message.index} text="Go to conversation" />
                </Card>
            )
        })

        return (
            <Card.Group centered className={styles.highlightBubblesContainer}>
                { bubbles }
            </Card.Group>
        );
    }
}