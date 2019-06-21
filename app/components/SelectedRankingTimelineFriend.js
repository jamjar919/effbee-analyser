import React, { Component } from 'react';
import Tau from 'taucharts';
import '../../node_modules/taucharts/dist/plugins/tooltip';
import '../../node_modules/taucharts/dist/plugins/legend';
import moment from 'moment';
import { Statistic, Grid } from 'semantic-ui-react'

import RankingBreakdownPie from './RankingBreakdownPie'

type Props = {
    ranking: object,
    friend: string,
    numPeople: number,
    selectFriend: (string) => void 
}

export default class SelectedRankingTimelineFriend extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            chart: null
        }
    }

    getRankDetails() {
        const {
            ranking,
            friend
        } = this.props
        // construct detailed rank history
        return ranking.map(interval => ({
                date: new Date(((interval.start * 1000) + (interval.end * 1000))/2),
                ...interval.ranking.map((value, index) => ({
                    ...value,
                    ranking: index + 1
                })).find(v => v.name === friend)
            })
        ).filter(i => i.name != null)
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
            if (document.getElementById("rankingChart")) {
                document.getElementById("rankingChart").innerHTML = "";
            }
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

        const rankingPerInterval = this.getRankDetails();

        const {
            start,
            end
        } = minMaxTime
        
        if (rankingPerInterval.length > 0) {
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
                            max: new Date(end * 1000),
                            nice: false
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
            friend,
            ranking
        } = this.props

        const rankDetails = this.getRankDetails();

        const topRank = rankDetails.reduce((currentMax, interval) => {
            if (typeof currentMax == "undefined" || interval.ranking < currentMax.ranking) {
                return interval
            }
            return currentMax
        }, undefined)

        const rankings = rankDetails.map(r => r.ranking)
        rankings.sort(function(a, b) {
            return a - b;
        });
        var mid = rankings.length / 2;
        const medianRank = mid % 1 ? rankings[mid - 0.5] : (rankings[mid - 1] + rankings[mid]) / 2;          
            
        return (
            <div>
                <Grid>
                    <Grid.Column width={12}>
                        <div id="rankingChart"></div>
                        <Statistic.Group widths='two'>
                            <div className="ui large statistic">
                                <div className="label">Top Rank</div>
                                <div className="value">{topRank.ranking}</div>
                                <div className="label">
                                    at {moment(topRank.date).format("MMMM Do YYYY")} 
                                </div>
                            </div>
                            <div className="ui large statistic">
                                <div className="label">Median Rank</div>
                                <div className="value">{medianRank}</div>
                            </div>
                        </Statistic.Group>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <RankingBreakdownPie
                            ranking={rankDetails}
                            friend={friend}
                            totalIntervals={ranking.length}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}