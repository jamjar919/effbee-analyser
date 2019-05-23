// @flow
import React, { Component } from 'react';
import vis from 'vis';

import FriendsApi from '../facebookapi/friends'
import MessagesApi from '../facebookapi/messages'

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
    rootName: string
};

export default class Home extends Component<Props> {
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
            rootName
        } = this.props

        const messageData = new MessagesApi()

        const friendNodes = new FriendsApi().get()
        .map(friend => friend.name)
        .map(name => ({
            label: name,
            id: name,
            shape: "dot"
        }))
        .map(node => {
            const chatsBetweenRoot = messageData.chatsBetween([rootName, node.label])
            return {
                ...node,
                value: chatsBetweenRoot.count
            }
        });
        friendNodes.push({ label: rootName, id: 'root', physics: false })

        const nodes = new vis.DataSet(friendNodes);

        const edgesChats = []
        for (let i = 0; i < friendNodes.length; i += 1) {
            for (let j = i + 1; j < friendNodes.length; j += 1) {
                const f1 = friendNodes[i];
                const f2 = friendNodes[j];
                const chatsBetween = messageData.chatsBetween([f1.label, f2.label])
                const numMessages = chatsBetween.count
                const numChats = chatsBetween.chats.length
                const isRoot = isConnectedToRoot({from: f1.id, to: f2.id})
                if (numChats > 0) {
                    edgesChats.push({
                        from: f1.id,
                        to: f2.id,
                        numMessages,
                        numChats,
                        value: numChats,
                        length: 300,
                        physics: !isRoot,
                        dashed: isRoot,
                    });
                }
            }
        }

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

    render() {
        return (
            <div id="network" className={styles.network} />
        );
    }
}
