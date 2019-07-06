import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react'
import colorBetween from 'color-between';
import uuid from 'uuid/v4';
import moment from 'moment';

import { analyseWordFrequency } from '../facebookapi/textanalysis'

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
        let content = `${word.substring(0, maxWordLength)}...`;
        if (extended) {
            content = word;
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
        const {
            title,
            messages,
            api
        } = this.props;
        
        const {
            messageApi
        } = api

        const chat = { messages, title }
        const firstTimestamp = Math.floor(messages[messages.length - 1].timestamp_ms / 1000)
        const lastTimestamp = Math.floor(messages[0].timestamp_ms / 1000)
        const bucketedMessages = messageApi
            .bucketMessagesByTimeInterval([chat], firstTimestamp, lastTimestamp, 2629746, false)
            .map(bucket => ({
                ...bucket,
                frequency: analyseWordFrequency(bucket.messages)
            }))

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

        const maxSize = 50;
        const numItems = 20;
        let numMissed = 0;
        const avgScore = (frequencyData.reduce((sum, bucket) => {
            if (bucket.frequency.length < 1) {
                numMissed += 1;
                return sum;
            }
            return bucket.frequency[0].score + sum;
        }, 0) / (frequencyData.length - numMissed))

        console.log(frequencyData.map(bucket => bucket.frequency))

        const columns = frequencyData.map(bucket => {
            const mid = Math.floor((bucket.start + bucket.end)/2)
            const toShow = bucket.frequency.splice(0, numItems - 1)
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