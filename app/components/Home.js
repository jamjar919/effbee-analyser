// @flow
import React, { Component } from 'react';
import routes from '../constants/routes';
import Network from './Network';

import styles from './css/Home.css';


type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container}>
        <h2>Home</h2>
        <Network />
      </div>
    );
  }
}
