import React, { Component } from "react";
import Chart from "react-google-charts";

class BarChart extends Component {
  render() {
    if (!this.props.data) {
      return <h4>Click on a card </h4>;
    }
    return (
      <React.Fragment>
        <Chart
          chartType="LineChart"
          width={1000}
          height={300}
          loader={<div>Loading Chart</div>}
          data={this.props.data}
          options={{
            title: "Temprature through the day",
            hAxis: {
              title: "Hour",
              minValue: 0
            },
            vAxis: {
              title: "Temprature"
            }
          }}
        />
      </React.Fragment>
    );
  }
}
export default BarChart;
