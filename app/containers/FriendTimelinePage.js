// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dimmer, Icon, Loader, Header, Segment, Placeholder } from 'semantic-ui-react'
import PageContainer from './PageContainer';

import * as SelectionActions from '../actions/selection';
import type { defaultFacebookType } from '../reducers/defaultTypes'

type Props = {
    api: defaultFacebookType
};

class FriendTimelinePage extends Component<Props> {
    props: Props;

    render() {
        const {
            api
        } = this.props;

        const root = api.profileApi.getRoot();
        const friendsApi = api.friendsApi;
        const messageApi = api.messageApi;

        console.log(friendsApi.getRankingPerTimeInterval(root, messageApi, 31557600));

        return (
            <PageContainer>
                <Header as='h1'>
                    <Icon name='users' />
                    <Header.Content>
                        Friend Timeline
                    </Header.Content>
                    <Header.Subheader>See how your friend ranking changes over time.</Header.Subheader>
                </Header>
            </PageContainer>
        );
    }
}


function mapStateToProps(state) {
    return {
        api: state.facebook
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
        selectFriend: SelectionActions.selectFriendAction(dispatch),
    };
  }
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FriendTimelinePage);
  