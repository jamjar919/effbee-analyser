import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Tau from 'taucharts';
import '../../node_modules/taucharts/dist/plugins/tooltip';
import '../../node_modules/taucharts/dist/plugins/legend';
import moment from 'moment';
import { Form, Radio } from 'semantic-ui-react'

import styles from './css/MessageTimeline.css'

type Props = {
    chats: object,
    people: array
}

export default class MessageTimeline extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            mode: "PERSON",
            graph: null,
            dataset: null
        }
    }

    componentDidMount() {
        this.renderGraph()
    }

    componentWillUnmount() {
        const {
            graph
        } = this.state
        if (graph !== null) {
            graph.destroy();
            console.log("destroying graph...")
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            (prevState.mode !== this.state.mode) ||
            this.props !== prevProps
        ) {
            this.renderGraph()
        }
    }

    renderGraph() {
        const {
            chats,
            people
        } = this.props

        const {
            mode
        } = this.state

        if (this.state.chart) {
            this.state.chart.destroy();
        }

        const TimelineControlsPlugin = {
            _containerTemplate: '<div id="tauchart-timeline-controls"></div>',
            init: function (chart) {
                this._chart = chart;
                this._container = this._chart.insertToRightSidebar(this._containerTemplate);        
            },
            destroy: function () {},
            onSpecReady: function () {},
            onRender: function () {}
        }

        const items = []
        const start = moment.unix(chats.firstTimestamp).toDate()
        const end = moment.unix(chats.lastTimestamp).toDate()
        const chatNames = chats.chatNames
        let chart;

        if (mode === "PERSON") {
            chats.messagesPerInterval.forEach(interval => {
                const midpoint = moment.unix(Math.floor((interval.start + interval.end) / 2)).toDate()
                people.forEach(person => {
                    items.push({
                        date: midpoint,
                        messages: interval.count[person],
                        person
                    })
                })
            })

            chart = new Tau.Chart({
                type: 'stacked-area',
                x: 'date',
                y: 'messages',
                color: 'person',
                guide: {
                    interpolate: 'smooth-keep-extremum'
                },
                data: items,
                plugins: [
                    TimelineControlsPlugin,
                    Tau.api.plugins.get('tooltip')(),
                    Tau.api.plugins.get('legend')()
                ]
            })    
        }

        if (mode === "CHAT") {
            // force display in the order we want
            chatNames.forEach(name => {
                items.push({
                    date: start,
                    messages: 0,
                    group: name
                })
            })

            chats.messagesPerInterval.forEach(interval => {
                const midpoint = moment.unix(Math.floor((interval.start + interval.end) / 2)).toDate()
                chatNames.forEach(name => {
                    const messages = interval.messages[name].length
                    if (messages > 0) {
                        items.push({
                            date: midpoint,
                            messages,
                            group: name
                        })
                    }
                })
            })

            chart = new Tau.Chart({
                type: 'stacked-area',
                x: 'date',
                y: 'messages',
                color: 'group',
                guide: {
                    interpolate: 'smooth-keep-extremum'
                },
                data: items,
                plugins: [
                    TimelineControlsPlugin,
                    Tau.api.plugins.get('tooltip')(),
                    Tau.api.plugins.get('legend')()
                ]
            })   
        }

        this.setState({
            chart
        }, () => {
            // remove old chart
            if (document.getElementById("messageTimeline")) {
                document.getElementById("messageTimeline").innerHTML = "";
            }

            // render new chart
            this.state.chart.renderTo('#messageTimeline');

            // render in the options
            ReactDOM.render((
                    <div className="tau-chart__layout__sidebar-right__wrap">
                        <div className="tau-chart__legend__title">
                            Message Split
                        </div>
                        <Form.Group>
                            <Form.Field
                                control={Radio}
                                label='Per person'
                                value='PERSON'
                                checked={this.state.mode === 'PERSON'}
                                onChange={(e, {value}) => { this.setState({ mode: value }) }}
                            />
                            <Form.Field
                                control={Radio}
                                label='Per chat'
                                value='CHAT'
                                checked={this.state.mode === 'CHAT'}
                                onChange={(e, {value}) => { this.setState({ mode: value }) }}
                            />
                        </Form.Group>
                    </div>
                ),
                document.getElementById("tauchart-timeline-controls")
            )
        });
    }

    render() {
        return (
            <div id="messageTimeline" className={styles.timeline}/>
        );
    }
}