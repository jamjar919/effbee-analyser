import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Label, Popup } from 'semantic-ui-react';
import moment from 'moment';
import uuid from "uuid/v4";

export default class ChatNamesHistory extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            loading: true,
            numToShow: 10,
        }
    }

    analyseChatNames() {
        const {
            messages
        } = this.props;
        
        const pattern = new RegExp("(.*) named the group (.*)\.")
        
        const changes = messages
            .filter(message => message.content && pattern.test(message.content))
            .map(message => ({
                ...message,
                change: pattern.exec(message.content)[2]
            }));
        changes.reverse()

        return changes;
    }

    componentDidMount() {
        const data = this.analyseChatNames()
        this.setState({ loading: false, data })
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

        const names = data
            .map(message => (
                <Popup
                    position="top center"
                    content={`Changed by ${message.prettySenderName} on ${moment(message.timestamp_ms).format("MMMM Do YYYY")} (${moment(message.timestamp_ms).fromNow()})`}
                    trigger={<Label>{message.change}</Label>}
                    key={uuid()}
                />
            ))
            .filter((message, i) => i < numToShow)
        
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

ChatNamesHistory.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape(Object))
}