import api from '../api'
import axios from 'axios'

export const GAB_TRENDS_RESULTS_FETCH_REQUEST = 'GAB_TRENDS_RESULTS_FETCH_REQUEST'
export const GAB_TRENDS_RESULTS_FETCH_SUCCESS = 'GAB_TRENDS_RESULTS_FETCH_SUCCESS'
export const GAB_TRENDS_RESULTS_FETCH_FAIL = 'GAB_TRENDS_RESULTS_FETCH_FAIL'

export const GAB_NEWS_RESULTS_FETCH_REQUEST = 'GAB_NEWS_RESULTS_FETCH_REQUEST'
export const GAB_NEWS_RESULTS_FETCH_SUCCESS = 'GAB_NEWS_RESULTS_FETCH_SUCCESS'
export const GAB_NEWS_RESULTS_FETCH_FAIL = 'GAB_NEWS_RESULTS_FETCH_FAIL'

export const fetchGabTrends = (feedType) => {
  return function (dispatch, getState) {
    dispatch(fetchGabTrendsRequest(feedType))

    const url = feedType === 'partner' ? 'https://trends.gab.com/partner' : 'https://trends.gab.com/trend-feed/json'

    axios.get(url).then((response) => {
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

export const fetchGabNews = () => {
  return function (dispatch) {
    dispatch(fetchGabNewsRequest())

    axios.get('https://news.gab.com/feed/json').then((response) => {
      dispatch(fetchGabNewsSuccess(response.data))
    }).catch(function (error) {
      dispatch(fetchGabNewsFail(error))
    })
  }
}

function fetchGabNewsRequest() {
  return {
    type: GAB_NEWS_RESULTS_FETCH_REQUEST,
  }
}

function fetchGabNewsSuccess(items) {
  return {
    type: GAB_NEWS_RESULTS_FETCH_SUCCESS,
    items,
  }
}

function fetchGabNewsFail(error) {
  return {
    type: GAB_NEWS_RESULTS_FETCH_FAIL,
    error,
  }
}