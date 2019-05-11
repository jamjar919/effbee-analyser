// @flow
import React, { Component } from 'react';
import vis from 'vis';
import FriendsApi from '../facebookapi/friends'
import MessagesApi from '../facebookapi/messages'

import styles from './css/Network.css'

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount() {
    const friendNodes = new FriendsApi()
        .get()
        .map(friend => friend.name)
        .map(name => ({
            label: name,
            id: name
        }));
    const nodes = new vis.DataSet(friendNodes);
    
    const messageData = new MessagesApi()
    const edges = new vis.DataSet()

    const container = document.getElementById('network');
    const data = {
        nodes,
        edges
    };

    const network = new vis.Network(container, data, {});
  }

  render() {
    return (
      <div id="network" className={styles.network}></div>
    );
  }
}
