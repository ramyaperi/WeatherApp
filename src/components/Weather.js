import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../util/utils.js";
import { FETCH_WEATHER, FETCH_DAYS, FETCH_BARDATA } from "../actions";
import LoadingPage from "./LoadingPage.js";
import BarChart from "./BarChart.js";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import IconButton from "@material-ui/core/IconButton";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";

class Weather extends Component {
  state = {
    units: "Fahrenheit",
    showWeather: 0
  };

  handleUnitsChange = event => {
    this.setState({ units: event.target.value });
  };
  handleBackArrowClick = event => {
    this.setState({ showWeather: this.state.showWeather - 1 });
  };
  handleForwardArrowClick = event => {
    this.setState({ showWeather: this.state.showWeather + 1 });
  };
  handleCardActionClick = value => {
    this.setState({
      weatherBarDay: this.props.barData[value]
    });
  };

  componentDidMount() {
    this.props.fetchData(
      "http://api.openweathermap.org/data/2.5/forecast?q=Munich,de&units=imperial&APPID=bd8bbf2043083b52d632d5fbf02fd5ba&cnt=40"
    );
  }

  render() {
    if (!this.props.weather) {
      return <LoadingPage />;
    }
    return (
      <Grid container className="Weather" spacing={2}>
        {/* radio buttons for temp selection */}
        <Grid container justify="center">
          <RadioGroup
            name="spacing"
            aria-label="Spacing"
            value={this.state.units.toString()}
            onChange={this.handleUnitsChange}
            row
          >
            {["Celcius", "Fahrenheit"].map(value => (
              <FormControlLabel
                key={value}
                value={value.toString()}
                control={<Radio />}
                label={value.toString()}
              />
            ))}
          </RadioGroup>
        </Grid>
        {/*Arrows buttons for selection of cards displayed */}
        <Grid container justify="space-between">
          <IconButton
            disabled={this.state.showWeather === 0}
            onClick={this.handleBackArrowClick}
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            disabled={this.state.showWeather >= 2}
            onClick={this.handleForwardArrowClick}
          >
            <ArrowForward />
          </IconButton>
        </Grid>
        {/*Temperature cards --even thou paper is enough using card for future when actions needs to be added*/}
        <Grid container justify="center" spacing={8}>
          {this.props.days
            .slice(this.state.showWeather, this.state.showWeather + 3)
            .map(value => (
              <Grid key={value} item>
                <Card>
                  <CardActionArea
                    onClick={() => this.handleCardActionClick(value)}
                  >
                    <CardContent>
                      <Typography variant="h4">{value.toString()}</Typography>

                      {this.state.units === "Fahrenheit" ? (
                        <>
                          <Typography color="textSecondary">
                            Average Temperature :{" "}
                            {this.props.weather[value].avg.temp}
                          </Typography>
                          <Typography color="textSecondary">
                            Minimum Temperature :{" "}
                            {this.props.weather[value].avg.min_temp}
                          </Typography>
                          <Typography color="textSecondary">
                            Maximum Temperature :{" "}
                            {this.props.weather[value].avg.max_temp}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography color="textSecondary">
                            Average Temperature :{" "}
                            {this.props.weather[value].avg.temp_celcius}
                          </Typography>
                          <Typography color="textSecondary">
                            Minimum Temperature :{" "}
                            {this.props.weather[value].avg.min_temp_celcius}
                          </Typography>
                          <Typography color="textSecondary">
                            Maximum Temperature :{" "}
                            {this.props.weather[value].avg.max_temp_celcius}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Grid container justify="center">
          <BarChart data={this.state.weatherBarDay} />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    weather: state.fetchData.FETCH_WEATHER,
    days: state.fetchData.FETCH_DAYS,
    isLoading: state.fetchData.IS_LOADING,
    barData: state.fetchData.FETCH_BARDATA
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchData: url => dispatch(fetchData(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Weather);
