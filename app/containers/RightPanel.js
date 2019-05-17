// @flow
import * as React from 'react';
import classNames from 'classnames';

import styles from './css/RightPanel.css';

type Props = {
  children: React.Node
};

export default class RightPanel extends React.Component<Props> {
    props: Props;

    constructor(props) {
        super(props)
        this.state = {
            open: true
        }
    }

    render() {
    const { children } = this.props;
    const { open } = this.state;
    return (
        <div className={classNames(styles.container, (open ? styles.open : ''))}>
            <div className={styles.controlContainer}>
                <i
                    className="fa fa-bars fa-rotate-270"
                    onClick={() => {
                        this.setState({ open: !this.state.open })
                    }}
                ></i>
            </div>
            <div
                className={styles.content}
            >
                {children}
            </div>
        </div>
    );
    }
}
