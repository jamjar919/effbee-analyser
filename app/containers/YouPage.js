import React, { Component } from 'react';
import { Header, Card, Button, Label } from 'semantic-ui-react';
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
        
        const friends = api.friendsApi.get()
        const messages = api.messageApi.getMessages()
        const connections = messages.map(chat => chat.participants.length).reduce((a, b) => a + b, 0)

        return (
            <PageContainer className={styles.youPageContainer}>
                <div className={styles.centeredContent}>
                    <Header as='h1' icon textAlign='center'>
                        <Identicon className="ui circular image" size={175} value={name} />
                        <Header.Content>{ name }</Header.Content>
                    </Header>
                    <Card.Group centered className={styles.youGroup}>
                        <Card>
                            <Card.Content>
                                <Card.Header>Friends <Label color="red" className={styles.labelHeader} horizontal>{friends.length} Friends</Label></Card.Header>
                                <Card.Description>
                                    View your friends in either a simple list or timeline ranking them by messaging frequency per month. You can also
                                    inspect details about a single friend and view your messaging frequency over time, as well as some other statistics.
                                </Card.Description>
                            </Card.Content>
                            <Button.Group>
                                <Button color="red" onClick={() => { history.push(routes.FRIENDS) }}>Friend List</Button>
                                <Button color="orange" onClick={() => { history.push(routes.FRIENDSTIMELINE) }}>Timeline</Button>
                            </Button.Group>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Card.Header>Chats <Label color="blue" className={styles.labelHeader} horizontal>{messages.length} Chats</Label></Card.Header>
                                <Card.Description>
                                    View a list of the chats you're in. You can also inspect a single chat and view statistical breakdowns,
                                    as well as view and search messages, and textual trends. 
                                </Card.Description>
                            </Card.Content>
                            <Button color="blue" onClick={() => { history.push(routes.CHATS) }}>Chat List</Button>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Card.Header>Network <Label color="green" className={styles.labelHeader} horizontal>{connections} Connections</Label></Card.Header>
                                <Card.Description>
                                    Visualise your friendship network. Links are placed between people if they share a group chat.
                                </Card.Description>
                            </Card.Content>
                            <Button color="green" onClick={() => { history.push(routes.NETWORK) }}>Network View</Button>
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
