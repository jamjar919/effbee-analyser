// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';

import type { Store } from '../reducers/types';
import Routes from '../Routes';

type Props = {
    store: Store,
    history: {}
};

class Root extends Component<Props> {
    render() {
        const {
            store,
            history,
            api
        } = this.props;
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Routes api={api} />
                </ConnectedRouter>
            </Provider>
        );
    }
}


function mapStateToProps(state) {
    return {
        api: state.facebook
    };
}

function mapDispatchToProps() { 
    return { }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Root);
