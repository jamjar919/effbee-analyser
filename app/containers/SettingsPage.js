import React, { Component } from 'react';
import Settings from '../components/Settings';
import { Link } from 'react-router-dom';

type Props = {};

export default class SettingsPage extends Component<Props> {
  props: Props;

  render() {
    return <Settings />
  }
}
