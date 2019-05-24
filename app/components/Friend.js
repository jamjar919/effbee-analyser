import React, { Component } from 'react';
import { connect } from 'react-redux';
import MessagesApi from '../facebookapi/messages'
import ProfileApi from '../facebookapi/profile'

type Props = {
    name: string,
};

class Friend extends Component<Props> {
    props: Props;

    render() {
        const {
            name
        } = this.props;

        if (name === false) {
            return (
                <div>
                    Nothing selected!
                </div>
            )
        }

        const messageApi = new MessagesApi();
        const profileApi = new ProfileApi();
        const root = profileApi.getFullName(); 

        return (
            <div>
                {name}
                {JSON.stringify(messageApi.chatsPerTimeInterval([root, name], 2678400))}
            </div>
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
