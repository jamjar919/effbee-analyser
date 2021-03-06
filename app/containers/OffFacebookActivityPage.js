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
  constructor(props) {
    super(props);
    this.state = {
      names: []
    };
  }

  handleSelectName = (selectedName) => {
    const { names } = this.state;

    let newNames;
    if (names.includes(selectedName)) {
      newNames = names.filter((name) => (name !== selectedName));
    } else {
      newNames = Object.assign([], names);
      newNames.push(selectedName);
    }
    this.setState({ names: newNames });
  };

  render() {
    const { api } = this.props;
    const { names } = this.state;
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
                filterNames={names}
              />
            </Segment>
            <Segment>
              <BusinessList
                filterNames={names}
                businesses={adsAndBusinessesApi.offFacebook.businesses}
                onClick={this.handleSelectName}
              />
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
