import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Header, Icon, Segment, Menu, Placeholder, Item } from 'semantic-ui-react'

import PageContainer from './PageContainer';
import type { defaultFacebookType } from '../reducers/defaultTypes'

type Props = {
    history: object,
    api: defaultFacebookType
};

class ChatPage extends Component<Props> {
    props: Props;

    render() {
        const {
            history,
            api
        } = this.props;

        return (
            <Menu>
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
                    <Icon name='users' />
                    <Header.Content>
                        Friends
                    </Header.Content>
                    <Header.Subheader>Below is a list of your friends, ordered by their shared history with you.</Header.Subheader>
                </Header>
            </PageContainer>
        );
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
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPage));
  