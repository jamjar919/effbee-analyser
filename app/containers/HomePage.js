// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as NetworkActions from '../actions/network';

function mapStateToProps(state) {
  return {
    showRoot: state.network.showRoot
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NetworkActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
