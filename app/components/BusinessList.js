import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label } from "semantic-ui-react";

const BusinessList = props => {
  const { businesses, onClick, filterNames } = props;

  const [toShow, setToShow] = useState(20);

  return (
    <Label.Group>
      {
        businesses.map(business => (
          <Label
            as='a'
            key={business.name}
            onClick={() => { onClick(business.name, business.events) }}
            color={filterNames.includes(business.name) ? "blue" : undefined}
          >
            {business.name}
            <Label.Detail>{business.events.length}</Label.Detail>
          </Label>
        )).filter((_, index) => (index < toShow))
      }
      {toShow < businesses.length ? (
        <Label
          as='a'
          key="more"
          onClick={() => { setToShow(toShow + 10) }}
          color="green"
        >
          More
        </Label>
      ) : ""}
    </Label.Group>
  );
};

BusinessList.propTypes = {
  businesses: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    events: PropTypes.arrayOf(Object)
  })).isRequired,
  onClick: PropTypes.func,
  filterNames: PropTypes.arrayOf(PropTypes.string)
};

BusinessList.defaultProps = {
  onClick: () => {},
  filterNames: []
};

export default BusinessList;
