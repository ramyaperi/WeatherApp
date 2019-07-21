export const HAS_ERRORED = "HAS_ERRORED";
export const IS_LOADING = "IS_LOADING";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_WEATHER = "weather";
export const FETCH_DAYS = "days";
export const FETCH_BARDATA = "barData";

export function hasErrored(hasErrored) {
  return {
    type: HAS_ERRORED,
    hasErrored
  };
}

export function isLoading(isLoading) {
  return {
    type: IS_LOADING,
    isLoading
  };
}

export function fetchDataSuccess(data) {
  return {
    type: FETCH_DATA_SUCCESS,
    data
  };
}
