// @flow
import React, { Component } from 'react';
import styles from './css/PageContainer.css'
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class PageContainer extends React.Component<Props> {
    render() {
        const {
            children,
            withMenu
        } = this.props

        return (
            <div className={classNames(styles.container, withMenu ? styles.withMenu : '')}>
                {children}
            </div>
        );
    }
}

PageContainer.propTypes = {
    children: PropTypes.node.isRequired,
    withMenu: PropTypes.bool
}

PageContainer.defaultProps = {
    withMenu: false
}