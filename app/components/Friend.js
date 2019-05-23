import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
    name: string,
};

class Friend extends Component<Props> {
    props: Props;

    render() {
        const {
            name
        } = this.props;
        return (
            <div>{name}</div>
        );
    }

}

function mapStateToProps(state) {
    if (state.selection.type === 'FRIEND') {
        return { 
            name: state.selection.selection
        };
    }
    return { name: false }
}

function mapDispatchToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Friend);
