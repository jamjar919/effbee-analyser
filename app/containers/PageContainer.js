// @flow
import React, { Component } from 'react';
import styles from './css/PageContainer.css'

type Props = {
  children: React.Node
};

export default class PageContainer extends React.Component<Props> {
    props: Props;

    render() {
        const {
            children
        } = this.props

        return (
            <div className={styles.container}>
                {children}
            </div>
        );
    }
}

  