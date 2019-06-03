// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
  children: React.Node
};

class FriendsPage extends React.Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
    }

    render() {
        const {
            children
        } = this.props

        return (
            <div>Some cool stuff{children}</div>
        );
    }
}


function mapStateToProps(state) {
    return {};
}
  
function mapDispatchToProps(dispatch) {
    return {}
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FriendsPage);
  