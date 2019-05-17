// @flow
import React, { Component } from 'react';
import Network from './Network';
import TopMenuNetwork from './TopMenuNetwork';
import FriendPreview from './FriendPreview';
import RightPanel from '../containers/RightPanel';

import styles from './css/Home.css';


type Props = {
  toggleShowRoot: () => void,
  selectFriend: (string) => void,
  showRoot: boolean 
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container}>
        <TopMenuNetwork
          toggleShowRoot={() => this.props.toggleShowRoot()}
        />
        <Network
          rootName="James Paterson"
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
