import React, { Component } from 'react';
import uuid from 'uuid/v4';
import c3 from 'c3'

type Props = {
    friend: string,
    ranking: array,
    totalIntervals: number
}

export default class SelectedRankingTimelineFriend extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            id: "rankingBreakdownPie",
            chart: null
        }
    }

    renderChart() {
        const {
            friend,
            ranking,
            totalIntervals
        } = this.props

        const {
            id
        } = this.state

        let columns = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            "6 - 10": 0,
            "11 - 20": 0,
            "21 - 50": 0,
            "51 - 100": 0,
            "100 +": 0
        }
        ranking.forEach(interval => {
            // prepare for if statements
            const rank = interval.ranking
            if (rank < 6) {
                columns[rank] += 1
            } else if (rank < 11) {
                columns["6 - 10"] += 1
            } else if (rank < 21) {
                columns["11 - 20"] += 1
            } else if (rank < 50) {
                columns["21 - 50"] += 1
            } else if (rank < 100) {
                columns["51 - 100"] += 1
            } else {
                columns["100+"] += 1
            }
        });
        columns = Object.keys(columns).map(key => (
            [key, columns[key]]
        ))

        const chart = c3.generate({
            bindto: '#' + id,
            data: {
                columns,
                type : 'pie',
                order: (d1, d2) => {
                    if (parseInt(d1.id) > parseInt(d2.id)) {
                        return true
                    }
                    return false
                },
                colors: {
                    "1": "2246e0",
                    "2": "#2271e0",
                    "3": "#2180cb",
                    "4": "#2190b6",
                    "5": "#21a0a1",
                    "6 - 10": "#21b08c",
                    "11 - 20": "#127d2b",
                    "21 - 50": "#0d591f",
                    "51 - 100": "#083612",
                    "100+": "#031206"
                }
            },
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