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
import Divider from "@material-ui/core/Divider";

export class Weather extends Component {
  state = {
    units: "Fahrenheit",
    showWeather: 0,
    selectedValue: ""
  };

  handleUnitsChange = event => {
    this.setState({
      units: event.target.value,
      selectedValue: "",
      weatherBarDay: "",
      deviceLimit: 3,
      deviceDays: 2
    });
  };
  handleBackArrowClick = event => {
    this.setState({ showWeather: this.state.showWeather - 1 });
  };
  handleForwardArrowClick = event => {
    this.setState({ showWeather: this.state.showWeather + 1 });
  };
  handleCardActionClick = value => {
    this.setState({
      weatherBarDay: this.props.barData[this.state.units][value],
      selectedValue: value
    });
  };

  componentDidMount() {
    this.props.fetchData(
      "https://api.openweathermap.org/data/2.5/forecast?q=Munich,de&units=imperial&APPID=bd8bbf2043083b52d632d5fbf02fd5ba&cnt=40"
    );
    if (window.innerWidth <= 500) {
      this.setState({ deviceLimit: 1, deviceDays: 4 });
    } else {
      this.setState({ deviceLimit: 3, deviceDays: 2 });
    }
  }

  render() {
    if (!this.props.weather) {
      return <LoadingPage />;
    }
    return (
      <Grid container className="Weather">
        <Grid container justify="center">
          <Typography variant="h4">5 Day Weather Report</Typography>
        </Grid>
        <Grid container justify="center">
          <Typography variant="h6" color="textSecondary">
            München
          </Typography>
        </Grid>
        <Grid container justify="center">
          <Typography variant="h6" color="textSecondary">
            {this.props.days[0].toString()}
          </Typography>
        </Grid>
        <Grid />
        <Grid />
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
            disabled={this.state.showWeather >= this.state.deviceDays}
            onClick={this.handleForwardArrowClick}
          >
            <ArrowForward />
          </IconButton>
        </Grid>
        {/*Temperature cards --even thou paper is enough using card for future when actions needs to be added*/}
        <Grid container justify="center" spacing={8}>
          {this.props.days
            .slice(
              this.state.showWeather,
              this.state.showWeather + this.state.deviceLimit
            )
            .map(value => (
              <Grid key={value} item>
                <Card
                  className="card"
                  {...(this.state.selectedValue === value
                    ? { style: { background: "#26c6da" } }
                    : { style: { background: "#fafafa" } })}
                >
                  <CardActionArea
                    onClick={() => this.handleCardActionClick(value)}
                  >
                    <CardContent>
                      <Typography variant="h4">{value.toString()}</Typography>
                      <Divider light />
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
          <Grid item xs={12}>
            <BarChart data={this.state.weatherBarDay} />
          </Grid>
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
