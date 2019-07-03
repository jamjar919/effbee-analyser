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
    return edges.filter(edge => edge.from === nodeId || edge.to === nodeId)
}

function isConnectedToRoot(edge) {
    return (edge.from === 'root') || (edge.to === 'root')
}

type Props = {
    selectFriend: (string) => void,
    showRoot: boolean,
    rootName: string,
    nodes: array,
    edges: array,
    groups: array,
    edgeType: string
};

export default class Network extends Component<Props> {
    props: Props;

    static defaultProps = {
        edgeType: 'continuous'
    }

    constructor(props) {
        super(props)
        this.state = {
            networkNodes: false,
            networkEdges: false,
            network: false,
            networkGroups: {}
        }
    }

    componentDidMount() {
        this.renderGraph()
    }

    shouldComponentUpdate(nextProps) {
        const {
            showRoot,
            rootName,
            edgeType,
            groups
        } = this.props

        const {
            network,
            networkNodes,
            networkEdges
        } = this.state

        if (showRoot !== nextProps.showRoot) {            
            if (nextProps.showRoot) {
                // add root to graph
                networkNodes.add({ label: rootName, id: 'root', physics: false })
            } else {
                // remove node from graph
                networkNodes.remove({ id: 'root' })
                
                // reenable physics on edges
                const edgesToUpdate = networkEdges.get()
                    .filter(edge => !isConnectedToRoot(edge))
                    .map(edge => ({ id: edge.id, physics: true }))

                networkEdges.update(edgesToUpdate)
            }
        }

        if (edgeType !== nextProps.edgeType) {
            network.setOptions({ edges: { smooth: { type: nextProps.edgeType } } })
        }

        if (groups !== nextProps.groups) {
            
            const nodesToUpdate = networkNodes.get().map(node => ({
                ...node,
                group: nextProps.groups[node.id]
            }))
            networkNodes.update(nodesToUpdate)

            const maxGroup = Object.keys(nextProps.groups).reduce((max, current) => {
                if (nextProps.groups[current] > max) {
                    return nextProps.groups[current];
                }
                return max
            }, 0)
            // construct group colors
            const groups = {}
            for (let i = 0; i <= maxGroup; i += 1) {
                const color = `#${(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)}`
                groups[i] = {
                    color: {
                        border: color,
                        background: color,
                        highlight: {
                            border: "#000000",
                            background: color,
                        }
                    }
                }
            }
            network.setOptions({ groups })

            const edgesToUpdate = networkEdges.get().map(edge => ({
                ...edge,
                length: (nextProps.groups[edge.to] === nextProps.groups[edge.from]) ? 300 : 500
            }))
            networkEdges.update(edgesToUpdate)

            this.setState({ networkGroups: groups })
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
            nodes,
            edges,
            edgeType
        } = this.props

        const networkNodes = new vis.DataSet(nodes);
        const networkEdges = new vis.DataSet(edges)

        const container = document.getElementById('network');
        const data = {
            nodes: networkNodes,
            edges: networkEdges
        };
        const options = {
            edges: {
                smooth: {
                    type: edgeType
                },
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
            },
            nodes: {
                font: {
                    // color: '#B8B8B8',
                }
            }
        }
        this.setState({
            networkNodes,
            networkEdges,
            network: new vis.Network(container, data, options)
        }, () => {
            // Bind any events relying on network here
            const {
                networkNodes,
                networkEdges,    
                network
            } = this.state
            
            // Respond to changestate
            if (!showRoot) {
                networkNodes.remove({ id: 'root' })
            }


            // Events on selectnode, deselectnode for more in-depth graph inspection
            network.on("selectNode", params => {
                // batching node/edge updates provides a massive performance gain
                const edgesToUpdate = []
                const nodesToUpdate = []

                const nodeId = params.nodes[0]
                // update redux state
                this.props.selectFriend(nodeId)
                const neighbours = getNeighbours(nodeId, params.edges.map(id => networkEdges.get(id)));

                neighbours.forEach(id => {
                    getEdges(id, networkEdges.get()).forEach(edge => {
                        edgesToUpdate.push({
                            id: edge.id,
                            physics: false
                        })
                    })
                })
                nodesToUpdate.push({
                    id: nodeId,
                    fixed: true,
                    mass: 5
                })

                params.edges.forEach(id => {
                    const edge = networkEdges.get(id);
                    edgesToUpdate.push({
                        id,
                        label: `${edge.numMessages}/${edge.numChats}`,
                        physics: (true && !isConnectedToRoot(edge))
                    })
                })

                networkEdges.update(edgesToUpdate)
                networkNodes.update(nodesToUpdate)
            });

            network.on("deselectNode", params => {
                this.props.selectFriend(false)
                const edgesToUpdate = []
                const nodesToUpdate = []

                const nodeId = params.previousSelection.nodes[0]
                const neighbours = getNeighbours(nodeId, params.previousSelection.edges.map(id => networkEdges.get(id)));

                neighbours.forEach(id => {
                    getEdges(id, networkEdges.get()).forEach(edge => {
                        edgesToUpdate.push({
                            id: edge.id,
                            physics: !isConnectedToRoot(edge)
                        })
                    })
                })

                nodesToUpdate.push({
                    id: nodeId,
                    fixed: false,
                    mass: 1
                })

                params.previousSelection.edges.forEach(id => {
                    edgesToUpdate.push({
                        id,
                        label: false,
                    })
                })

                networkEdges.update(edgesToUpdate)
                networkNodes.update(nodesToUpdate)
            });
        })
    }

    render() {
        return (
            <div id="network" className={styles.network} />
        );
    }
}
