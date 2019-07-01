import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Header, Icon, Segment, Menu, Placeholder, Item, Grid } from 'semantic-ui-react'

import FriendBreakdownPie from '../components/FriendBreakdownPie';
import PageContainer from './PageContainer';
import type { defaultFacebookType } from '../reducers/defaultTypes'
import menuStyles from '../components/css/Menu.css';

type Props = {
    history: object,
    api: defaultFacebookType
};

class ChatPage extends Component<Props> {
    props: Props;

    render() {
        const {
            history,
            api,
            chat
        } = this.props;

        if (chat === false) {
            return 'Nothing selected!';
        }

        const isPrivateChat = (chat.participants.length === 2)

        console.log(chat)

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
                <PageContainer>
                    <Header as='h1'>
                        <Icon name='envelope' />
                        <Header.Content>
                            {chat.title}
                        </Header.Content>
                        <Header.Subheader>{isPrivateChat ? 'Private Chat' : `Group Chat (x${chat.participants.length})` }</Header.Subheader>
                    </Header>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={10}>
                            <Segment.Group>
                                <Segment>
                                    <Header as='h3'>
                                        <Icon name='area graph' />
                                        <Header.Content>Basic Statistics</Header.Content>
                                    </Header>
                                </Segment>
                                <Segment>
                                    <Grid columns={2} centered>
                                        <Grid.Column>
                                        </Grid.Column>
                                        <Grid.Column>
                                        </Grid.Column>
                                    </Grid>
                                </Segment>
                            </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Segment>
                                    <FriendBreakdownPie friends={chat.participants} />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </PageContainer>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {
    const api = state.facebook
    return {
        api,
        chat: state.selection.chat
    };
}
  
function mapDispatchToProps(dispatch) {
    return {}
}
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPage));
  