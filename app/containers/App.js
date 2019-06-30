// @flow
import * as React from 'react';
import styles from './App.css';

type Props = {
    children: React.Node
};

export default class App extends React.Component<Props> {
    props: Props;

    render() {
        const { children } = this.props;
        return (
            <div className={styles.appContainer}>
                {children}
            </div>
        );
    }
}
