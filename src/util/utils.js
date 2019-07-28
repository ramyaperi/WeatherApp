import { isLoading, hasErrored, fetchDataSuccess } from "../actions";

export function fetchData(url) {
  return dispatch => {
    dispatch(isLoading(true));

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(isLoading(false));

        return response;
      })
      .then(response => response.json())
      .then(fetchedData =>
        dispatch(fetchDataSuccess(organizeWeatherData(fetchedData.list)))
      )
      .catch(() => dispatch(hasErrored(true)));
  };
}

function organizeWeatherData(response) {
  var weather = {};
  var dates = [];
  var date, day, hour;
  var tempWeather = {};
  var barDataFah = {};
  var barDataCelcius = {};

  for (var i = 0; i < response.length; i++) {
    date = convertUTCDateToLocalDate(response[i].dt);
    day = date
      .toString()
      .split(" ")
      .slice(0, 4)
      .join(" ");
    hour = date.getHours();

    tempWeather = {};
    tempWeather.temp = response[i].main.temp;
    tempWeather.min_temp = response[i].main.temp_min;
    tempWeather.max_temp = response[i].main.temp_max;

    if (weather.hasOwnProperty(day)) {
      barDataFah[day].push([parseFloat(hour), tempWeather.temp]);
      barDataCelcius[day].push([parseFloat(hour), toCelsius(tempWeather.temp)]);
      weather[day].avg.temp += tempWeather.temp;

      if (weather[day].avg.min_temp > tempWeather.min_temp) {
        weather[day].avg.min_temp = tempWeather.min_temp;
      }
      if (weather[day].avg.max_temp < tempWeather.max_temp) {
        weather[day].avg.max_temp = tempWeather.max_temp;
      }
    } else {
      weather[day] = {};
      weather[day].avg = {};
      barDataFah[day] = [["Hour", "Temparature °F"]];
      barDataCelcius[day] = [["Hour", "Temparature °C"]];
      dates.push(day);
      barDataFah[day].push([parseFloat(hour), tempWeather.temp]);
      barDataCelcius[day].push([parseFloat(hour), toCelsius(tempWeather.temp)]);
      weather[day].avg.temp = tempWeather.temp;
      weather[day].avg.min_temp = tempWeather.min_temp;
      weather[day].avg.max_temp = tempWeather.max_temp;
    }
    weather[day][hour] = {};
    weather[day][hour] = tempWeather;
  }

  consolidateAverage(weather);
  console.log(weather);
  var barData = {
    Celcius: barDataCelcius,
    Fahrenheit: barDataFah
  };
  return [dates, weather, barData];
}

function toCelsius(temp) {
  return parseFloat(((temp - 32) * 5) / 9);
}

function convertUTCDateToLocalDate(date) {
  date = new Date(date * 1000);
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);
  return newDate;
}

function consolidateAverage(weather) {
  var hoursinday;
  for (var day in weather) {
    //-1 for the avg key
    hoursinday = Object.keys(weather[day]).length - 1;
    weather[day].avg.temp = parseFloat(
      weather[day].avg.temp / hoursinday
    ).toFixed(1);
    weather[day].avg.min_temp = parseFloat(weather[day].avg.min_temp).toFixed(
      1
    );
    weather[day].avg.max_temp = parseFloat(weather[day].avg.max_temp).toFixed(
      1
    );
    weather[day].avg.temp_celcius = parseFloat(
      toCelsius(weather[day].avg.temp)
    ).toFixed(1);
    weather[day].avg.min_temp_celcius = parseFloat(
      toCelsius(weather[day].avg.min_temp)
    ).toFixed(1);
    weather[day].avg.max_temp_celcius = parseFloat(
      toCelsius(weather[day].avg.max_temp)
    ).toFixed(1);
  }
}
