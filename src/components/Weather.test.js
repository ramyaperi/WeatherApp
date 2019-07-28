import React from "react";
import Enzyme, { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { Weather } from "./Weather";

const props = {
  weather: {
    "Mon Jul 29 2019": {
      1: { temp: 60.41, min_temp: 60.41, max_temp: 60.41 },
      4: { temp: 59.45, min_temp: 59.45, max_temp: 59.45 },
      avg: {
        temp: "63.47",
        min_temp: "58.83",
        max_temp: "71.25",
        temp_celcius: "17.48",
        min_temp_celcius: "14.91",
        temp: "63.47",
        temp_celcius: "17.48"
      }
    },
    "Sun Jul 28 2019": {
      7: { temp: 60.41, min_temp: 60.41, max_temp: 60.41 },
      10: { temp: 59.45, min_temp: 59.45, max_temp: 59.45 },
      avg: {
        temp: "63.47",
        min_temp: "58.83",
        max_temp: "71.25",
        temp_celcius: "17.48",
        min_temp_celcius: "14.91",
        temp: "63.47",
        temp_celcius: "17.48"
      }
    }
  },
  days: ["Sun Jul 28 2019", "Mon Jul 29 2019"],
  isLoading: false,
  barData: { Celcius: {}, Fahrenheit: {} },
  fetchData: jest.fn()
};

describe("Weather React Component", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<Weather {...props} />);
    //console.log(wrapper.debug());
    expect(wrapper.hasClass("Weather")).toBe(true);
  });

  it("Weather snapshot  test", () => {
    const wrapper = shallow(<Weather {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
