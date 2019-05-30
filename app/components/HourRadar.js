import React, { Component } from 'react';
import { RadarChart, CircularGridLines } from 'react-vis';

type Props = {
    data: array,
    size:number,
    className: string
}

// https://jsfiddle.net/aymericbeaumet/zb5hqx83/
function abbreviate(n) {
    var exp = n
        .toExponential()
        .split('e+')
        .map(function(el) { return +el; })
    ;
    var mod = exp[1] % 3;
    exp[0] = Math.round(exp[0] * Math.pow(10, mod));
    exp[1] = [
        '',
        'k',
        'm',
        'M',
        'T',
        'quad',
        'quint'
    ][(exp[1] - mod) / 3];
    return exp[0] + exp[1];
}

export default class HourRadar extends Component<Props> {
    props: Props;

    render() {
        const {
            data,
            size,
            className
        } = this.props

        const hours = [...Array(24).keys()]
        const domains = []

        // find max
        let max = 0
        hours.forEach(hour => {
            if (max < data[hour]) {
                max = data[hour]
            }
        })

        // round to nearest hundred
        max = Math.round(max / 100) * 100

        // create domains for the lines
        hours.forEach(hour => {
            domains.push({
                name: hour,
                domain: [0, max]
            })
        })
        // renders in reverse order for some reason
        domains.reverse()

        console.log(data)
        console.log(domains)
        return (
            <RadarChart
                className={className}
                data={[data]}
                height={size}
                width={size}
                domains={domains}
                tickFormat={tick => abbreviate(Math.round(tick))}
                renderAxesOverPolygons={true}
            />
        );
    }
}