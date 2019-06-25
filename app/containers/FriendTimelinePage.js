// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Header, Segment, Menu, Dropdown, Button, Search } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import PageContainer from './PageContainer';
import FriendRankingTimeline from '../components/FriendRankingTimeline'
import FriendSearchForm from '../components/FriendSearchForm'
import FriendList from '../components/FriendList'
import SelectedRankingTimelineFriend from '../components/SelectedRankingTimelineFriend'

import routes from '../constants/routes';
import * as SelectionActions from '../actions/selection';
import type { defaultFacebookType } from '../reducers/defaultTypes'
import styles from './css/FriendTimelinePage.css'

type Props = {
    api: defaultFacebookType,
    selectedFriend: string,
    selectFriend: (string) => void,
    history: object,
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
            selectedColumn: { data: false, index: false },
            selectedRow: false,
            selectedFriend: "",
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
        }
    }

    render() {
        const {
            api,
            selectFriend,
            history
        } = this.props;

        const {
            interval,
            numPeople,
            ranking,
            selectedColumn,
            selectedRow,
            selectedFriend
        } = this.state;

        let selectedFriendElement = ""
        if (selectedFriend !== "" && ranking) {
            selectedFriendElement = (
                <Segment>
                    <Header 
                        as='h2'
                        className={styles.selectedFriendHeader}
                        onClick={() => {
                            selectFriend(selectedFriend)
                            history.push(routes.FRIEND);
                        }}
                    >
                        <Icon name='user' />
                        <Header.Content>{selectedFriend}</Header.Content>
                    </Header>
                    <SelectedRankingTimelineFriend
                        ranking={ranking}
                        friend={selectedFriend}
                        numPeople={numPeople}
                    />
                </Segment>
            )
        }

        let selectedColumnElement = ""
        if (selectedColumn.index !== false) {
            const data = selectedColumn.data;
            const start = moment.unix(data.start).format("MMMM Do YYYY");
            const end = moment.unix(data.end).format("MMMM Do YYYY");
            if (data.ranking) {
                selectedColumnElement = (
                    <Segment>
                        <Header as='h1' >
                            <Icon name='clock' />
                            <Header.Content>
                                {start} - {end}
                            </Header.Content>
                            <Header.Subheader>Ranking during selected time period</Header.Subheader>
                        </Header>
                        <FriendList 
                            friends={data.ranking.map(f => ({
                                name: f.name,
                                messages: f.count,
                            }))}
                            horizontal
                        />
                    </Segment>
                )
            }
        }

        return (
            <PageContainer>
                <Header as='h1' >
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
                    {   (selectedFriendElement || selectedColumnElement) && (
                        <Menu.Item>
                            <Button
                                onClick={() => {
                                    this.setState({
                                        selectedFriend: "",
                                        selectedColumn: {
                                            ...selectedColumn,
                                            index: false   
                                        }
                                    })
                                }}
                                color='red'
                            >
                                Clear Selection
                            </Button>
                        </Menu.Item>
                    )}
                    <Menu.Menu position="right">
                        <FriendSearchForm
                            onResultSelect={(name) => {
                                this.setState({ selectedFriend: name })
                            }}
                        />
                    </Menu.Menu>
                </Menu>
                <Segment className={styles.timelineContainer}>
                    <FriendRankingTimeline
                        rankingPerInterval={ranking}
                        numPeople={numPeople}
                        selectedFriend={selectedFriend}
                        selectedColumn={selectedColumn.index}
                        selectedRow={selectedRow}
                        onSelectFriend={(friend) => {
                            let val = false;
                            if (selectedFriend !== friend) {
                                val = friend
                            }
                            this.setState({ selectedFriend: val }) 
                        }}
                        onSelectColumn={(col, index) => {
                            let val = false;
                            if (index !== selectedColumn.index) {
                                val = index
                            }
                            this.setState({ selectedColumn: { index: val, data: col } }) 
                        }}
                        onSelectRow={(row, index) => {
                            let val = false;
                            if (index !== selectedRow) {
                                val = index
                            }
                            this.setState({ selectedRow: val }) 
                        }}
                    />
                </Segment>
                { selectedFriendElement }
                { selectedColumnElement }
            </PageContainer>
        );
    }
}


function mapStateToProps(state) {
    return {
        api: state.facebook,
    };
}
  
  function mapDispatchToProps(dispatch) {
    return {
        selectFriend: SelectionActions.selectFriendAction(dispatch),
    };
  }
  
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(FriendTimelinePage)
);
  