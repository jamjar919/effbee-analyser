import React, { Component } from 'react';
import jdenticon from "jdenticon";

type Props = {
    size: integer,
    value: string,
    className: string
};

export function getIdenticonSvg(value, size) {
    return jdenticon.toSvg(value, size);
}

export default class Identicon extends Component<Props> {
    props: Props;

    render() {
        const {
            size,
            value,
            className
        } = this.props;

        const svg = getIdenticonSvg(value, size);
        return (
            <div style={{
                borderRadius: `${Math.floor(size/2)}px`,
                width: `${size}px`,
                height: `${size}px`
            }} className={className} dangerouslySetInnerHTML={{__html: svg}} />
        );
    }

}