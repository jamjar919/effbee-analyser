// @flow
import React, { Component } from 'react';

import styles from './css/TopMenuNetwork.css';

type Props = {
    toggleShowRoot: () => void,
    showRoot: boolean
};

export default class TopMenuNetwork extends Component<Props> {
    props: Props;

    render() {
        const {
            toggleShowRoot
        } = this.props

        return (
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <h2 className={styles.topMenuTitle}>Network</h2>
                    <ul className={styles.topMenu}>
                        <li role="presentation" onClick={() => toggleShowRoot()}>
                            <a>Show/Hide Root</a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
