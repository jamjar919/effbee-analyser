// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Header, Segment, Menu, Dropdown, Button, Search } from 'semantic-ui-react'
import PageContainer from './PageContainer';
import FriendRankingTimeline from '../components/FriendRankingTimeline'
import FriendSearchForm from '../components/FriendSearchForm'

import * as SelectionActions from '../actions/selection';
import type { defaultFacebookType } from '../reducers/defaultTypes'
import styles from './css/FriendTimelinePage.css'

type Props = {
    api: defaultFacebookType,
    selectedFriend: string,
    selectFriend: (string) => void
};

class FriendTimelinePage extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props);

        const {
            friendsApi,
            messageApi,
            profileApi
        } = props.api

        const defaultInterval = 31557600; // one year

        this.state = {
            interval: defaultInterval,
            numPeople: 10,
            ranking: friendsApi.getRankingPerTimeInterval(profileApi.getFullName(), messageApi, defaultInterval)
        }
    }

    changeNumPeople(num) {
        const {
            numPeople
        } = this.state

        if (numPeople + num > 0) {
            this.setState({ numPeople: numPeople + num })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            interval
        } = this.state;

        const {
            friendsApi,
            messageApi,
            profileApi
        } = this.props.api

        // update ranking if interval has changed
        if (prevState.interval !== interval) {
            const root = profileApi.getFullName();
            this.setState({ ranking: friendsApi.getRankingPerTimeInterval(root, messageApi, interval) })
            console.log("update ranking")
        }
    }

    render() {
        const {
            api,
            selectedFriend,
            selectFriend
        } = this.props;


        const {
            interval,
            numPeople,
            ranking
        } = this.state;

        return (
            <PageContainer>
                <Header as='h1'>
                    <Icon name='users' />
                    <Header.Content>
                        Friend Timeline
                    </Header.Content>
                    <Header.Subheader>See how your friend ranking changes over time.</Header.Subheader>
                </Header>
                <Menu secondary>
                    <Dropdown item text='Time Interval'>
                        <Dropdown.Menu>
                            <Menu.Item
                                active={interval === 31557600 * 5}
                                onClick={() => this.setState({ interval: 31557600 * 5 })}
                            >
                                5 Year                    
                            </Menu.Item>
                            <Menu.Item
                                active={interval === 31557600 * 2}
                                onClick={() => this.setState({ interval: 31557600 * 2 })}
                            >
                                2 Year
                            </Menu.Item>
                            <Menu.Item
                                active={interval === 31557600}
                                onClick={() => this.setState({ interval: 31557600 })}
                            >
                                Yearly
                            </Menu.Item>
                            <Menu.Item
                                active={interval === 2629800 * 6}
                                onClick={() => this.setState({ interval: 2629800 * 6 })}
                            >
                                6 Months
                            </Menu.Item>
                            <Menu.Item
                                active={interval === 2629800}
                                onClick={() => this.setState({ interval: 2629800 })}
                            >
                                Monthly
                            </Menu.Item>
                            <Menu.Item
                                active={interval === 604800}
                                onClick={() => this.setState({ interval: 604800 })}
                            >
                                Weekly
                            </Menu.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item>
                        <Button.Group>
                            <Button onClick={() => { this.changeNumPeople(-5) }}>Less</Button>
                            <Button.Or text={numPeople} />
                            <Button onClick={() => { this.changeNumPeople(5) }}>More</Button>
                        </Button.Group>
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <FriendSearchForm
                            onResultSelect={(name) => {
                                selectFriend(name)
                            }}
                        />
                    </Menu.Menu>
                </Menu>
                <Segment className={styles.timelineContainer}>
                    <FriendRankingTimeline
                        rankingPerInterval={ranking}
                        numPeople={numPeople}
                        selectedFriend={selectedFriend}
                        onSelectFriend={(friend) => { selectFriend(friend) }}
                    />
                </Segment>
            </PageContainer>
        );
    }
}


function mapStateToProps(state) {
    let selectedFriend = false;
    if (state.selection.type === "FRIEND") {
        selectedFriend = state.selection.selection
    }
    return {
        api: state.facebook,
        selectedFriend,
    };
}
  
  function mapDispatchToProps(dispatch) {
    return {
        selectFriend: SelectionActions.selectFriendAction(dispatch),
    };
  }
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FriendTimelinePage);
  