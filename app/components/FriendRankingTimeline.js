import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getIdenticonSvg } from './Identicon';

type Props = {
    rankingPerInterval: array,
    circleSize: number,
    numPeople: number
}; 

const TimelineCircleColumn = props => {
    const {
        people, // [ {name: "whatever", count: 123 }, ... ] ...
        circleSize,
        rowNumber
    } = props;

    const contents = []
    people.forEach((person, i) => {
        const transformation = `translate(0, ${(circleSize * i)})`;
        const data = person.name
        if (
            (person.previousRank === -1) 
         ) {
            contents.push(
                <g
                    dangerouslySetInnerHTML={{ __html: person.svg }}
                    key={i}
                    transform={transformation}
                    data={data} 
                />
            )
        } else {
            contents.push(
                <g>
                    <circle cx={circleSize/2} cy={circleSize/2} r="5" stroke="gray" strokeWidth="3" fill="gray" key={i} transform={transformation} data={data} />
                </g>
            )
        }
    });

    return (
        <g
            transform={`translate(${rowNumber * circleSize}, 0)`}
            margin={circleSize}
        >
            {contents}
        </g>
    )
}

TimelineCircleColumn.propTypes = {
    people: PropTypes.arrayOf(Object).isRequired,
    circleSize: PropTypes.number.isRequired,
    rowNumber: PropTypes.number.isRequired
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
        

        // trim arrays to top n people and fetch svg
        const ranking = rankingPerInterval.map(interval => ({
                ...interval,
                ranking: interval.ranking.filter((v, i) => i < numPeople).map(person => ({
                    ...person,
                    svg: getIdenticonSvg(person.name, circleSize).match(/<svg (.*?)>(.*?)<\/svg>/)[2]
                }))
            })
        )

        // work out rank changes 
        const rankingWithChange = ranking.map((interval, index) => {
            let modifiedRanking = interval.ranking.map((person, currentRank) => ({
                ...person,
                currentRank,
                previousRank: -1,
                nextRank: -1,
            }))

            // work out next ranking
            if (index < ranking.length - 1) {
                const nextRankings = ranking[index + 1].ranking;
                modifiedRanking = modifiedRanking.map(person => ({
                    ...person,
                    nextRank: nextRankings.reduce((final, current, nextRankingIndex) => {
                        if (current.name === person.name) {
                            return nextRankingIndex;
                        }
                        return final;
                    }, -1)
                }))
            }

            // work out previous ranking
            if (index > 0) {
                const prevRanking = ranking[index - 1].ranking;
                modifiedRanking = modifiedRanking.map(person => ({
                    ...person,
                    previousRank: prevRanking.reduce((final, current, prevRankingIndex) => {
                        if (current.name === person.name) {
                            return prevRankingIndex;
                        }
                        return final;
                    }, -1)
                }))
            }
            return {
                ...interval,
                ranking: modifiedRanking
            }
        })

        console.log(rankingWithChange)

        const contents = []
        rankingWithChange.forEach((interval, i) => {
            contents.push(
                <TimelineCircleColumn
                    key={i}
                    circleSize={circleSize}
                    people={interval.ranking}
                    rowNumber={i}
                />
            )
        })

        return (
            <svg
                width={2 * circleSize * contents.length}
                height={circleSize * numPeople}
            >
                {contents}
            </svg>
        );
    }
}
