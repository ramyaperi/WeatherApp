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

/*function organizeWeatherData(response) {
  var weatherBar = [];
  var weatherDay = [];
  for (var i = 0; i < response.length; i++) {
    weatherBar[i] = {};
    weatherBar[i].dt = new Date(response[i].dt * 1000);
    weatherBar[i].temp = response[i].main.temp;
    weatherBar[i].temp_celcius = toCelsius(response[i].main.temp);

    if (i % 8 === 0) {
      weatherDay[i / 8] = weatherBar[i];
      weatherDay[i / 8].min_temp = response[i].main.temp_min;
      weatherDay[i / 8].min_temp_celcius = toCelsius(response[i].main.temp_min);
      weatherDay[i / 8].max_temp = response[i].main.temp_max;
      weatherDay[i / 8].max_temp_celcius = toCelsius(response[i].main.temp_max);
      weatherDay[i / 8].humidity = response[i].main.humidity;
      weatherDay[i / 8].desc = response[i].weather[0].description;
    }
  }

  return [weatherBar, weatherDay];
}*/

function organizeWeatherData(response) {
  var weather = {};
  var dates = [];
  var date, day, hour;
  var tempWeather = {};
  var barData = {};

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
    tempWeather.temp_celcius = toCelsius(response[i].main.temp);
    tempWeather.min_temp = response[i].main.temp_min;
    tempWeather.min_temp_celcius = toCelsius(response[i].main.temp_min);
    tempWeather.max_temp = response[i].main.temp_max;
    tempWeather.max_temp_celcius = toCelsius(response[i].main.temp_max);

    if (weather.hasOwnProperty(day)) {
      barData[day].push([
        hour,
        parseFloat(tempWeather.temp),
        parseFloat(tempWeather.temp_celcius)
      ]);
      weather[day].avg.temp += tempWeather.temp;
      weather[day].avg.temp_celcius += tempWeather.temp_celcius;
      weather[day].avg.min_temp += tempWeather.min_temp;
      weather[day].avg.min_temp_celcius += tempWeather.min_temp_celcius;
      weather[day].avg.max_temp += tempWeather.max_temp;
      weather[day].avg.max_temp_celcius += tempWeather.max_temp_celcius;
    } else {
      weather[day] = {};
      weather[day].avg = {};
      barData[day] = [["Hour", "Temparature °F", "Temparature °C"]];
      dates.push(day);
      barData[day].push([
        parseFloat(hour),
        parseFloat(tempWeather.temp),
        parseFloat(tempWeather.temp_celcius)
      ]);
      weather[day].avg.temp = tempWeather.temp;
      weather[day].avg.temp_celcius = tempWeather.temp_celcius;
      weather[day].avg.min_temp = tempWeather.min_temp;
      weather[day].avg.min_temp_celcius = tempWeather.min_temp_celcius;
      weather[day].avg.max_temp = tempWeather.max_temp;
      weather[day].avg.max_temp_celcius = tempWeather.max_temp_celcius;
    }
    weather[day][hour] = {};
    weather[day][hour] = tempWeather;
  }

  consolidateAverage(weather);
  console.log(weather);
  return [dates, weather, barData];
}

function toCelsius(temp) {
  return Math.round(((temp - 32) * 5) / 9);
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
    weather[day].avg.temp = Math.round(weather[day].avg.temp / hoursinday);
    weather[day].avg.min_temp = Math.round(
      weather[day].avg.min_temp / hoursinday
    );
    weather[day].avg.max_temp = Math.round(
      weather[day].avg.max_temp / hoursinday
    );
    weather[day].avg.temp_celcius = Math.round(
      weather[day].avg.temp_celcius / hoursinday
    );
    weather[day].avg.min_temp_celcius = Math.round(
      weather[day].avg.min_temp_celcius / hoursinday
    );

    weather[day].avg.max_temp_celcius = Math.round(
      weather[day].avg.max_temp_celcius / hoursinday
    );
  }
}
