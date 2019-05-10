// @flow
import React, { Component } from 'react';
import routes from '../constants/routes';
import styles from './css/Home.css';
import Network from './Network';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Network />
      </div>
    );
  }
}
