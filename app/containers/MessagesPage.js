import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Menu, Icon, Button } from 'semantic-ui-react';

import PageContainer from './PageContainer'
import MessageBubbles from '../components/MessageBubbles';

import menuStyles from '../components/css/Menu.css';
import styles from './css/MessagesPage.css';

const DEFAULT_MESSAGE_RANGE = 30;
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
                Math.min(messages.length - 1, endIndex + DEFAULT_MESSAGE_RANGE)
            ]
        })
    }

    render() {
        const {
            messages,
            index,
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

        console.log(messages)

        const toShow = messages.slice(startIndex, endIndex);
        toShow.reverse()

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
                    <Card className={styles.bubblesContainer} fluid>
                        <Button onClick={() => { this.goBackwards() }} primary>
                            More
                        </Button>
                        <MessageBubbles
                            messages={toShow}
                            root={profileApi.getFullName()}
                        />
                        <Button onClick={() => { this.goForwards() }} primary>
                            More
                        </Button>
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
