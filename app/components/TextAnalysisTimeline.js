import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react'
import colorBetween from 'color-between';
import uuid from 'uuid/v4';
import moment from 'moment';

import { isMessageTextOnly, turnMessagesIntoDocuments, countMessages, analyseWordFrequency } from '../facebookapi/textanalysis'

import styles from './css/TextAnalysisTimeline.css'

const scaleSize = (score, maxScore, maxSize) => {
    return Math.max(Math.min((score/maxScore) * maxSize, maxSize), 10);
}

class Word extends Component<Props> {
    constructor(props) {
        super(props)
        const maxWordLength = 15;
        this.state = {
            maxWordLength,
            extended: (props.word.length <= maxWordLength)
        }
    }

    render() {
        const {
            score,
            avgScore,
            maxSize,
            word
        } = this.props;

        const {
            maxWordLength,
            extended
        } = this.state

        const size = scaleSize(score, avgScore, maxSize)
        let content = word.substring(0, maxWordLength);
        if (extended) {
            content = word;
        } else if (word.length > maxWordLength) {
            content += '...'
        }
        return (
            <div
                onClick={() => { this.setState({ extended: !extended }) }}
                className={styles.word}
                style={{
                    fontSize: `${size}px`,
                    color: colorBetween("#000000", "#33C3F0", Math.min((score/avgScore), 1))
                }}
            >
                {content}
            </div>
        )
    }
}


export default class TextAnalysisTimeline extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            frequencyData: []
        }
    }

    getFrequencyData() {
        console.log("getting frequency data")

        const {
            title,
            messages,
            api
        } = this.props;
        
        const {
            messageApi
        } = api

        const { scores, count, totalTerms, totalDocuments } = analyseWordFrequency(messages)

        const chat = { messages, title }
        const firstTimestamp = Math.floor(messages[messages.length - 1].timestamp_ms / 1000)
        const lastTimestamp = Math.floor(messages[0].timestamp_ms / 1000)
        const bucketedMessages = messageApi
            .bucketMessagesByTimeInterval([chat], firstTimestamp, lastTimestamp, 2629746, false)
            .map(bucket => {
                const messagesCopy = bucket.messages.filter(message => isMessageTextOnly(message))
                const documents = turnMessagesIntoDocuments(messagesCopy)
                const bucketCount = countMessages(documents).count
                const frequency = Object.keys(bucketCount).map(word => {
                    const tf = bucketCount[word].wordCount / totalTerms
                    const idf = Math.log(totalDocuments / bucketCount[word].docCount)
                    const score = tf * idf
                    return {word, score, tf, idf, count: bucketCount[word]}
                })
                frequency.sort((a, b) => b.score - a.score)

                return ({
                    ...bucket,
                    frequency
                })
            })

        return bucketedMessages;
    }

    componentDidMount() {
        setTimeout(() => {
            const frequencyData = this.getFrequencyData()
            this.setState({
                frequencyData,
                loading: false
            })
        }, 100)
    }

    render() {
        const {
            loading,
            frequencyData
        } = this.state;
        
        if (loading) {
            return (<Loader active />)
        }

        const maxSize = 40;
        const numItems = 20;
        let numMissed = 0;
        const avgScore = (frequencyData.reduce((sum, bucket) => {
            if (bucket.frequency.length < 1) {
                numMissed += 1;
                return sum;
            }
            return bucket.frequency[0].score + sum;
        }, 0) / (frequencyData.length - numMissed))

        const maxMessages = frequencyData.reduce((max, bucket) => {
            if (max < bucket.messages.length) {
                return bucket.messages.length
            }
            return max;
        }, 0)

        const columns = frequencyData.map(bucket => {
            const mid = Math.floor((bucket.start + bucket.end)/2)
            const toShow = bucket.frequency.slice(0, numItems - 1)
            return (
                <div
                    className={styles.column}
                    style={{ paddingTop: `${maxSize/2}px` }}
                >
                    <div className={styles.words}>
                        {
                            toShow.map(f => {
                                return (
                                    <Word
                                        word={f.word}
                                        score={f.score}
                                        avgScore={avgScore}
                                        maxSize={maxSize}
                                        key={uuid()}
                                    />
                                )
                            })
                        }
                    </div>
                    <div className={styles.date}>
                        { moment.unix(mid).format("MMMM YYYY") }
                    </div>
                </div>
            )
        })

        return (
            <div className={styles.container}>
                { columns }
            </div>
        );
    }
}

TextAnalysisTimeline.propTypes = {
    title: PropTypes.string,
    messages: PropTypes.arrayOf({
        sender_name: PropTypes.string,
        content: PropTypes.string,
        timestamp_ms: PropTypes.number, 
        type: PropTypes.string
    }),
    api: PropTypes.shape({
        profileApi: PropTypes.any,
        messageApi: PropTypes.any,
        friendsApi: PropTypes.any
    })
}

TextAnalysisTimeline.defaultProps = {
    messages: [],
    title: "",
    api: {}
}