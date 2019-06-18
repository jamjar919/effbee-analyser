import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react'

import { getIdenticonSvg } from './Identicon';

const TimelineCircleColumn = props => {
    const {
        people, // [ {name: "whatever", count: 123 }, ... ] ...
        circleSize,
        rowNumber,
        lineLength,
        onClickPerson,
        selectedFriends
    } = props;

    const contents = []
    const lines = []
    people.forEach((person, i) => {

        const hasSelection = (selectedFriends.length > 0)
        const isSelectedFriend = (hasSelection) && (selectedFriends.indexOf(person.name) > -1)
        const opacity = (hasSelection) ? ( isSelectedFriend ? 1 : 0.2 ) : 1
        const selectionTarget = (hasSelection) ? ( isSelectedFriend ? "" : person.name ) : (person.name);

        const yPos = (circleSize*1.25) * i;
        const nextYPos = (circleSize*1.25) * person.nextRank; 
        const transformation = `translate(0, ${(yPos)})`;
        const data = person.name

        // draw marker
        if (
            (person.previousRank === -1) ||
            (isSelectedFriend)
         ) {
            contents.push(<Popup
                content={person.name}
                key={i}
                position='top center'
                trigger={
                    <g
                        style={{
                            opacity
                        }}
                        onClick={() => { onClickPerson(selectionTarget) }}
                        transform={transformation}
                        data={data} 
                    >
                        <circle cx={circleSize/2} cy={circleSize/2} r={circleSize*0.5} style={{ fill: "#FFF" }} stroke="black" strokeWidth="3" />
                        <g dangerouslySetInnerHTML={{ __html: person.svg }} />
                    </g>
            } />)
        } else {
            contents.push(<Popup content={person.name} key={i} position='top center'
            trigger={
                <g
                    style={{
                        opacity
                    }}
                    onClick={() => { onClickPerson(selectionTarget) }}
                >
                    <circle
                        cx={circleSize/2}
                        cy={circleSize/2}
                        r="5"
                        stroke="gray"
                        strokeWidth="3"
                        fill="gray"
                        key={i}
                        transform={transformation}
                        data={data}
                    />
                </g>
            } />)
        }

        if (person.nextRank > -1) {
            // draw lines
            lines.push(
                <path
                
                    onClick={() => { onClickPerson(selectionTarget) }}
                    d={`M ${circleSize/2} ${yPos + circleSize/2} L ${circleSize*1.25} ${yPos + circleSize/2} L ${lineLength-circleSize*0.25} ${nextYPos + circleSize/2} L ${lineLength + circleSize/2} ${nextYPos + circleSize/2}`}
                    strokeDasharray=""
                    fill="transparent"
                    style={{
                        stroke: "gray",
                        strokeWidth: 5,
                        opacity
                    }}
                    data={data}
                    datafrom={person.currentRank}
                    datanext={person.nextRank}
                />
            )
        }
    });

    return (
        <g>
            <g transform={`translate(${rowNumber * (lineLength) }, 0)`}>
                {lines}
            </g>
            <g
                transform={`translate(${rowNumber * (lineLength) }, 0)`}
                margin={circleSize}
            >
                {contents}
            </g>
        </g>
    )
}

TimelineCircleColumn.propTypes = {
    people: PropTypes.arrayOf(Object).isRequired,
    circleSize: PropTypes.number.isRequired,
    rowNumber: PropTypes.number.isRequired,
    lineLength: PropTypes.number,
    onClickPerson: PropTypes.func,
    selectedFriends: PropTypes.arrayOf(PropTypes.string)
}

TimelineCircleColumn.defaultProps = {
    lineLength: 200,
    onClickPerson: () => { },
    selectedFriends: []
}

export default class FriendRankingTimeline extends Component<Props> {
    static defaultProps = {
        rankingPerInterval: [],
        circleSize: 50,
        numPeople: 5,
        selectedFriend: false,
        onClick: () => {}
    }

    render() {
        const {
            rankingPerInterval,
            circleSize,
            numPeople,
            onClick,
            selectedFriend
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

        const lineLength = 200;

        const selectedFriends = []
        if (selectedFriend) {
            selectedFriends.push(selectedFriend)
        }

        const contents = []
        rankingWithChange.forEach((interval, i) => {
            contents.push(
                <TimelineCircleColumn
                    key={i}
                    circleSize={circleSize}
                    people={interval.ranking}
                    rowNumber={i}
                    lineLength={lineLength}
                    onClickPerson={(friend) => { onClick(friend) }}
                    selectedFriends={selectedFriends}
                />
            )
        })

        return (
            <svg
                width={lineLength * (contents.length - 1)}
                height={circleSize * numPeople * 1.25}
            >
                {contents}
            </svg>
        );
    }
}
