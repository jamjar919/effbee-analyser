// @flow
import React, { Component } from 'react';
import { Header, Icon } from 'semantic-ui-react'


import Network from './Network';
import TopMenuNetwork from './TopMenuNetwork';
import FriendPreview from './FriendPreview';
import RightPanel from '../containers/RightPanel';
import ProfileApi from '../facebookapi/profile'

import styles from './css/Home.css';


type Props = {
  toggleShowRoot: () => void,
  selectFriend: (string) => void,
  showRoot: boolean 
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    try {
        const profileApi = new ProfileApi();
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

    const profileApi = new ProfileApi();
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
        />
        <RightPanel>
          <FriendPreview />
        </RightPanel>
      </div>
    );
  }
}
