import React, { Component } from 'react';
import { Header, Card, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Identicon from '../components/Identicon'
import PageContainer from './PageContainer';

import routes from '../constants/routes.json'
import styles from './css/YouPage.css'

class YouPage extends Component<Props> {
    render() {
        const {
            api,
            history
        } = this.props;

        const name = api.profileApi.getFullName()
        
        return (
            <PageContainer className={styles.youPageContainer}>
                <div className={styles.centeredContent}>
                    <Header as='h1' icon textAlign='center'>
                        <Identicon className="ui circular image" size={100} value={name} />
                        <Header.Content>{ name }</Header.Content>
                    </Header>
                    <Card.Group centered className={styles.youGroup}>
                        <Card color="red">
                            <Card.Content>
                                <Card.Header>Friends</Card.Header>
                                <Card.Meta>Co-Worker</Card.Meta>
                                <Card.Description>Matthew is a pianist living in Nashville.</Card.Description>
                            </Card.Content>
                            <Button onClick={() => { history.push(routes.FRIENDS) }}>Go to Friends List</Button>
                        </Card>
                        <Card color="blue">
                            <Card.Content>
                                <Card.Header>Chats</Card.Header>
                                <Card.Meta>Co-Worker</Card.Meta>
                                <Card.Description>Matthew is a pianist living in Nashville.</Card.Description>
                            </Card.Content>
                            <Button onClick={() => { history.push(routes.CHATS) }}>Go to Chats List</Button>
                        </Card>
                        <Card color="green">
                            <Card.Content>
                                <Card.Header>Network</Card.Header>
                                <Card.Meta>Co-Worker</Card.Meta>
                                <Card.Description>Matthew is a pianist living in Nashville.</Card.Description>
                            </Card.Content>
                            <Button onClick={() => { history.push(routes.NETWORK) }}>Go to Network View</Button>
                        </Card>
                    </Card.Group>
                </div>
            </PageContainer>
        )
    }
}

function mapStateToProps(state) {
    const api = state.facebook
    return {
        api
    };
}
  
function mapDispatchToProps(dispatch) {
    return {}
}
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(YouPage));
  