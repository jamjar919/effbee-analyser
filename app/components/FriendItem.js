import React, { Component } from 'react';
import { Segment, Item, Card, Statistic, Icon, Header, Button, Label, Dimmer } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as SelectionActions from '../actions/selection';
import Identicon from './Identicon'
import routes from '../constants/routes';
import styles from './css/FriendItem.css'

type Props = {
    name: string,
    className: string,
    messages: string,
    groups: string,
    history: object,
};


class FriendItem extends React.Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }
    
    toFriend() {
        const {
            name,
            selectFriend,
            history
        } = this.props;

        this.setState({ loading: true }, () => {
            setTimeout(() => {
                selectFriend(name);
                history.push(routes.FRIEND);
                this.setState({ loading: false })
            }, 10)
        })
    }

    render() {
        const {
            className,
            name,
            messages,
            groups
        } = this.props;

        const { loading } = this.state;

        return (
            <Item className={className}>
                <div className="ui small image">
                    <Identicon size={150} value={name} />
                </div>
                <Item.Content>
                    <Item.Header className={styles.friendHeader} onClick={() => { this.toFriend() }}>{name}</Item.Header>
                    <Item.Description>
                        <Statistic>
                            <Statistic.Value>{messages}</Statistic.Value>
                            <Statistic.Label>Messages Shared</Statistic.Label>
                        </Statistic>
                    </Item.Description>
                    <Item.Extra>
                        <Icon name='users' />
                        {groups} Shared Group Chats
                    </Item.Extra>
                </Item.Content>
                {loading ? (
                    <Dimmer active={true} page>
                        <Header as='h2' icon inverted>
                            <Icon name='sync' loading={true}/>
                            Loading Person
                            <Header.Subheader>Hold on..</Header.Subheader>
                        </Header>
                    </Dimmer>
                ) : ''}
            </Item>
        )
    }
}


function mapStateToProps() { return {} } 

function mapDispatchToProps(dispatch) {
    return {
        selectFriend: SelectionActions.selectFriendAction(dispatch)
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(FriendItem)
);
