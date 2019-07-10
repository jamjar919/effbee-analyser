import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import natural from 'natural';
import stopwords from '../facebookapi/stopwords'

export default class TalkedAbout extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            loading: true
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

        console.log(namesArray)

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
        } = this.state;

        if (loading) {
            return <Loader />
        }

        console.log(data)
        return ''
    }
}

TalkedAbout.propTypes = {
    messages: PropTypes.arrayOf(Object).isRequired,
    participants: PropTypes.arrayOf(PropTypes.string).isRequired,
    api: PropTypes.any.isRequired
}