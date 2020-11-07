import api from '../api'
import axios from 'axios'
import { importFetchedStatuses } from './importer'

export const GAB_TRENDS_FETCH_REQUEST = 'GAB_TRENDS_FETCH_REQUEST'
export const GAB_TRENDS_FETCH_SUCCESS = 'GAB_TRENDS_FETCH_SUCCESS'
export const GAB_TRENDS_FETCH_FAIL = 'GAB_TRENDS_FETCH_FAIL'

export const GAB_TREND_FEED_EXPAND_REQUEST = 'GAB_TREND_FEED_EXPAND_REQUEST'
export const GAB_TREND_FEED_EXPAND_SUCCESS = 'GAB_TREND_FEED_EXPAND_SUCCESS'
export const GAB_TREND_FEED_EXPAND_FAIL = 'GAB_TREND_FEED_EXPAND_FAIL'

export const GAB_NEWS_FETCH_REQUEST = 'GAB_NEWS_FETCH_REQUEST'
export const GAB_NEWS_FETCH_SUCCESS = 'GAB_NEWS_FETCH_SUCCESS'
export const GAB_NEWS_FETCH_FAIL = 'GAB_NEWS_FETCH_FAIL'

export const LATEST_GAB_STATUSES_FETCH_REQUEST = 'LATEST_GAB_STATUSES_FETCH_REQUEST'
export const LATEST_GAB_STATUSES_FETCH_SUCCESS = 'LATEST_GAB_STATUSES_FETCH_SUCCESS'
export const LATEST_GAB_STATUSES_FETCH_FAIL = 'LATEST_GAB_STATUSES_FETCH_FAIL'

/**
 * 
 */
export const fetchGabTrends = () => (dispatch, getState) => {
  // If fetched once, dont fetch again
  const isFetched = getState().getIn(['news', 'trends_breaking', 'isFetched'], false)
  if (isFetched) return

  dispatch(fetchGabTrendsRequest())

  // const url = 'https://trends.gab.com/partner'
  api(getState).get(`/api/v1/gab_trends?type=partner`).then((response) => {
  // axios.get(url).then((response) => {
    dispatch(fetchGabTrendsSuccess(response.data))
  }).catch((error) => {
    dispatch(fetchGabTrendsFail(error))
  })
}

const fetchGabTrendsRequest = () => ({
  type: GAB_TRENDS_FETCH_REQUEST,
})

const fetchGabTrendsSuccess = (items) => ({
  type: GAB_TRENDS_FETCH_SUCCESS,
  items,
})

const fetchGabTrendsFail = (error) => ({
  type: GAB_TRENDS_FETCH_FAIL,
  error,
})

/**
 * 
 */
export const expandGabTrendsFeed = (feedId, page = 0) => (dispatch, getState) => {
  dispatch(expandGabTrendsFeedRequest(feedId, page))

  // const url = `http://trends.gab.com/feed/${feedId}?fmt=json`
  api(getState).get(`/api/v1/gab_trends?type=rss`).then((response) => {
  // axios.get(url).then((response) => {
    dispatch(expandGabTrendsFeedSuccess(response.data, feedId, page))
  }).catch((error) => {
    dispatch(expandGabTrendsFeedFail(error, feedId, page))
  })
}

const expandGabTrendsFeedRequest = (feedId, page) => ({
  type: GAB_TREND_FEED_EXPAND_REQUEST,
  feedId,
  page,
})

const expandGabTrendsFeedSuccess = (items, feedId, page) => ({
  type: GAB_TREND_FEED_EXPAND_SUCCESS,
  items,
  feedId,
  page,
})

const expandGabTrendsFeedFail = (error, feedId, page) => ({
  type: GAB_TREND_FEED_EXPAND_FAIL,
  error,
  feedId,
  page,
})

/**
 * 
 */
export const fetchGabNews = () => (dispatch, getState) => {
  // If fetched once, dont fetch again
  const isFetched = getState().getIn(['news', 'gab_news', 'isFetched'], false)
  if (isFetched) return

  dispatch(fetchGabNewsRequest())
  
  // const url = 'https://news.gab.com/feed/json'
  api(getState).get(`/api/v1/gab_trends?type=news`).then((response) => {
    // axios.get(url).then((response) => {
    dispatch(fetchGabNewsSuccess(response.data.items))
  }).catch((error) => {
    dispatch(fetchGabNewsFail(error))
  })
}

const fetchGabNewsRequest = () => ({
  type: GAB_NEWS_FETCH_REQUEST,
})

const fetchGabNewsSuccess = (items) => ({
  type: GAB_NEWS_FETCH_SUCCESS,
  items,
})

const fetchGabNewsFail = (error) => ({
  type: GAB_NEWS_FETCH_FAIL,
  error,
})

/**
 * 
 */
export const fetchLatestFromGabTimeline = () => (dispatch, getState) => {
  // If fetched once, dont fetch again
  const isFetched = getState().getIn(['news', 'latest_from_gab', 'isFetched'], false)
  if (isFetched) return

  dispatch(fetchLatestFromGabTimelineRequest())

  api(getState).get(`/api/v1/popular_links?type=gab`).then((response) => {
    dispatch(importFetchedStatuses(response.data))
    dispatch(fetchLatestFromGabTimelineSuccess(response.data))
  }).catch((error) => {
    dispatch(fetchLatestFromGabTimelineFail(error))
  })
}

const fetchLatestFromGabTimelineRequest = () => ({
  type: LATEST_GAB_STATUSES_FETCH_REQUEST
})

const fetchLatestFromGabTimelineSuccess = (statuses) => ({
  type: LATEST_GAB_STATUSES_FETCH_SUCCESS,
  statuses,
})

const fetchLatestFromGabTimelineFail = (error) => ({
  type: LATEST_GAB_STATUSES_FETCH_FAIL,
  error,
})