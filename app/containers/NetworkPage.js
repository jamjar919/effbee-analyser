// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Loader, Header, Segment, Placeholder, Dropdown, Label, Button, Form, Checkbox, Popup } from 'semantic-ui-react'
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
            numTimelineSteps: 10,
            timelineMode: "RANGE"
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
            numTimelineSteps,
            timelineMode
        } = this.state

        const {
            firstTimestamp,
            lastTimestamp
        } = messageApi

        const timelineSteps = []
        const rootName = profileApi.getFullName();
        const messages = messageApi.getMessages();
        const timeInterval = Math.ceil((lastTimestamp - firstTimestamp)/numTimelineSteps)

        for (let i = 0; i <= numTimelineSteps; i += 1) {
            console.log(firstTimestamp + (timeInterval * i), timeInterval)
            timelineSteps.push({
                time: firstTimestamp + (timeInterval * i),
                networkData: getNetworkData(
                    rootName,
                    friendsApi.get(firstTimestamp + (timeInterval * i)),
                    messages, 
                    firstTimestamp + (timeInterval * i), // before timestamp
                    (timelineMode === "RANGE") ? (firstTimestamp + (timeInterval * (i - 1))) : false // after timestamp (only apply in range mode)
                )
            })
        }

        this.setState({ timelineSteps, currentTimelineStep: 0 })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            (this.state.numTimelineSteps !== nextState.numTimelineSteps) ||
            (this.state.timelineMode !== nextState.timelineMode)
        ) {
            setTimeout(() => {
                this.computeTimelineSteps()
            }, 100)
        }
        return true;
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
            timelineSteps,
            numTimelineSteps,
            timelineMode
        } = this.state;

        const {
            firstTimestamp,
            lastTimestamp
        } = api.messageApi

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
        const timePeriodDuration = Math.ceil((lastTimestamp - firstTimestamp)/numTimelineSteps);

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
                        <Menu.Item onClick={() => { this.setState({ enableTimeline: !enableTimeline }) }} active={enableTimeline}>
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
                            <div className={styles.timelineStepsContainer}>
                                <Header as='h2'>
                                    <Icon name='clock' />
                                    <Header.Content>Network Timeline</Header.Content>
                                    <Header.Subheader>Select a time period to filter the network to that period</Header.Subheader>
                                </Header>
                                <Menu fluid vertical borderless className={styles.timelineStepsMenu}>
                                    { timelineSteps.map((step, i) => (
                                        <Menu.Item
                                            active={i === currentTimelineStep}
                                            key={uuid()}
                                            onClick={() => { this.setState({ currentTimelineStep: i }) }}
                                            className={styles.timelineStepItem}
                                        >
                                            <div className={styles.timelineStepText}>
                                                { timelineMode === "INCLUSIVE" ?
                                                    `Before ${moment.unix(step.time).format("MMMM Do YYYY")}` : ''
                                                }
                                                { timelineMode === "RANGE" ?
                                                    `${moment.unix(step.time - timePeriodDuration).format("MMMM Do YYYY")} - ${moment.unix(step.time).format("MMMM Do YYYY")}` : ''
                                                }
                                            </div>
                                            <Label.Group size="small" className={styles.timelineStepLabels}>
                                                <Label color="red">{timelineSteps[i].networkData.nodes.length} Friends</Label>
                                                <Label color="blue">{timelineSteps[i].networkData.edges.length} Connections</Label>
                                            </Label.Group>
                                        </Menu.Item>
                                    )) }
                                </Menu>
                                <Segment textAlign="center">
                                    <Header as='h3'>
                                        <Header.Content>
                                            Current Time Period Size: {moment.duration(timePeriodDuration, "seconds").humanize()}
                                        </Header.Content>
                                    </Header>
                                    <Button.Group>
                                        <Button secondary onClick={() => {
                                            this.setState({ numTimelineSteps: Math.max(5, numTimelineSteps - 5) })
                                        }}>Less Periods</Button>
                                        <Button.Or text={numTimelineSteps} />
                                        <Button primary onClick={() => {
                                            this.setState({ numTimelineSteps: numTimelineSteps + 5 })
                                        }}>More Periods</Button>
                                    </Button.Group>
                                </Segment>
                                <Segment>
                                    <Form>
                                        <Form.Field>
                                            Change network timeline rendering mode:
                                        </Form.Field>
                                        <Form.Field>
                                            <Form.Field>
                                                <Popup content="Range mode renders only connections between the start of the period and the end of the period" trigger={<Checkbox
                                                    radio
                                                    label="Range Mode"
                                                    checked={timelineMode === 'RANGE'}
                                                    value="RANGE"
                                                    name="networkTimelineTypeControl"
                                                    onChange={(e, { value }) => { this.setState({ timelineMode: value }) }}
                                                />} position="left center" />
                                            </Form.Field>
                                            <Popup content="Inclusive mode renders all connections made before the end of the period" trigger={<Checkbox
                                                radio
                                                label="Inclusive Mode"
                                                checked={timelineMode === 'INCLUSIVE'}
                                                value="INCLUSIVE"
                                                name="networkTimelineTypeControl"
                                                onChange={(e, { value }) => { this.setState({ timelineMode: value }) }}
                                            />} position="left center" />
                                        </Form.Field>
                                    </Form>
                                </Segment>
                            </div>
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
