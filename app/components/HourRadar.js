import React, { Component } from 'react';
import { RadialChart, Hint } from 'react-vis';
import classNames from 'classnames';
import { Icon } from 'semantic-ui-react';

import styles from './css/HourRadar.css'

type Props = {
    data: array,
    size:number,
    className: string
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
                className={classNames(className, styles.hourRadar)}
                data={arcs}
                width={size}
                height={size}
                colorType="literal"
                onValueMouseOver={v => this.setState({value: { messages: v.value, time: v.label }})}
                onSeriesMouseOut={v => this.setState({value: false})}
            >
                {value !== false && <div className={styles.tip}>
                    <span className={styles.tipContent}>
                        <Icon name='facebook messenger'/> {value.messages}<br />
                        <Icon name='clock outline'/>{value.time}
                    </span>
                </div>}
            </RadialChart>
        );
    }
}