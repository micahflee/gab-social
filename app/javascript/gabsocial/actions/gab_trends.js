import api from '../api'

export const GAB_TRENDS_RESULTS_FETCH_REQUEST = 'GAB_TRENDS_RESULTS_FETCH_REQUEST'
export const GAB_TRENDS_RESULTS_FETCH_SUCCESS = 'GAB_TRENDS_RESULTS_FETCH_SUCCESS'
export const GAB_TRENDS_RESULTS_FETCH_FAIL = 'GAB_TRENDS_RESULTS_FETCH_FAIL'

export const fetchGabTrends = (feedType) => {
  return function (dispatch, getState) {
    dispatch(fetchGabTrendsRequest(feedType))

    api(getState).get(`/api/v1/gab_trends?type=${feedType}`).then((response) => {
      dispatch(fetchGabTrendsSuccess(response.data, feedType))
    }).catch(function (error) {
      dispatch(fetchGabTrendsFail(error, feedType))
    })
  }
}

function fetchGabTrendsRequest(feedType) {
  return {
    type: GAB_TRENDS_RESULTS_FETCH_REQUEST,
    feedType,
  }
}

function fetchGabTrendsSuccess(items, feedType) {
  return {
    type: GAB_TRENDS_RESULTS_FETCH_SUCCESS,
    items,
    feedType,
  }
}

function fetchGabTrendsFail(error, feedType) {
  return {
    type: GAB_TRENDS_RESULTS_FETCH_FAIL,
    error,
    feedType,
  }
}