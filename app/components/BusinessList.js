import React from 'react';
import PropTypes from 'prop-types';
import { Label } from "semantic-ui-react";
import uuid from "uuid/v4";

const BusinessList = props => {
  const { businesses, onClick } = props;
  return (
    <Label.Group>
      {
        businesses.map(business => (
          <Label as='a' key={uuid()} onClick={() => { onClick(business.name, business.events) }}>
            {business.name}
            <Label.Detail>{business.events.length}</Label.Detail>
          </Label>
        ))
      }
    </Label.Group>
  );
};

BusinessList.propTypes = {
  businesses: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    events: PropTypes.arrayOf(Object)
  })).isRequired,
  onClick: PropTypes.func,
};

BusinessList.defaultProps = {
  onClick: () => {}
};

export default BusinessList;
