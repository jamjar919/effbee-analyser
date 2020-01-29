// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './css/PageContainer.css'

export default class PageContainer extends React.Component<Props> {
    render() {
        const {
            children,
            withMenu,
            className
        } = this.props;

        return (
            <div className={classNames(styles.container, withMenu ? styles.withMenu : '', className)}>
                {children}
            </div>
        );
    }
}

PageContainer.propTypes = {
    children: PropTypes.node.isRequired,
    withMenu: PropTypes.bool,
    className: PropTypes.string
}

PageContainer.defaultProps = {
    withMenu: false,
    className: ""
}
