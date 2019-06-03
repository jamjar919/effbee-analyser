import React, { Component } from 'react';
import { Segment, Item, Card, Statistic, Icon, Header } from 'semantic-ui-react'
import Identicon from './Identicon'

import styles from './css/FriendList.css'

type Props = {
    friends: array,
    horizontal: boolean
};

export default class FriendList extends React.Component<Props> {
    props: Props;

    render() {
        const {
            friends,
            horizontal
        } = this.props;

        const friendCards = friends.map((person, i) => (
            <Item key={i} className={horizontal ? styles.horizontalItem : ''}>
                <div className="ui small image">
                    <Identicon size={150} value={person.name} />
                </div>
                <Item.Content>
                    <Item.Header>{person.name}</Item.Header>
                    <Item.Description>
                        <Statistic>
                            <Statistic.Value>{person.messages}</Statistic.Value>
                            <Statistic.Label>Messages Shared</Statistic.Label>
                        </Statistic>
                    </Item.Description>
                    <Item.Extra>
                        <Icon name='users' />
                        {person.groups} Shared Group Chats
                    </Item.Extra>
                </Item.Content>
            </Item>
        ))

        if (friendCards.length === 0) {
            friendCards.push(
                <Header as='h1' key="noMessages">
                    Nothing To Show
                    <Header.Subheader>There's no group chats or messages shared between this person and any others. Lonely!</Header.Subheader>
                </Header>
            );
        }


        return (
            <Item.Group className={horizontal ? styles.horizontalItemGroup : ''}>
                {friendCards}
            </Item.Group>
        )
    }

}