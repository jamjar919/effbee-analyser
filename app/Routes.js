import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import NetworkPage from './containers/NetworkPage';
import CounterPage from './containers/CounterPage';
import SettingsPage from './containers/SettingsPage';
import FriendsPage from './containers/FriendsPage';
import Friend from './components/Friend';
import Menu from './components/Menu';
import styles from './app.global.css';

const pages = [ 
    <Route key="1" path={routes.FRIEND} component={Friend} />,
    <Route key="2" path={routes.COUNTER} component={CounterPage} />,
    <Route key="3" path={routes.NETWORK} component={NetworkPage} />,
    <Route key="4" path={routes.FRIENDS} component={FriendsPage} />
]

export default () => (
  <App>
    <Menu />
    <div className={styles.container}>
      <Switch>
        {pages}
        <Route path={routes.SETTINGS} component={SettingsPage} />
      </Switch>
    </div>
  </App>
);
