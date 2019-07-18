import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Header, Icon, Segment, Menu, Sidebar } from 'semantic-ui-react'

import PageContainer from './PageContainer';
import ChatPageContent from './ChatPageContent';
import HighlightedMessages from '../components/HighlightedMessages';

import type { defaultFacebookType } from '../reducers/defaultTypes';
import * as SelectionActions from '../actions/selection';
import menuStyles from '../components/css/Menu.css';
import styles from './css/ChatPage.css';

type Props = {
    history: object,
    api: defaultFacebookType,
    messages: array
};

class ChatPage extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props);
        this.state = {
            visibleSidebar: false,
            timeRangeMessages: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.messages.selectedWord !== this.props.messages.selectedWord) {
            this.setState({ visibleSidebar: true })
        }

        if (prevProps.chat.messages !== this.props.messages.allMessages) {
            this.props.selectMessages(this.props.chat.messages)
            this.setState({ visibleSidebar: false })
        }
    }

    render() {
        const {
            history,
            api,
            chat,
            messages,
            selectMessages
        } = this.props;
        
        const {
            visibleSidebar
        } = this.state;

        const {
            allMessages,
            selectedWord
        } = messages;

        if (chat === false) {
            return 'Nothing selected!';
        }

        const isPrivateChat = (chat.participants.length === 2)

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
                <Sidebar.Pushable>
                    <Sidebar
                        as={Segment}
                        animation='slide along'
                        vertical
                        visible={visibleSidebar}
                        direction="right"
                        className={styles.messagesSidebarContainer}
                        width="very wide"
                    >
                        <Menu className={menuStyles.topSidebarMenu}>
                            <Menu.Item 
                                onClick={() => {
                                    this.setState({ visibleSidebar: false })
                                }}
                            >
                                <Icon name="chevron right" />
                            </Menu.Item>
                        </Menu>
                        <div className={styles.messagesSidebarContent}>
                            <Header as='h2'>
                                <Icon name='searchengin' />
                                <Header.Content>
                                    Conversations containing the word {selectedWord.word}
                                </Header.Content>
                                <Header.Subheader>{selectedWord.word}</Header.Subheader>
                            </Header>
                            <HighlightedMessages
                                messages={allMessages}
                                selectedWord={selectedWord}
                            />
                        </div>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <PageContainer withMenu>
                            <Header as='h1'>
                                <Icon name='envelope' />
                                <Header.Content>
                                    {chat.prettyTitle}
                                </Header.Content>
                                <Header.Subheader>{isPrivateChat ? 'Private Chat' : 'Group Chat' }</Header.Subheader>
                            </Header>
                            <ChatPageContent
                                api={api}
                                chat={chat}
                                isPrivateChat={isPrivateChat}
                                selectMessages={(allMessages, highlightedMessages) => { selectMessages(allMessages, highlightedMessages) }}
                            />
                        </PageContainer>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>

            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const api = state.facebook
    return {
        api,
        chat: state.selection.chat,
        messages: state.selection.messages
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
        selectMessages: SelectionActions.selectMessagesAction(dispatch)
    }
}
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPage));
  