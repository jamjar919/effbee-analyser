// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './css/Menu.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.menuContainer}>
        <div className={styles.logo}>
            <h1>Eff Bee Analyser</h1>
        </div>
        <ul className={styles.menu}>
          <li><Link to={routes.HOME}>Home</Link></li>
          <li><Link to={routes.COUNTER}>Counter</Link></li>
          <li><Link to={routes.SETTINGS}>Settings</Link></li>
        </ul>
      </div>
    );
  }
}
