// @flow
import React, { Component } from 'react';
import Network from './Network';
import TopMenuNetwork from './TopMenuNetwork';

import styles from './css/Home.css';


type Props = {
  toggleShowRoot: () => void,
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
        <Network rootName="James Paterson" showRoot={this.props.showRoot} />
      </div>
    );
  }
}
