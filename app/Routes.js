import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import NetworkPage from './containers/NetworkPage';
import CounterPage from './containers/CounterPage';
import SettingsPage from './containers/SettingsPage';
import FriendsPage from './containers/FriendsPage';
import FriendsTimelinePage from './containers/FriendTimelinePage';
import ChatPage from './containers/ChatPage';
import Friend from './components/Friend';
import Menu from './components/Menu';
import styles from './app.global.css';

export default () => (
  <App>
    <Menu />
    <div className={styles.container}>
      <Switch>
        <Route path={routes.CHAT} component={ChatPage} />
        <Route path={routes.FRIEND} component={Friend} />
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.NETWORK} component={NetworkPage} />
        <Route path={routes.FRIENDS} component={FriendsPage} />
        <Route path={routes.FRIENDSTIMELINE} component={FriendsTimelinePage} />
        <Route path={routes.SETTINGS} component={SettingsPage} />
      </Switch>
    </div>
  </App>
);
