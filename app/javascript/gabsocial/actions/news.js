import api from '../api'
import axios from 'axios'
import { importFetchedStatuses } from './importer'
import { TRENDS_RSS_SOURCES } from '../constants'

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

  const url = 'https://trends.gab.com/partner'
  // api(getState).get(`/api/v1/gab_trends?type=partner`).then((response) => {
  axios.get(url).then((response) => {
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
export const expandGabTrendsFeed = (feedId) => (dispatch, getState) => {
  if (!feedId) return
  const exists = !!TRENDS_RSS_SOURCES.find((block) => block.id === feedId)
  if (!exists) return

  const page = getState().getIn(['news', 'trends_feeds', `${feedId}`, 'curPage'], 0) + 1

  dispatch(expandGabTrendsFeedRequest(feedId))

  const url = `https://trends.gab.com/feed/${feedId}?fmt=json&p=${page}`
  // api(getState).get(`/api/v1/gab_trends?type=rss&page=${page}&feedId=${feedId}`).then((response) => {
  axios.get(url).then((response) => {
    dispatch(expandGabTrendsFeedSuccess(response.data.rssFeedItems, feedId, response.data.pagination.p))
  }).catch((error) => {
    dispatch(expandGabTrendsFeedFail(error, feedId))
  })
}

const expandGabTrendsFeedRequest = (feedId) => ({
  type: GAB_TREND_FEED_EXPAND_REQUEST,
  feedId,
})

const expandGabTrendsFeedSuccess = (items, feedId, curPage) => ({
  type: GAB_TREND_FEED_EXPAND_SUCCESS,
  items,
  feedId,
  curPage,
})

const expandGabTrendsFeedFail = (error, feedId) => ({
  type: GAB_TREND_FEED_EXPAND_FAIL,
  error,
  feedId,
})

/**
 * 
 */
export const fetchGabNews = () => (dispatch, getState) => {
  // If fetched once, dont fetch again
  const isFetched = getState().getIn(['news', 'gab_news', 'isFetched'], false)
  if (isFetched) return

  dispatch(fetchGabNewsRequest())
  
  const url = 'https://news.gab.com/feed/?feed=json'
  // api(getState).get(`/api/v1/gab_trends?type=news`).then((response) => {
    axios.get(url).then((response) => {
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