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

const timelineStepDurations = [
    { name: "Week", amount: 604800, index: 0 },
    { name: "Month", amount: 2629800, index: 1 },
    { name: "6 Months", amount: 2629800 * 6, index: 2 },
    { name: "Year", amount: 31557600, index: 3 },
    { name: "2 Years", amount: 31557600 * 2, index: 4 },
    { name: "5 Years", amount: 31557600 * 5, index: 5 }
]

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

const DEFAULT_TIMELINE_ANIMATION_STEP_TIME = 1000

class NetworkPage extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            enableTimeline: false,
            currentTimelineStep: 0,
            timelineSteps: [],
            timelineStepDuration: timelineStepDurations[3],
            timelineMode: "RANGE",
            timelineAnimation: {
                enabled: false,
                intervalId: -1
            }
        }
    }

    animateTimelineStep() {
        const {
            currentTimelineStep,
            timelineSteps
        } = this.state;
        const nextStep = currentTimelineStep + 1
        if (nextStep < timelineSteps.length) {
            this.setState({ currentTimelineStep: nextStep })
        } else {
            this.stopTimelineAnimation()
        }
    }

    stopTimelineAnimation() {
        const intervalId = this.state.timelineAnimation.intervalId
        clearInterval(intervalId)
        this.setState({
            timelineAnimation: {
                intervalId,
                enabled: false 
            }
        })
    }

    startTimelineAnimation() {
        this.setState({
            timelineAnimation: {
                enabled: true,
                intervalId: setInterval(() => {
                    this.animateTimelineStep()
                }, DEFAULT_TIMELINE_ANIMATION_STEP_TIME)
            }
        })
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
            timelineStepDuration,
            timelineMode
        } = this.state

        const {
            firstTimestamp,
            lastTimestamp
        } = messageApi

        const timelineSteps = []
        const rootName = profileApi.getFullName();
        const messages = messageApi.getMessages();
        const timeInterval = timelineStepDuration.amount

        let i = 0;
        while (firstTimestamp + (timeInterval * (i - 1)) < lastTimestamp) {
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
            i += 1;
        }

        this.setState({ timelineSteps, currentTimelineStep: 0 })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            (this.state.timelineStepDuration.amount !== nextState.timelineStepDuration.amount) ||
            (this.state.timelineMode !== nextState.timelineMode)
        ) {
            setTimeout(() => {
                this.computeTimelineSteps()
            }, 100)
        }
        return true;
    }

    componentWillUnmount() {
        clearInterval(this.timelineAnimation.intervalId)
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
            timelineStepDuration,
            timelineMode,
            timelineAnimation
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
                                <Button.Group fluid>
                                    <Button icon='play' disabled={timelineAnimation.enabled} onClick={() => {
                                        this.startTimelineAnimation()
                                    }} color='green' />
                                    <Button icon='stop' disabled={!timelineAnimation.enabled} onClick={() => {
                                        this.stopTimelineAnimation()
                                    }} color='red' />
                                </Button.Group>
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
                                                    `${moment.unix(step.time - timelineStepDuration.amount).format("MMMM Do YYYY")} - ${moment.unix(step.time).format("MMMM Do YYYY")}` : ''
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
                                            Current Time Period Size: {timelineStepDuration.name}
                                        </Header.Content>
                                        <Header.Subheader>
                                            Warning - Making the period too small will require a lot of rendering/computation time.
                                        </Header.Subheader>
                                    </Header>
                                    <Button.Group>
                                        <Button secondary onClick={() => {
                                            this.setState({
                                                timelineStepDuration: (timelineStepDuration.index - 1 > -1) ? 
                                                    timelineStepDurations[timelineStepDuration.index - 1] : timelineStepDuration })
                                        }} disabled={(timelineStepDuration.index - 1 < 0)}>Smaller Period</Button>
                                        <Button primary onClick={() => {
                                            this.setState({
                                                timelineStepDuration: (timelineStepDuration.index + 1 < timelineStepDurations.length) ? 
                                                    timelineStepDurations[timelineStepDuration.index + 1] : timelineStepDuration })
                                        }} disabled={(timelineStepDuration.index + 1 > timelineStepDurations.length - 1)}>Bigger Period</Button>
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
