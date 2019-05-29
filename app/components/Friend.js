import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon } from 'semantic-ui-react'

import MessagesApi from '../facebookapi/messages'
import ProfileApi from '../facebookapi/profile'
import MessageTimeline from './MessageTimeline';
import Identicon from './Identicon';

type Props = {
    name: string,
};

class Friend extends Component<Props> {
    props: Props;

    render() {
        const {
            name
        } = this.props;

        if (name === false) {
            return (
                <div>
                    Nothing selected!
                </div>
            )
        }

        const messageApi = new MessagesApi();
        const profileApi = new ProfileApi();
        const root = profileApi.getFullName(); 
        const chatsInterval = messageApi.chatsPerTimeInterval(root, name, 2678400);
        const chats = messageApi.chatsBetween([root, name])
        console.log(messageApi.getTimeDetails(chats.chats))

        return (
            <div>
                <Header as='h2'>
                    <Identicon size={75} value={name} className="ui circular image"/>
                    <Header.Content>
                        {name}
                        <Header.Subheader>Awards here...</Header.Subheader>
                    </Header.Content>
                </Header>
                <div>
                    <Header as='h3'>
                        <Icon name='facebook messenger' />
                        <Header.Content>Message Frequency</Header.Content>
                    </Header>
                    <MessageTimeline 
                        chats={chatsInterval}
                        people={[ root, name ]}
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    if (state.selection.type === 'FRIEND') {
        return { 
            name: state.selection.selection
        };
    }
    return { name: false }
}

function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Friend);
