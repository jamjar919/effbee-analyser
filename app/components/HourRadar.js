import React, { Component } from 'react';
import { RadialChart, Hint } from 'react-vis';

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

    constructor(props) {
        super(props);
        this.state = {
            value: false
        }
    }

    render() {
        const {
            data,
            size,
            className
        } = this.props

        const {
            value
        } = this.state

        const hours = [...Array(24).keys()]
        const domains = []

        // find max
        let max = 0
        hours.forEach(hour => {
            if (max < data[hour]) {
                max = data[hour]
            }
        })

        // avoid divide by zero
        max = Math.max(max, 1)

        // create arcs for the hours
        const arcs = []
        const increment = (Math.PI / 12)

        hours.forEach(hour => {
            arcs.push({
                angle: increment,
                label: hour + ':00',
                value: data[hour],
                style: {
                    fill: (value.time === hour + ':00') ? 
                    `rgba(${Math.floor((data[hour] / max) * 200)}, 0, ${Math.floor(100 - (data[hour] / max) * 100)}, 0.7)` : 
                    `rgb(${Math.floor((data[hour] / max) * 200)}, 0, ${Math.floor(100 - (data[hour] / max) * 100)})`
                }
            })
        })

        return (
            <RadialChart
                data={arcs}
                width={size}
                height={size}
                colorType="literal"
                onValueMouseOver={v => this.setState({value: { messages: v.value, time: v.label, x: 0, y: 0 }})}
                onSeriesMouseOut={v => this.setState({value: false})}
            >
                {value !== false && <Hint value={value} format={v => [
                    { title: "Messages", value: v.messages },
                    { title: "Time", value: v.time }
                ]} />}
            </RadialChart>
        );
    }
}