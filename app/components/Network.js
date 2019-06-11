// @flow
import React, { Component } from 'react';
import vis from 'vis';

import type { defaultFacebookType } from '../reducers/defaultTypes'

import styles from './css/Network.css'


function getNeighbours(nodeId, edges) {
    return edges.map(edge => {
        if (edge.to === nodeId) { return edge.from }
        if (edge.from === nodeId) { return edge.to }
        return false;
    })
    .filter(node => (node !== false))
}

function getEdges(nodeId, edges) {
    return edges.filter(edge => edge.from === nodeId || edge.to === nodeId);
}

function isConnectedToRoot(edge) {
    return (edge.from === 'root') || (edge.to === 'root')
}

type Props = {
    selectFriend: (string) => void,
    showRoot: boolean,
    rootName: string,
    api: defaultFacebookType
};

export default class Network extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            network: false,
            nodes: false,
            edges: false
        }
    }

    componentDidMount() {
        this.renderGraph()
    }

    shouldComponentUpdate(nextProps) {
        const {
            showRoot,
            rootName
        } = this.props

        if (showRoot !== nextProps.showRoot) {
            const {
                nodes,
                edges
            } = this.state
            
            if (nextProps.showRoot) {
                // add root to graph
                nodes.add({ label: rootName, id: 'root', physics: false })
            } else {
                // remove node from graph
                nodes.remove({ id: 'root' })
                
                // reenable physics on edges
                const edgesToUpdate = edges
                    .get()
                    .filter(edge => !isConnectedToRoot(edge))
                    .map(edge => ({ id: edge.id, physics: true }))

                edges.update(edgesToUpdate)
            }
        }
        return false;
    }
    
    componentWillUnmount() {
        const {
            network
        } = this.state
        network.destroy();
        console.log("destroying network...")
    }
    
    renderGraph() {
        const {
            showRoot,
            rootName,
            api
        } = this.props

        // delegate to web worker for performance
        const worker = new Worker("./workers/NetworkWorker.js")
        worker.onmessage = (e) => {
            const {
                friendNodes,
                edgesChats
            } = e.data
            const nodes = new vis.DataSet(friendNodes);
            const edges = new vis.DataSet(edgesChats)

            const container = document.getElementById('network');
            const data = {
                nodes,
                edges
            };
            const options = {
                edges: {
                    smooth: false,
                    color: {
                        color: '#848484',
                        highlight: '#FF0000'
                    }
                },
                physics: {
                    stabilization: false,
                    barnesHut: {
                        gravitationalConstant: -10000
                    }
                },
                layout: {
                    improvedLayout: false
                }
            }
            this.setState({
                nodes,
                edges,
                network: new vis.Network(container, data, options)
            }, () => {
                // Bind any events relying on network here
                const {
                    nodes,
                    edges,    
                    network
                } = this.state
                
                // Respond to changestate
                if (!showRoot) {
                    nodes.remove({ id: 'root' })
                }


                // Events on selectnode, deselectnode for more in-depth graph inspection
                network.on("selectNode", params => {
                    // batching node/edge updates provides a massive performance gain
                    const edgesToUpdate = []
                    const nodesToUpdate = []

                    const nodeId = params.nodes[0]
                    // update redux state
                    this.props.selectFriend(nodeId)
                    const neighbours = getNeighbours(nodeId, params.edges.map(id => edges.get(id)));

                    neighbours.forEach(id => {
                        getEdges(id, edges.get()).forEach(edge => {
                            edgesToUpdate.push({
                                id: edge.id,
                                physics: false
                            })
                        })
                    })
                    nodesToUpdate.push({
                        id: nodeId,
                        mass: 5
                    })

                    params.edges.forEach(id => {
                        const edge = edges.get(id);
                        edgesToUpdate.push({
                            id,
                            label: `${edge.numMessages}/${edge.numChats}`,
                            physics: (true && !isConnectedToRoot(edge))
                        })
                    })

                    edges.update(edgesToUpdate)
                    nodes.update(nodesToUpdate)
                });

                network.on("deselectNode", params => {
                    this.props.selectFriend(false)
                    const edgesToUpdate = []
                    const nodesToUpdate = []

                    const nodeId = params.previousSelection.nodes[0]
                    const neighbours = getNeighbours(nodeId, params.previousSelection.edges.map(id => edges.get(id)));

                    neighbours.forEach(id => {
                        getEdges(id, edges.get()).forEach(edge => {
                            edgesToUpdate.push({
                                id: edge.id,
                                physics: !isConnectedToRoot(edge)
                            })
                        })
                    })

                    nodesToUpdate.push({
                        id: nodeId,
                        mass: 1
                    })

                    params.previousSelection.edges.forEach(id => {
                        edgesToUpdate.push({
                            id,
                            label: false,
                        })
                    })

                    edges.update(edgesToUpdate)
                    nodes.update(nodesToUpdate)
                });
            })
        }
        worker.postMessage(api)
    }

    render() {
        return (
            <div id="network" className={styles.network} />
        );
    }
}
