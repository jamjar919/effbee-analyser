import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon, Segment, Menu, Placeholder, Item } from 'semantic-ui-react'
import PageContainer from './PageContainer';
import ChatList from '../components/ChatList';

class ChatsPage extends React.Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            chats: [],
            loading: true
        }
    }

    componentDidMount() {
        const {
            api
        } = this.props;

        setTimeout(() => {
            const root = api.profileApi.getFullName()
            const chats = api.messageApi.chats(root).chats
            this.setState({
                chats,
                loading: false
            })
        }, 100)
    }

    render() {
        const {
            chats,
            loading
        } = this.state

        return (
            <PageContainer>
                <Header as='h1'>
                    <Icon name='users' />
                    <Header.Content>
                        Chats
                    </Header.Content>
                    <Header.Subheader>Below is a list of group chats that you are in.</Header.Subheader>
                </Header>
                <Segment loading={loading}>
                    <ChatList
                        chats={chats}
                        defaultNumToShow={50}
                    />
                </Segment>
            </PageContainer>
        )
    }
}


function mapStateToProps(state) {
    const api = state.facebook
    return {
        api
    };
}
    
function mapDispatchToProps(dispatch) {
    return {}
}
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatsPage);
      