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
            api,
            chat
        } = this.props;

        return (
            <React.Fragment>
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
                        <Icon name='envelope' />
                        <Header.Content>
                            {chat}
                        </Header.Content>
                        <Header.Subheader>idk maybe more stuff here</Header.Subheader>
                    </Header>
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
  