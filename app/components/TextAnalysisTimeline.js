import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Menu, Search, Label, Dropdown, Popup } from 'semantic-ui-react'
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
            word,
            highlightWord,
            onClick
        } = this.props;

        const {
            maxWordLength,
            extended
        } = this.state

        let size = scaleSize(score, avgScore, maxSize)
        let content = word.substring(0, maxWordLength);
        let color = colorBetween("#000000", "#33C3F0", Math.min((score/avgScore), 1))

        if (extended) {
            content = word;
        } else if (word.length > maxWordLength) {
            content += '...'
        }

        if (highlightWord) {
            size = maxSize * 1.25
            color = "#FF0000"
        }

        return (
            <div
                onClick={() => { onClick(word) }}
                className={styles.word}
                style={{
                    fontSize: `${size}px`,
                    color
                }}
            >
                {content}
            </div>
        )
    }
}

Word.defaultProps = {
    onClick: () => {}
}


export default class TextAnalysisTimeline extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            frequencyData: [],
            highlight: "",
            sortMode: "TFIDF"
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

        const {
            sortMode
        } = this.state;

        const chat = { messages, title }
        const firstTimestamp = Math.floor(messages[messages.length - 1].timestamp_ms / 1000)
        const lastTimestamp = Math.floor(messages[0].timestamp_ms / 1000)
        const bucketedMessages = messageApi
            .bucketMessagesByTimeInterval([chat], firstTimestamp, lastTimestamp, 2629746, false)
            .map(bucket => ({
                ...bucket,
                frequency: analyseWordFrequency(bucket.messages).map(w => {
                    switch(sortMode) {
                        case "TFIDF": {
                            return w;
                        }
                        case "TF": {
                            return {
                                ...w,
                                score: w.tf
                            }
                        }
                    }
                })
            }))

        bucketedMessages.forEach(bucket => {
            bucket.frequency.sort((a, b) => b.score - a.score)
        });

        return bucketedMessages;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.sortMode !== nextState.sortMode) {
            this.setState({ loading: true }, () => {
                setTimeout(() => {
                    const frequencyData = this.getFrequencyData()
                    this.setState({
                        frequencyData,
                        loading: false
                    })
                }, 100)
            })
        }
        return true;
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
            onSelectWord
        } = this.props;

        const {
            loading,
            frequencyData,
            highlight,
            sortMode
        } = this.state;
        
        if (loading) {
            return (<Loader active />)
        }

        const maxSize = 40;
        const numItems = 20;
        let numMissed = 0;

        const rollingAverageSize = 3;
        const lastMaxScores = []
        let i = 0;
        while (
            (lastMaxScores.length < rollingAverageSize) &&
            (i < frequencyData.length)
        ) {
            if (
                (frequencyData[i].frequency.length > 0) &&
                (frequencyData[i].frequency[0].score > 0)
            ) {
                lastMaxScores.push(frequencyData[i].frequency[0].score)
            }
            i += 1;
        }

        let numHighlighted = 0
        let results = []
        const columns = frequencyData.map(bucket => {
            const mid = Math.floor((bucket.start + bucket.end)/2)
            const toShow = bucket.frequency.slice(0, numItems - 1)
            if (
                (toShow.length > 0) &&
                (toShow[0].score > 0)
            ) {
                lastMaxScores.push(toShow[0].score)
                if (lastMaxScores.length > rollingAverageSize) {
                    lastMaxScores.shift()
                }
            }
            return (
                <div
                    className={styles.column}
                    style={{ paddingTop: `${maxSize/2}px` }}
                    key={uuid()}
                >
                    <div className={styles.words}>
                        {
                            toShow.map(f => {
                                const isHighlighted = (
                                    (highlight !== "") &&
                                    (f.word.slice(0, highlight.length) === highlight)
                                )
                                if (isHighlighted) {
                                    numHighlighted += 1
                                    results.push(f.word)
                                }
                                return (
                                    <Word
                                        onClick={(word) => { onSelectWord(f) }}
                                        word={f.word}
                                        score={f.score}
                                        avgScore={lastMaxScores.reduce((sum, score) => sum + score)/rollingAverageSize}
                                        maxSize={maxSize}
                                        key={uuid()}
                                        highlightWord={isHighlighted}
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

        results = results.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        }).map(w => ({ title: w }))

        const textAnalysisOptions = [
            {
                key: 'TF',
                text: 'TF',
                value: 'TF',
                content: <Popup
                    content='Text Frequency (Most frequent words prioritised)'
                    trigger={<div className={styles.dropdownItem}>TF</div>}
                    position="right center"
                />
            },
            {
                key: 'TFIDF',
                text: 'TFIDF',
                value: 'TFIDF',
                content: <Popup
                    content='Text Frequency, Inverse Document Frequency (Smart measure prioritising infrequent words)'
                    trigger={<div className={styles.dropdownItem}>TFIDF</div>}
                    position="right center"
                />
            },
        ]

        return (
            <React.Fragment>
                <Menu secondary className={styles.secondaryMenu}>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <span>
                                Text analysis mode {" "}
                                <Dropdown
                                    inline
                                    options={textAnalysisOptions}
                                    defaultValue={sortMode}
                                    onChange={(e, data) => { this.setState({ sortMode: data.value }) }}
                                />
                            </span>
                        </Menu.Item>
                        <Menu.Item>
                            <Label size="medium" color={numHighlighted > 0 ? 'green' : 'grey'}>
                                { numHighlighted } results
                            </Label>
                        </Menu.Item>
                        <Menu.Item>
                            <Search
                                onSearchChange={(e, data) => { this.setState({ highlight: data.value.toLowerCase() }) }}
                                onResultSelect={(e, data) => { this.setState({ highlight: data.result.title }) }}
                                results={results}
                            />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <div className={styles.container}>
                    { columns }
                </div>
            </React.Fragment>
        );
    }
}

TextAnalysisTimeline.propTypes = {
    title: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.shape({
        sender_name: PropTypes.string,
        content: PropTypes.string,
        timestamp_ms: PropTypes.number, 
        type: PropTypes.string
    })),
    api: PropTypes.shape({
        profileApi: PropTypes.any,
        messageApi: PropTypes.any,
        friendsApi: PropTypes.any
    }),
    onSelectWord: PropTypes.func,
}

TextAnalysisTimeline.defaultProps = {
    messages: [],
    title: "",
    api: {},
    onSelectFriend: () => {}
}