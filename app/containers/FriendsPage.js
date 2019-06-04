// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon, Segment, Menu, Placeholder, Item } from 'semantic-ui-react'
import moment from 'moment';
import PageContainer from './PageContainer';
import type { defaultFacebookType } from '../reducers/defaultTypes'

import FriendList from '../components/FriendList';

type Props = {
    api: defaultFacebookType
};

const PlaceholderFriends = [
    <Placeholder key="placeholder">
        <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
        </Placeholder.Paragraph>
    </Placeholder>
]

class FriendsPage extends React.Component<Props> {
    props: Props;

    constructor(props) {
        super(props);
        this.state = {
            ranking: false,
            loading: false,
            filterMode: "NONE", // can be NONE, 5YEAR, YEAR, 6MONTH, MONTH, WEEK
            timeperiod: [],
            content: ''
        }
    }

    componentDidMount() {
        this.updateRanking()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.filterMode !== this.state.filterMode) {
            this.updateRanking()
        }
    }

    updateRanking() {
        const {
            api
        } = this.props

        const {
            ranking,
            loading,
            filterMode
        } = this.state

        const profileApi = api.profileApi;
        const root = profileApi.getFullName()
        const messageApi = api.messageApi;

        // infer correct timestamp 
        const lastTimestamp = messageApi.lastTimestamp
        let afterTimestamp;
        switch (filterMode) {
            case "5YEAR":
                afterTimestamp = lastTimestamp - 5 * 31557600
                break;
            case "YEAR":
                afterTimestamp = lastTimestamp - 31557600
                break;
            case "6MONTH":
                afterTimestamp = lastTimestamp - 6 * 2629800
                break;
            case "MONTH":
                afterTimestamp = lastTimestamp - 2629800
                break;
            case "WEEK":
                afterTimestamp = lastTimestamp - 604800
                break;
            default:
                afterTimestamp = false;
                break;
        }

        let timePeriod = false
        if (afterTimestamp) {
            timePeriod = [afterTimestamp, lastTimestamp]
        }

        this.setState({
            timePeriod,
            loading: true,
            content: PlaceholderFriends
        }, () => {
            setTimeout(() => {
                const newRanking = api.friendsApi.getRanking(root, messageApi, afterTimestamp)
                this.setState({
                    ranking: newRanking,
                    content: <FriendList friends={newRanking} horizontal={true}/>,
                    loading: false
                })
            }, 100)
        })
    }

    render() {
        const {
            api
        } = this.props

        const {
            ranking,
            loading,
            filterMode,
            content
        } = this.state

        return (
            <PageContainer>
                <Header as='h1'>
                    <Icon name='users' />
                    <Header.Content>
                        Friends
                    </Header.Content>
                    <Header.Subheader>Below is a list of your friends, ordered by their shared history with you.</Header.Subheader>
                </Header>
                <Menu secondary>
                    <Menu.Item>Filter to: </Menu.Item>
                    <Menu.Item
                        active={filterMode === '5YEAR'}
                        onClick={() => this.setState({ filterMode: "5YEAR" })}
                    >
                        Last 5 Years                    
                    </Menu.Item>
                    <Menu.Item
                        active={filterMode === 'YEAR'}
                        onClick={() => this.setState({ filterMode: "YEAR" })}
                    >
                        Last Year
                    </Menu.Item>
                    <Menu.Item
                        active={filterMode === '6MONTH'}
                        onClick={() => this.setState({ filterMode: "6MONTH" })}
                    >
                        Last 6 Months
                    </Menu.Item>
                    <Menu.Item
                        active={filterMode === 'MONTH'}
                        onClick={() => this.setState({ filterMode: "MONTH" })}
                    >
                        Last Month
                    </Menu.Item>
                    <Menu.Item
                        active={filterMode === 'WEEK'}
                        onClick={() => this.setState({ filterMode: "WEEK" })}
                    >
                        Last Week
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item
                            active={filterMode === 'NONE'}
                            onClick={() => this.setState({ filterMode: "NONE" })}
                        >
                            No Filter
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Segment loading={loading}>
                    {content}
                </Segment>
            </PageContainer>
        );
    }
}


function mapStateToProps(state) {
    const api = state.facebook
    return {
        api
    };
}
  
function mapDispatchToProps(dispatch) {
    return {}
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FriendsPage);
  