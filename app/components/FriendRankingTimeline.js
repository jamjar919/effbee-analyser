import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react'
import moment from 'moment';
import flatMap from 'array.prototype.flatmap';
import uuid from "uuid/v4"

import { getIdenticonSvg } from './Identicon';

const TimelineCircleColumn = props => {
    const {
        people, // [ {name: "whatever", count: 123 }, ... ] ...
        circleSize,
        rowNumber,
        lineLength,
        onClickPerson,
        selectedFriends,
        isSelectedColumn
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
            (isSelectedFriend) ||
            (isSelectedColumn)
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
                        <g 
                            dangerouslySetInnerHTML={{ __html: person.svg }}
                            style={{
                                cursor: "pointer"
                            }}
                        />
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
                        style={{
                            cursor: "pointer"
                        }}
                    />
                </g>
            } />)
        }

        if (person.nextRank > -1) {
            // draw lines
            lines.push(
                <path
                    key={uuid()}
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
    selectedFriends: PropTypes.arrayOf(PropTypes.string),
    isSelectedColumn: PropTypes.bool
}

TimelineCircleColumn.defaultProps = {
    lineLength: 200,
    onClickPerson: () => { },
    selectedFriends: [],
    isSelectedColumn: false
}

export default class FriendRankingTimeline extends Component<Props> {
    static defaultProps = {
        rankingPerInterval: [],
        circleSize: 50,
        numPeople: 5,
        selectedFriend: false,
        selectedColumn: false,
        onSelectFriend: () => {},
        onSelectColumn: () => {},
        onSelectRow: () => {}
    }

    render() {
        const {
            rankingPerInterval,
            circleSize,
            numPeople,
            onSelectFriend,
            onSelectColumn,
            onSelectRow,
            selectedFriend,
            selectedColumn
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
                    onClickPerson={(friend) => { onSelectFriend(friend) }}
                    selectedFriends={selectedFriends}
                    isSelectedColumn={selectedColumn === i}
                />
            )
        })

        const numbers = []
        for (let i = 1; i < numPeople + 1; i += 1) {
            numbers.push(
                <text key={i} x="0" y="0" fontSize="20" transform={`translate(0, ${(circleSize*1.25) * i - (circleSize/2)})`}>{i}.</text>
            )
        }

        const dates = flatMap(rankingWithChange.map(
            interval => {
                const midpoint = (interval.start + interval.end)/2;
                if (midpoint < moment().unix()) {
                    return moment.unix(midpoint)
                }
                return moment.unix(interval.start)
            }
        ), (date, i) => [
            <text key={i * 2}
                x={(lineLength) * i + circleSize/2} y="40"
                fontSize="15"
                textAnchor="middle"
                onClick={() => { onSelectColumn(rankingWithChange[i], i) }}
                style={{ cursor: "pointer" }}
            >
                {date.fromNow()}
            </text>,
            <text key={(i*2) -1}
                x={(lineLength) * i + circleSize/2} y="20"
                fontSize="20"
                textAnchor="middle"
                onClick={() => { onSelectColumn(rankingWithChange[i], i) }}
                style={{ cursor: "pointer" }}
            >
                {date.format("LL")}
            </text>
        ])

        let selectionIndicator = ""
        if (selectedColumn !== false) {
            selectionIndicator = <rect
                key="selection"
                style={{
                    pointerEvents: "none",
                    opacity: 0.2,
                    borderRadius: "30px"
                }}
                x="0" y="0"
                width={lineLength}
                height={circleSize * numPeople * 1.25 + 60}
                transform={`translate(${selectedColumn * (lineLength) - (circleSize/2)}, 0)`}
            />
        }

        return (
            <svg
                width={(lineLength) * (contents.length)}
                height={circleSize * numPeople * 1.25 + 60}
            >
                <g>
                    {selectionIndicator}
                </g>
                <g transform="translate(50, 0)">
                    {dates}
                </g>
                <g transform="translate(0, 60)">
                    <g>
                        {numbers}
                    </g>
                    <g transform="translate(50, 0)" >
                        {contents}
                    </g>
                </g>
            </svg>
        );
    }
}
