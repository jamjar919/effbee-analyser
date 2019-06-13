import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Identicon from './Identicon';

type Props = {
    rankingPerInterval: array,
    circleSize: number,
    numPeople: number
}; 

const TimelineCircleColumn = props => {
    const {
        people // [ {name: "whatever", count: 123 }, ... ] ...
    } = props;

    return (
        <g>Hello</g>
    )
}

export default class FriendRankingTimeline extends Component<Props> {
    static defaultProps = {
        rankingPerInterval: [],
        circleSize: 50,
        numPeople: 5
    }

    render() {
        const {
            rankingPerInterval,
            circleSize,
            numPeople
        } = this.props;
        

        // trim arrays to top n people
        
        const ranking = rankingPerInterval.map(interval => ({
                ...interval,
                ranking: interval.ranking.filter((v, i) => i < numPeople)
            })
        )

        console.log(ranking)

        return (
            <svg><circle cx="80" cy="23.75" r="5" stroke="gray" stroke-width="3" fill="gray"></circle></svg>
        );
    }
}
