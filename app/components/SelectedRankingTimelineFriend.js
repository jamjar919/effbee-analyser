import React, { Component } from 'react';
import Tau from 'taucharts';
import '../../node_modules/taucharts/dist/plugins/tooltip';
import '../../node_modules/taucharts/dist/plugins/legend';
import moment from 'moment';

type Props = {
    ranking: object,
    friend: string,
    numPeople: number
}

export default class SelectedRankingTimelineFriend extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            chart: null
        }
    }

    renderChart() {
        const {
            ranking,
            friend,
            numPeople
        } = this.props

        const {
            chart
        } = this.state

        if (chart) {
            chart.destroy()
        }

        const minMaxTime = ranking.reduce((current, interval) => {
            let start = current.start;
            let end = current.end;
            if (interval.start < current.start) {
                start = interval.start
            }
            if (interval.end > current.end) {
                end = interval.end
            }
            return {
                start,
                end
            }
        }, {
            start: moment().unix(),
            end: 0
        })

        console.log(minMaxTime)

        const {
            start,
            end
        } = minMaxTime

        // construct detailed rank history
        const rankingPerInterval = ranking.map(interval => ({
                date: new Date(((interval.start * 1000) + (interval.end * 1000))/2),
                ...interval.ranking.map((value, index) => ({
                    ...value,
                    ranking: index
                })).find(v => v.name === friend)
            })
        ).filter(i => i.name != null)
        
        this.setState({ 
            chart: new Tau.Chart({
                type: 'line',
                x: 'date',
                y: 'ranking',
                color: 'group',
                size: 'count',
                guide: {
                    interpolate: 'smooth-keep-extremum',
                    x: {
                        min: new Date(start * 1000),
                        max: new Date(end * 1000)
                    }
                },
                data: rankingPerInterval,
                plugins: [
                    Tau.api.plugins.get('tooltip')()
                ]
            })
        }, () => {
            this.state.chart.renderTo("#rankingChart")
        })
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
        return (
            <div id="rankingChart"></div>
        )
    }
}