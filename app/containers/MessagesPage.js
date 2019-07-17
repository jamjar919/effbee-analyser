import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';

import PageContainer from './PageContainer'
import MessageBubbles from '../components/MessageBubbles';

import styles from './css/MessagesPage.css';

class MessagesPage extends Component<Props> {

    render() {
        const {
            messages,
            index,
            api
        } = this.props;

        console.log(messages)

        const { profileApi } = api

        if (messages.length < 1) {
            return 'No messages selected!'
        }

        const toShow = messages;
        toShow.reverse()

        return (
            <PageContainer>
                <Segment className={styles.bubblesContainer}>
                    <MessageBubbles
                        messages={toShow}
                        root={profileApi.getFullName()}
                    />
                </Segment>
            </PageContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(MessagesPage)
