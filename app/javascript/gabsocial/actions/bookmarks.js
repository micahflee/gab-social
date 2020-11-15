import api, { getLinks } from '../api'
import { importFetchedStatuses } from './importer'
import { me } from '../initial_state'

export const BOOKMARKED_STATUSES_FETCH_REQUEST = 'BOOKMARKED_STATUSES_FETCH_REQUEST'
export const BOOKMARKED_STATUSES_FETCH_SUCCESS = 'BOOKMARKED_STATUSES_FETCH_SUCCESS'
export const BOOKMARKED_STATUSES_FETCH_FAIL = 'BOOKMARKED_STATUSES_FETCH_FAIL'

export const BOOKMARKED_STATUSES_EXPAND_REQUEST = 'BOOKMARKED_STATUSES_EXPAND_REQUEST'
export const BOOKMARKED_STATUSES_EXPAND_SUCCESS = 'BOOKMARKED_STATUSES_EXPAND_SUCCESS'
export const BOOKMARKED_STATUSES_EXPAND_FAIL = 'BOOKMARKED_STATUSES_EXPAND_FAIL'

/**
 * 
 */
export const fetchBookmarkedStatuses = () => (dispatch, getState) => {
  if (!me) return

  if (getState().getIn(['status_lists', 'bookmarks', 'isLoading'])) {
    return
  }

  dispatch(fetchBookmarkedStatusesRequest())

  api(getState).get('/api/v1/bookmarks').then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedStatuses(response.data))
    dispatch(fetchBookmarkedStatusesSuccess(response.data, next ? next.uri : null))
  }).catch(error => {
    dispatch(fetchBookmarkedStatusesFail(error))
  })
}

const fetchBookmarkedStatusesRequest = () => ({
  type: BOOKMARKED_STATUSES_FETCH_REQUEST,
  skipLoading: true,
})

const fetchBookmarkedStatusesSuccess = (statuses, next) => ({
  type: BOOKMARKED_STATUSES_FETCH_SUCCESS,
  statuses,
  next,
  skipLoading: true,
})

const fetchBookmarkedStatusesFail = (error) => ({
  type: BOOKMARKED_STATUSES_FETCH_FAIL,
  error,
  skipLoading: true,
})

/**
 * 
 */
export const expandBookmarkedStatuses = () => (dispatch, getState) => {
  if (!me) return

  const url = getState().getIn(['status_lists', 'bookmarks', 'next'], null)

  if (url === null || getState().getIn(['status_lists', 'bookmarks', 'isLoading'])) {
    return
  }

  dispatch(expandBookmarkedStatusesRequest())

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedStatuses(response.data))
    dispatch(expandBookmarkedStatusesSuccess(response.data, next ? next.uri : null))
  }).catch(error => {
    dispatch(expandBookmarkedStatusesFail(error))
  })
}

const expandBookmarkedStatusesRequest = () => ({
  type: BOOKMARKED_STATUSES_EXPAND_REQUEST,
})

const expandBookmarkedStatusesSuccess = (statuses, next) => ({
  type: BOOKMARKED_STATUSES_EXPAND_SUCCESS,
  statuses,
  next,
})

const expandBookmarkedStatusesFail = (error) => ({
  type: BOOKMARKED_STATUSES_EXPAND_FAIL,
  error,
})
