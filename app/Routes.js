import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import SettingsPage from './containers/SettingsPage';
import Menu from './components/Menu';
import styles from './app.global.css';

export default () => (
  <App>
    <Menu />
    <div className={styles.container}>
      <Switch>
        <Route path={routes.SETTINGS} component={SettingsPage} />
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </div>
  </App>
);
