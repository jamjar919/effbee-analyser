import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c3 from 'c3'

type Props = {
  friends: array
}

export default class BusinessEventTypeChart extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      id: "businessEvent",
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
    const { data } = this.props;
    const { id } = this.state;

    const columns = Object.entries(data)
      .filter(([type , count]) => count > 0);

    const chart = c3.generate({
      bindto: '#' + id,
      data: {
        columns,
        type : 'bar',
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
  data: PropTypes.shape(Object)
}
