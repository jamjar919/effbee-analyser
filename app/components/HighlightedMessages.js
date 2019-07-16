import React, { Component } from 'react';
import natural from 'natural';
import stopwords from '../facebookapi/stopwords'
import MessageBubbles from './MessageBubbles';

export default class HighlightedMessages extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            tokenisedMessages: []
        }
    }

    updateTokenisedWords() {
        // resource intensive (avoid doing if not neccecary)
        const { messages } = this.props;
        const tokenizer = new natural.WordTokenizer();
        const tokenisedMessages = messages
            .filter(message => message.content)
            .map(message => ({
                ...message,
                tokens: tokenizer.tokenize(message.content.toLowerCase())
                    .filter(word => stopwords.indexOf(word) < 0) // stop words
                    .filter(word =>  !(/^\d+$/.test(word))) // digits
            }))
        this.setState({ tokenisedMessages })
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

    render() {
        const {
            selectedWord
        } = this.props;

        const {
            tokenisedMessages
        } = this.state;

        console.log(tokenisedMessages)

        const bubbles = <MessageBubbles 
            messages={tokenisedMessages.filter(message => (
                message.tokens.indexOf(selectedWord.word.toLowerCase()) > -1
            ))}
        />

        return <div>{ bubbles }</div>;
    }
}