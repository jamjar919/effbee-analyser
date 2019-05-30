import React, { Component } from 'react';
import { ArcSeries, XYPlot } from 'react-vis';

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

        // create arcs for the hours
        const arcs = []
        let angle = 0
        const increment = (Math.PI / 12)
        
        hours.forEach(hour => {
            arcs.push({
                angle0: angle,
                angle: angle + increment,
                radius0: 0,
                radius: data[hour],
            })
            angle = angle + increment
        })

        return (
            <XYPlot
                xDomain={[-5, 5]}
                yDomain={[-5, 5]}
                width={size}
                height={size}
            >
                <ArcSeries
                    animation
                    className={className}
                    data={arcs}
                    radiusDomain={[0, max]}
                />
            </XYPlot>
        );
    }
}