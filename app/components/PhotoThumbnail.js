import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Icon, Modal } from 'semantic-ui-react'

import styles from './css/PhotoThumbnail.css'

export class PhotoThumbnail extends Component<Props> {
    state = { modalOpen: false }

    handleOpen = () => this.setState({ modalOpen: true })
  
    handleClose = () => this.setState({ modalOpen: false })
  
    render() {
        const {
            dataDir,
            uri
        } = this.props
        return (
            <Modal
                trigger={
                    <div className={styles.thumbnail} onClick={this.handleOpen}>
                        <img className={styles.thumbnailImage} src={`${dataDir}/${uri}`} />
                    </div>
                } 
                basic
                size='small'
                className={styles.photoModal}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Actions>
                    <Button color='red' onClick={this.handleClose} inverted>
                        <Icon name='close' /> Close
                    </Button>
                </Modal.Actions>
                <Modal.Content>
                    <img src={`${dataDir}/${uri}`} />
                </Modal.Content>
                
            </Modal>
        )
    }
}

PhotoThumbnail.propTypes = {
    uri: PropTypes.string,
    dataDir: PropTypes.string
}

PhotoThumbnail.defaultProps = {
    uri: "",
    dataDir: ""
}

export class PhotoThumbnailGroup extends Component<Props> {
    render() {
        const {
            children,
            className,
            dataDir
        } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                {
                    React.Children.map(children, child =>
                        React.cloneElement(child, { dataDir })
                    )
                }
            </div>
        );
    }
}

PhotoThumbnailGroup.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
    dataDir: PropTypes.string,
}