import React, { Component } from 'react';
import { Segment, Item, Card, Statistic, Icon, Header, Button, Label } from 'semantic-ui-react'
import Identicon from './Identicon'
import uuid from 'uuid/v4';

import styles from './css/FriendList.css'

type Props = {
    friends: array,
    horizontal: boolean
};

const FriendItem = (name, messages, groups, className='', key = uuid()) => (
    <Item key={key} className={className}>
        <div className="ui small image">
            <Identicon size={150} value={name} />
        </div>
        <Item.Content>
            <Item.Header>{name}</Item.Header>
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
    </Item>
)

export default class FriendList extends React.Component<Props> {
    props: Props;

    constructor(props) {
        super(props);
        this.state = {
            showHidden: false
        }
    }

    render() {
        const {
            friends,
            horizontal
        } = this.props;

        const {
            showHidden
        } = this.state;

        const friendsToShow = friends.filter(f => f.messages > 0)
        const friendsToHide = friends.filter(f => f.messages <= 0)

        let friendCards = friendsToShow.map((person, i) => FriendItem(
                person.name,
                person.messages,
                person.groups,
                (horizontal ? styles.horizontalItem : ''),
                i
            )
        )

        const hiddenFriendCards = friendsToHide.map((person, i) => FriendItem(
                person.name,
                person.messages,
                person.groups,
                (horizontal ? styles.horizontalItem : ''),
                "h" + i
            )
        )

        if (friendCards.length === 0) {
            friendCards.push(
                <Header as='h1' key="noMessages">
                    Nothing To Show
                    <Header.Subheader>There's no group chats or messages shared between this person and any others. Lonely!</Header.Subheader>
                </Header>
            );
        }

        if (!showHidden && (hiddenFriendCards.length > 0)) {
            friendCards.push(
                <Button as='div' labelPosition='left' key="showHidden">
                    <Label as='a' basic>
                        Hidden {hiddenFriendCards.length} Friends
                    </Label>
                    <Button icon onClick={() => { this.setState({ showHidden: true }) }}>
                        <Icon name='eye' />
                    </Button>
                </Button>
            )
        }

        if (showHidden) {
            friendCards = friendCards.concat(hiddenFriendCards)
        }


        return (
            <Item.Group className={horizontal ? styles.horizontalItemGroup : ''}>
                {friendCards}
            </Item.Group>
        )
    }

}