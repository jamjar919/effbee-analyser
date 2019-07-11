import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Label } from 'semantic-ui-react';
import natural from 'natural';
import uuid from 'uuid/v4'
import colorBetween from 'color-between';

import stopwords from '../facebookapi/stopwords'


export default class TalkedAbout extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            loading: true,
            numToShow: 20
        }
    }

    analyseTalkedAbout() {
        const {
            messages,
            api,
            participants
        } = this.props;
        
        const names = api.friendsApi.get().map(person => person.name.toLowerCase().split(" ")[0])

        const byCount = {}
        participants.forEach(p => {
            byCount[p.name] = 0
        });

        const tokenizer = new natural.WordTokenizer();
        const namesCount = {}
        messages.forEach(message => {
            if (message.content) {
                const words = tokenizer
                    .tokenize(message.content.toLowerCase())
                    .filter(word => stopwords.indexOf(word) < 0) // stop words

                words.forEach(word => {
                    if (names.indexOf(word) > -1) {
                        if (typeof namesCount[word] === "undefined") {
                            namesCount[word] = {
                                count: 0,
                                by: Object.assign({}, byCount),
                                messages: []
                            }
                        }
                        namesCount[word].count += 1
                        namesCount[word].by[message.sender_name] += 1
                        namesCount[word].messages.push(message)
                    }
                })
            }
        });

        const namesArray = Object.keys(namesCount).map(name => ({
            ...namesCount[name],
            name
        }))
        namesArray.sort((a,b) => b.count - a.count)

        return namesArray;
    }

    componentDidMount() {
        setTimeout(() => {
            const data = this.analyseTalkedAbout()
            this.setState({ loading: false, data })
        }, 100)
    }


    render() {
        const {
            loading,
            data,
            numToShow
        } = this.state;

        if (loading) {
            return <Loader />
        }

        let max = 0;
        if (data.length > 0) {
            max = data[0].count
        }

        const names = data.map(person => (
            <Label
                as='a'
                key={uuid()}
                style={{
                    backgroundColor: colorBetween("#FFFFFF", "#21ba45", person.count/max),
                    color:  person.count/max > 0.5 ? "#FFFFFF" : "rgba(0,0,0,.6)"
                }}
            >
                {person.name}
                <Label.Detail>{person.count}</Label.Detail>
            </Label>
        )).filter((node, i) => i < numToShow)

        if (data.length > numToShow) {
            names.push(
                <Label
                    color="blue"
                    onClick={() => { this.setState({ numToShow: numToShow + 10 }) }}
                    style={{ cursor: "pointer" }}
                    key={uuid()}
                >
                    Show more ({data.length - numToShow})
                </Label>)
        }

        return (
            <Label.Group>
                {names}
            </Label.Group>
        )
    }
}

TalkedAbout.propTypes = {
    messages: PropTypes.arrayOf(Object).isRequired,
    participants: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, count: PropTypes.number })).isRequired,
    api: PropTypes.any.isRequired
}