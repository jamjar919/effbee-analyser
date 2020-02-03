import React from 'react';
import PropTypes from 'prop-types';
import c3 from 'c3'
import moment from 'moment';

import { bucketByTimeInterval } from '../facebookapi/api';

export default class BusinessEventTypeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "businessEventScatter",
      chart: null
    }
  }

  componentDidMount() {
    this.renderChart()
  }

  componentDidUpdate(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.renderChart()
    }
  }

  renderChart() {
    const { data, start, end } = this.props;
    const { id } = this.state;

    data.sort((a, b) => b.events.length - a.events.length);

    const bucketed = data.map(business => ({
      name: business.name,
      buckets: bucketByTimeInterval([business.events], start, end, 86400*7, a => a.timestamp)
    }));

    const scale = ['x', ...bucketed[0].buckets.map(bucket =>
      moment.unix(Math.floor((bucket.start + bucket.end)/2)).format("YYYY-MM-DD")
    )];

    const columns = bucketed
      .map(column => [column.name, ...column.buckets.map(bucket => bucket.items.length === 0 ? null : bucket.items.length)]);

    const chart = c3.generate({
      bindto: '#' + id,
      data: {
        x: 'x',
        columns: [scale, ...columns.slice(0, 20)],
        type : 'scatter',
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        }
      },
      legend: {
        show: false
      }
    });

    this.setState({ chart })
  }

  render() {
    const { id } = this.state;

    return (
      <div id={id} />
    )
  }
}

BusinessEventTypeChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    events: PropTypes.arrayOf(Object)
  })).isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired
};
