import React from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';
import { connect } from "react-redux";

import type { defaultFacebookType } from '../reducers/defaultTypes';
import PageContainer from './PageContainer';
import BusinessList from '../components/BusinessList';
import BusinessEventTypeChart from '../components/BusinessEventTypeChart';
import BusinessEventScatter from '../components/BusinessEventScatter';

type Props = {
  api: defaultFacebookType
};

class OffFacebookActivityPage extends React.Component<Props> {

  render() {
    const { api } = this.props;
    const { adsAndBusinessesApi } = api;
    if (!adsAndBusinessesApi.loaded) {
      return "Looks like you don't have any ads or business data";
    }

    return (
        <PageContainer>
          <Header as='h1'>
            <Icon name='users' />
            <Header.Content>
              Off Facebook Activity
            </Header.Content>
            <Header.Subheader>Advertisers and other companies send data to Facebook about your activity whilst using those apps. This page displays that activity.</Header.Subheader>
          </Header>
          <>
            <Segment>
              <BusinessEventScatter
                data={adsAndBusinessesApi.offFacebook.businesses}
                start={adsAndBusinessesApi.offFacebook.timestampRange.start}
                end={adsAndBusinessesApi.offFacebook.timestampRange.end}
              />
            </Segment>
            <Segment>
              <BusinessList businesses={adsAndBusinessesApi.offFacebook.businesses} onClick={(name, events) => { console.log(name, events) }}/>
            </Segment>
            <Segment>
              <BusinessEventTypeChart data={adsAndBusinessesApi.offFacebook.types} />
            </Segment>
          </>
        </PageContainer>
      );

  }
}

const mapStateToProps = state => ({
    api: state.facebook
});

function mapDispatchToProps() {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OffFacebookActivityPage);
