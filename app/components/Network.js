// @flow
import React, { Component } from 'react';
import vis from 'vis';
import FriendsApi from '../facebookapi/friends'
import MessagesApi from '../facebookapi/messages'

import styles from './css/Network.css'

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

    constructor(props) {
        super(props)
        this.state = {
            network: false
        }
    }

    componentDidMount() {
        const friendNodes = new FriendsApi()
            .get()
            .map(friend => friend.name)
            .map(name => ({
                label: name,
                id: name
            }));
        const nodes = new vis.DataSet(friendNodes);
        const messageData = new MessagesApi()

        const edgesChats = []
        for (let i = 0; i < friendNodes.length; i += 1) {
            for (let j = i + 1; j < friendNodes.length; j += 1) {
                const f1 = friendNodes[i];
                const f2 = friendNodes[j];
                const numChats = messageData.chatsBetween([f1.label, f2.label]).chats.length
                if (numChats > 0) {
                    edgesChats.push({
                        from: f1.label,
                        to: f2.label,
                        value: numChats
                    });
                }
            }
        }

        console.log(edgesChats)

        const edges = new vis.DataSet(edgesChats)

        const container = document.getElementById('network');
        const data = {
            nodes,
            edges
        };
        const options = {
            physics: {
                stabilization:false,
                repulsion: {
                    nodeDistance: 1
                }
            }
        }

        var clusterIndex = 0;
        var clusters = [];
        var lastClusterZoomLevel = 0;
        var clusterFactor = 0.5;        

        this.setState({network: new vis.Network(container, data, options)}, () => {
            const makeClusters = (scale) => {
                var clusterOptionsByData = {
                    processProperties: (clusterOptions, childNodes) => {
                        clusterIndex = clusterIndex + 1;
                        var childrenCount = 0;
                        for (var i = 0; i < childNodes.length; i++) {
                            childrenCount += childNodes[i].childrenCount || 1;
                        }
                        clusterOptions.childrenCount = childrenCount;
                        clusterOptions.label = "# " + childrenCount + "";
                        clusterOptions.font = {size: childrenCount*5+30}
                        clusterOptions.id = 'cluster:' + clusterIndex;
                        clusters.push({id:'cluster:' + clusterIndex, scale:scale});
                        return clusterOptions;
                    },
                    clusterNodeProperties: {borderWidth: 3, shape: 'database', font: {size: 30}}
                }
                this.state.network.clusterOutliers(clusterOptionsByData);
            }
        
            const openClusters = (scale) => {
                var newClusters = [];
                var declustered = false;
                for (var i = 0; i < clusters.length; i++) {
                    if (clusters[i].scale < scale) {
                        this.state.network.openCluster(clusters[i].id);
                        lastClusterZoomLevel = scale;
                        declustered = true;
                    }
                    else {
                        newClusters.push(clusters[i])
                    }
                }
                clusters = newClusters;
            }

            
            this.state.network.once('initRedraw', () => {
                if (lastClusterZoomLevel === 0) {
                    lastClusterZoomLevel = this.state.network.getScale();
                }
            });
        
            // we use the zoom event for our clustering
            this.state.network.on('zoom', function (params) {
                if (params.direction == '-') {
                    if (params.scale < lastClusterZoomLevel*clusterFactor) {
                        makeClusters(params.scale);
                        lastClusterZoomLevel = params.scale;
                    }
                }
                else {
                    openClusters(params.scale);
                }
            });
        
            // if we click on a node, we want to open it up!
            this.state.network.on("selectNode", function (params) {
                if (params.nodes.length == 1) {
                    if (this.state.network.isCluster(params.nodes[0]) == true) {
                        this.state.network.openCluster(params.nodes[0])
                    }
                }
            });
        
        })
    }

    componentWillUnmount() {
        this.state.network.destroy();
        console.log("destroying network...")
    }

    render() {
        return (
        <div id="network" className={styles.network}></div>
        );
    }
}
