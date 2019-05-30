import React, { Component } from 'react';
import jdenticon from "jdenticon";

type Props = {
    size: integer,
    value: string,
    className: string
};

export default class Identicon extends Component<Props> {
    props: Props;

    render() {
        const {
            size,
            value,
            className
        } = this.props;

        const svg = jdenticon.toSvg(value, size);
        return (
            <div style={{
                borderRadius: `${Math.floor(size/2)}px`,
                width: `${size}px`,
                height: `${size}px`
            }} className={className} dangerouslySetInnerHTML={{__html: svg}} />
        );
    }

}