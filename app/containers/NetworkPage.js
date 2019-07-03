// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Loader, Header, Segment, Placeholder } from 'semantic-ui-react'
import { bindActionCreators } from 'redux';

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
    fitColors: () => void,
    colors: array,
    showRoot: boolean,
    networkData: object,
    api: defaultFacebookType,
    edgeType: string
};

class NetworkPage extends Component<Props> {
    props: Props;

    render() {
        const {
            api,
            networkData,
            saveNetworkData,
            nextNetworkEdgeOption,
            toggleShowRoot,
            edgeType,
            fitColors,
            colors
        } = this.props

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
                        <Menu.Item onClick={() => toggleShowRoot()}>
                            Show/Hide Root
                        </Menu.Item>
                        <Menu.Item onClick={() => { nextNetworkEdgeOption() }}>
                            Next Edge Type
                        </Menu.Item>
                        <Menu.Item onClick={() => { fitColors(api) }}>
                            Fit Colors
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Network
                    rootName={rootName}
                    showRoot={this.props.showRoot}
                    selectFriend={(name) => this.props.selectFriend(name)}
                    nodes={networkData.nodes}
                    edges={networkData.edges}
                    colors={colors}
                    edgeType={edgeType}
                />
                <RightPanel>
                    <FriendPreview />
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
        colors: state.network.colors,
        api: state.facebook
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectFriend: SelectionActions.selectFriendAction(dispatch),
        toggleShowRoot: NetworkActions.toggleShowRootAction(dispatch),
        saveNetworkData: NetworkActions.saveNetworkDataAction(dispatch),
        nextNetworkEdgeOption: NetworkActions.nextNetworkEdgeOptionAction(dispatch),
        fitColors: NetworkActions.fitColorsAction(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NetworkPage);
