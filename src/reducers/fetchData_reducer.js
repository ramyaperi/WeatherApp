import {
  FETCH_DATA_SUCCESS,
  HAS_ERRORED,
  IS_LOADING,
  FETCH_WEATHER,
  FETCH_BARDATA
} from "../actions/fetchData";

const initialstate = {
  weather: {},
  IS_LOADING: false,
  HAS_ERRORED: false
};

export function fetchData(state = initialstate, action) {
  const { data, isLoading, hasErrored } = action;
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        FETCH_DAYS: data[0],
        FETCH_WEATHER: data[1],
        FETCH_BARDATA: data[2]
      };
    case IS_LOADING:
      return {
        ...state,
        IS_LOADING: isLoading
      };
    case HAS_ERRORED:
      return {
        ...state,
        HAS_ERRORED: hasErrored
      };
    default:
      return state;
  }
}

export default fetchData;
