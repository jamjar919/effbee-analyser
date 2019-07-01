import React, { Component } from 'react';
import uuid from 'uuid/v4';
import c3 from 'c3'

type Props = {
    friends: array
}

export default class SelectedRankingTimelineFriend extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            id: "friendBreakdownPie",
            chart: null
        }
    }

    renderChart() {
        const {
            friends
        } = this.props

        const {
            id
        } = this.state

        const columns = friends.filter(f => f.count > 0).map(f => [f.name, f.count]);

        const chart = c3.generate({
            bindto: '#' + id,
            data: {
                columns,
                type : 'pie',
            },
            legend: {
                show: (columns.length < 15)
            }
        });

        this.setState({ chart })
    }

    componentDidMount() {
        this.renderChart()
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps.friend !== this.props.friend) {
            this.renderChart()
        }
    }

    render() {
        const {
            id,
            chart
        } = this.state;

        return (
            <div id={id} />
        )
    }
}