// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Loader, Header, Segment, Placeholder, Dropdown, Label } from 'semantic-ui-react'
import { bindActionCreators } from 'redux';
import uuid from 'uuid/v4';
import moment from 'moment';

import { getNetworkData } from '../facebookapi/network';
import Network from '../components/Network';
import FriendPreview from '../components/FriendPreview';
import RightPanel from './RightPanel';
import PageContainer from './PageContainer';

import * as NetworkActions from '../actions/network';
import * as SelectionActions from '../actions/selection';
import type { defaultFacebookType } from '../reducers/defaultTypes'

import styles from './css/NetworkPage.css';

type Props = {
    toggleShowRoot: () => void,
    selectFriend: (string) => void,
    saveNetworkData: (object) => void,
    nextNetworkEdgeOption: () => void,
    fitGroups: () => void,
    colors: array,
    showRoot: boolean,
    networkData: object,
    api: defaultFacebookType,
    edgeType: string
};

class NetworkPage extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            enableTimeline: false,
            currentTimelineStep: 0,
            timelineSteps: [],
            numTimelineSteps: 10
        }
    }

    computeTimelineSteps() {
        const {
            api
        } = this.props

        const {
            profileApi,
            messageApi,
            friendsApi
        } = api

        const {
            numTimelineSteps
        } = this.state

        const {
            firstTimestamp,
            lastTimestamp
        } = messageApi

        const timelineSteps = []
        const rootName = profileApi.getFullName();
        const friends = friendsApi.get();
        const messages = messageApi.getMessages();
        const timeInterval = Math.ceil((lastTimestamp - firstTimestamp)/numTimelineSteps)

        for (let i = 0; i <= numTimelineSteps; i += 1) {
            console.log(firstTimestamp + (timeInterval * i), timeInterval)
            timelineSteps.push({
                time: firstTimestamp + (timeInterval * i),
                networkData: getNetworkData(rootName, friends, messages, firstTimestamp + (timeInterval * i))
            })
        }

        this.setState({ timelineSteps, currentTimelineStep: 0 })
    }

    render() {
        const {
            api,
            networkData,
            saveNetworkData,
            nextNetworkEdgeOption,
            toggleShowRoot,
            showRoot,
            edgeType,
            fitGroups,
            groups
        } = this.props

        const {
            enableTimeline,
            currentTimelineStep,
            timelineSteps
        } = this.state;

        const rootName = api.profileApi.getFullName();

        /** compute network data if we don't have it */
        if (!networkData) {
            setTimeout(() => {
                saveNetworkData(api)
            }, 100)
            return (
                <PageContainer>
                    <Segment padded="very">
                        <Loader active indeterminate size="large">
                            Loading! Depending on the number of friends you have, this might take a while. You'll only have to do this once.
                        </Loader>
                        <Placeholder>
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder>
                    </Segment>
                </PageContainer>
            );
        }

        /* compute timeline data if it's enabled */
        if (enableTimeline && timelineSteps.length === 0) {
            setTimeout(() => {
                this.computeTimelineSteps()
            }, 100)
        }

        let nodesToShow = networkData.nodes
        let edgesToShow = networkData.edges
        if (enableTimeline && timelineSteps.length > 0) {
            nodesToShow = timelineSteps[currentTimelineStep].networkData.nodes
            edgesToShow = timelineSteps[currentTimelineStep].networkData.edges
        }

        return (
            <div className={styles.container}>
                <Menu className={styles.menuContainer}>
                    <Menu.Item>
                        <Header as='h3'>
                            <Icon name='sitemap' /> 
                            <Header.Content>
                                Network
                            </Header.Content>
                        </Header>
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item onClick={() => { this.setState({ enableTimeline: !enableTimeline }) }}>
                            Network Timeline
                        </Menu.Item>
                        <Menu.Item onClick={() => { fitGroups(api) }}>
                            Group
                        </Menu.Item>
                        <Dropdown item text='Advanced' className={styles.dropdownMenu}>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => toggleShowRoot()} className={styles.dropdownItem}>
                                    Show/Hide Root 
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => { nextNetworkEdgeOption() }} className={styles.dropdownItem}>        
                                    <Label>
                                        { edgeType }
                                    </Label>
                                    Edge Rendering Mode
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                </Menu>
                <Network
                    rootName={rootName}
                    showRoot={this.props.showRoot}
                    selectFriend={(name) => this.props.selectFriend(name)}
                    nodes={nodesToShow}
                    edges={edgesToShow}
                    groups={groups}
                    edgeType={edgeType}
                />
                <RightPanel>
                    { enableTimeline ? (
                            <Menu pointing secondary vertical>
                                { timelineSteps.map((step, i) => (
                                    <Menu.Item
                                        active={i === currentTimelineStep}
                                        key={uuid()}
                                        onClick={() => { this.setState({ currentTimelineStep: i }) }}
                                    >
                                        {moment.unix(step.time).format("MMMM Do YYYY")}
                                    </Menu.Item>
                                )) }
                            </Menu>
                    ) : <FriendPreview /> }
                </RightPanel>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        showRoot: state.network.showRoot,
        networkData: state.network.networkData,
        edgeType: state.network.edgeType,
        groups: state.network.groups,
        api: state.facebook
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectFriend: SelectionActions.selectFriendAction(dispatch),
        toggleShowRoot: NetworkActions.toggleShowRootAction(dispatch),
        saveNetworkData: NetworkActions.saveNetworkDataAction(dispatch),
        nextNetworkEdgeOption: NetworkActions.nextNetworkEdgeOptionAction(dispatch),
        fitGroups: NetworkActions.fitGroupsAction(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NetworkPage);
