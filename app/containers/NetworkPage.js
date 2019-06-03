// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon } from 'semantic-ui-react'
import { bindActionCreators } from 'redux';

import Network from '../components/Network';
import TopMenuNetwork from '../components/TopMenuNetwork';
import FriendPreview from '../components/FriendPreview';
import RightPanel from './RightPanel';

import * as NetworkActions from '../actions/network';
import * as SelectionActions from '../actions/selection';

import styles from './css/NetworkPage.css';

type Props = {
  toggleShowRoot: () => void,
  selectFriend: (string) => void,
  showRoot: boolean 
};

class NetworkPage extends Component<Props> {
  props: Props;

  render() {
    const {
        api
    } = this.props

    let profileApi;
    try {
        profileApi = api.profileApi
    } catch (e) {
        // Failed to read files
        return (
            <Header as='h2' icon>
                <Icon name='error' />
                Error Reading Files
                <Header.Subheader>Make sure you've set your Facebook Data Directory in the settings menu.</Header.Subheader>
            </Header>
        );
    }

    const rootName = profileApi.getFullName();
    return (
      <div className={styles.container}>
        <TopMenuNetwork
          toggleShowRoot={() => this.props.toggleShowRoot()}
        />
        <Network
          rootName={rootName}
          showRoot={this.props.showRoot}
          selectFriend={(name) => this.props.selectFriend(name)}
          api={api}
        />
        <RightPanel>
          <FriendPreview />
        </RightPanel>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    showRoot: state.network.showRoot,
    api: state.facebook
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(NetworkActions, dispatch),
    selectFriend: SelectionActions.selectFriendAction(dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NetworkPage);
