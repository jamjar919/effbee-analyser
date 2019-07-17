import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';

import * as SelectionActions from '../actions/selection';
import routes from '../constants/routes';

class ButtonToMessages extends Component<Props> {
    goToMessages() {
        const {
            history,
            index,
            selectMessagesIndex
        } = this.props;

        selectMessagesIndex(index)
        history.push(routes.MESSAGES)
    }

    render() {
        const {
            text
        } = this.props;

        return (
            <Button onClick={() => { this.goToMessages() }}>
                {text}
            </Button>
        )
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        selectMessagesIndex: SelectionActions.selectMessagesIndexAction(dispatch)
    };
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ButtonToMessages)
);
