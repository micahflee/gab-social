import api from '../api';
import { me } from '../initial_state'

export const GAB_TRENDS_RESULTS_FETCH_REQUEST = 'GAB_TRENDS_RESULTS_FETCH_REQUEST'
export const GAB_TRENDS_RESULTS_FETCH_SUCCESS = 'GAB_TRENDS_RESULTS_FETCH_SUCCESS'
export const GAB_TRENDS_RESULTS_FETCH_FAIL = 'GAB_TRENDS_RESULTS_FETCH_FAIL'

export const fetchGabTrends = () => {
  return function (dispatch, getState) {
    if (!me) return

    dispatch(fetchGabTrendsRequest())

    api(getState).get('/api/v1/gab_trends').then(response => {
      dispatch(fetchGabTrendsSuccess(response.data.items))
    }).catch(function (error) {
      dispatch(fetchGabTrendsFail(error))
    })
  }
}

function fetchGabTrendsRequest() {
  return {
    type: GAB_TRENDS_RESULTS_FETCH_REQUEST,
  }
}

function fetchGabTrendsSuccess(items) {
  return {
    type: GAB_TRENDS_RESULTS_FETCH_SUCCESS,
    items,
  }
}

function fetchGabTrendsFail(error) {
  return {
    type: GAB_TRENDS_RESULTS_FETCH_FAIL,
    error,
  }
}