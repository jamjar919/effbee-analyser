import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Menu, Icon, Button, Input, Label, Search, Popup } from 'semantic-ui-react';
import moment from 'moment';

import PageContainer from './PageContainer'
import MessageBubbles from '../components/MessageBubbles';

import menuStyles from '../components/css/Menu.css';
import styles from './css/MessagesPage.css';

class MessageTimeControl extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            date: moment("invalid")
        }
    }

    render() {
        const {
            onSelect
        } = this.props

        return (
            <Popup
                trigger={
                    <Input
                        action={<Button primary onClick={() => { onSelect(this.state.date) }}>Go</Button>}
                        actionPosition='right'
                        placeholder='Enter a date'
                        onChange={(e, input) => {
                            this.setState({ date: moment(input.value, ["DD/MM/YYYY", "DD/MM/YY"]) })
                        }}
                    />
                }
                position="bottom center"
            >
                <Popup.Header>{this.state.date.format("dddd, MMMM Do YYYY")}</Popup.Header>
                <Popup.Content>
                    Type a date in the form day/month/year and hit "Go" to jump directly to the closest message near that date.
                </Popup.Content>
            </Popup>
        )
    }
}

const DEFAULT_MESSAGE_RANGE = 10;
const getIndexRange = (midpoint, max) => [Math.max(0, midpoint - DEFAULT_MESSAGE_RANGE), Math.min(max, midpoint + DEFAULT_MESSAGE_RANGE)]

class MessagesPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            indexRange: [-1, -1]
        }
    }

    componentDidMount() {
        const {
            index,
            messages
        } = this.props;

        this.setState({ indexRange: getIndexRange(index, messages.length) })
    }

    goForwards() {
        const {
            indexRange
        } = this.state;
        const startIndex = indexRange[0]
        const endIndex = indexRange[1]

        this.setState({
            indexRange: [
                Math.max(0, startIndex - DEFAULT_MESSAGE_RANGE),
                endIndex
            ]
        })
    }

    // it feels like we only
    goBackwards() {
        const {
            messages
        } = this.props

        const {
            indexRange
        } = this.state;
        const startIndex = indexRange[0]
        const endIndex = indexRange[1]

        this.setState({
            indexRange: [
                startIndex,
                Math.min(messages.length, endIndex + DEFAULT_MESSAGE_RANGE)
            ]
        })
    }

    goToDate(date) {
        const {
            messages
        } = this.props;

        let closestIndex = -1;
        let i = 0;
        while((i < messages.length) && (closestIndex < 0)) {
            if (date.isAfter(moment(messages[i].timestamp_ms))) {
                closestIndex = i
            }
            i += 1
        }

        this.setState({ indexRange: getIndexRange(closestIndex, messages.length) })

    }

    render() {
        const {
            messages,
            api,
            history
        } = this.props;

        const {
            indexRange
        } = this.state;
        const startIndex = indexRange[0]
        const endIndex = indexRange[1]

        const { profileApi } = api

        if (
            (messages.length < 1) ||
            (startIndex === -1) ||
            (endIndex === -1)
        ) {
            return 'No messages selected!'
        }

        const toShow = messages.slice(startIndex, endIndex);
        toShow.reverse()

      console.log(messages.filter(message => message.index === 864))

      return (
            <React.Fragment>
                <Menu className={menuStyles.topMenu}>
                    <Menu.Item
                        onClick={() => {
                            history.goBack()
                        }}
                    >
                        <Icon name="chevron left" />
                    </Menu.Item>
                </Menu>
                <PageContainer withMenu>
                    <Menu secondary>
                        <Menu.Item>
                            <Label>{messages.length - endIndex} to {messages.length - startIndex} of {messages.length}</Label>
                        </Menu.Item>
                        <Menu.Menu position="right">
                            <Menu.Item>
                                <MessageTimeControl
                                    onSelect={(date) => { this.goToDate(date) }}
                                />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                    <Card className={styles.bubblesContainer} fluid>
                        { endIndex !== messages.length ? <Button onClick={() => { this.goBackwards() }} primary>
                            More
                        </Button> : '' }
                        <MessageBubbles
                            messages={toShow}
                            root={profileApi.getFullName()}
                        />
                        { startIndex !== 0 ? <Button onClick={() => { this.goForwards() }} primary>
                            More
                        </Button> : '' }
                    </Card>
                </PageContainer>
            </React.Fragment>
        )
    }
}


function mapStateToProps(state) {
    return {
        messages: state.selection.messages.allMessages,
        index: state.selection.messages.index,
        api: state.facebook
    };
}

function mapDispatchToProps() {
    return {};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessagesPage))
