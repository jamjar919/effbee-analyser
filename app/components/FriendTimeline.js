import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Tau from 'taucharts';
import '../../node_modules/taucharts/dist/plugins/tooltip';
import '../../node_modules/taucharts/dist/plugins/legend';
import moment from 'moment';
import { Form, Radio } from 'semantic-ui-react'

import styles from './css/MessageTimeline.css'

type Props = {
    messages: array
}

export default class FriendTimeline extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            chart: null,
            id: "friendTimeline"
        }
    }

    componentDidMount() {
        this.renderGraph()
    }

    componentWillUnmount() {
        const {
            chart
        } = this.state
        if (chart !== null) {
            chart.destroy();
            console.log("destroying chart...")
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
            messages,
            firstTimestamp,
            lastTimestamp,
            participants
        } = this.props

        const {
            mode,
            id
        } = this.state

        if (messages.length < 1) {
            return;
        }

        if (this.state.chart) {
            console.log("destroying chart...")
            this.state.chart.destroy();
        }

        const start = moment.unix(firstTimestamp).toDate()
        const end = moment.unix(lastTimestamp).toDate()

        const items = []
        messages.forEach(interval => {
            // count per person
            const count = {}
            participants.forEach(p => {
                items.push({
                    name: p.name,
                    count: interval.messages.filter(m => m.sender_name === p.name).length,
                    date: moment.unix((interval.start + interval.end) / 2).toDate()
                })
            })
            
        })

        const chart = new Tau.Chart({
            type: 'stacked-area',
            x: 'date',
            y: 'count',
            color: 'name',
            guide: {
                interpolate: 'smooth-keep-extremum'
            },
            data: items,
            plugins: [
                Tau.api.plugins.get('tooltip')(),
                Tau.api.plugins.get('legend')()
            ]
        })    

        this.setState({
            chart
        }, () => {
            // remove old chart
            if (document.getElementById(id)) {
                document.getElementById(id).innerHTML = "";
            }

            // render new chart
            this.state.chart.renderTo(`#${id}`);
        });
    }

    render() {
        const {
            id
        } = this.state

        return (
            <div id={id} className={styles.timeline}/>
        );
    }
}