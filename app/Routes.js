import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import NetworkPage from './containers/NetworkPage';
import CounterPage from './containers/CounterPage';
import SettingsPage from './containers/SettingsPage';
import Friend from './components/Friend';
import Menu from './components/Menu';
import styles from './app.global.css';

export default () => (
  <App>
    <Menu />
    <div className={styles.container}>
      <Switch>
        <Route path={routes.FRIEND} component={Friend} />
        <Route path={routes.SETTINGS} component={SettingsPage} />
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.NETWORK} component={NetworkPage} />
      </Switch>
    </div>
  </App>
);
