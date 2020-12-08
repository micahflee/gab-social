import api, { getLinks } from '../api'
import { importFetchedStatuses } from './importer'
import { me } from '../initial_state'

export const FAVORITED_STATUSES_FETCH_REQUEST = 'FAVORITED_STATUSES_FETCH_REQUEST'
export const FAVORITED_STATUSES_FETCH_SUCCESS = 'FAVORITED_STATUSES_FETCH_SUCCESS'
export const FAVORITED_STATUSES_FETCH_FAIL = 'FAVORITED_STATUSES_FETCH_FAIL'

export const FAVORITED_STATUSES_EXPAND_REQUEST = 'FAVORITED_STATUSES_EXPAND_REQUEST'
export const FAVORITED_STATUSES_EXPAND_SUCCESS = 'FAVORITED_STATUSES_EXPAND_SUCCESS'
export const FAVORITED_STATUSES_EXPAND_FAIL = 'FAVORITED_STATUSES_EXPAND_FAIL'

/**
 * 
 */
export const fetchFavoritedStatuses = () => (dispatch, getState) => {
  if (!me) return

  if (getState().getIn(['status_lists', 'favorites', 'isLoading'])) {
    return
  }

  dispatch(fetchFavoritedStatusesRequest())

  api(getState).get('/api/v1/favourites').then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedStatuses(response.data))
    dispatch(fetchFavoritedStatusesSuccess(response.data, next ? next.uri : null))
  }).catch(error => {
    dispatch(fetchFavoritedStatusesFail(error))
  })
}

const fetchFavoritedStatusesRequest = () => ({
  type: FAVORITED_STATUSES_FETCH_REQUEST,
})

const fetchFavoritedStatusesSuccess = (statuses, next) => ({
  type: FAVORITED_STATUSES_FETCH_SUCCESS,
  statuses,
  next,
})

const fetchFavoritedStatusesFail = (error) => ({
  type: FAVORITED_STATUSES_FETCH_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const expandFavoritedStatuses = () => (dispatch, getState) => {
  if (!me) return

  const url = getState().getIn(['status_lists', 'favorites', 'next'], null)

  if (url === null || getState().getIn(['status_lists', 'favorites', 'isLoading'])) {
    return
  }

  dispatch(expandFavoritedStatusesRequest())

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedStatuses(response.data))
    dispatch(expandFavoritedStatusesSuccess(response.data, next ? next.uri : null))
  }).catch(error => {
    dispatch(expandFavoritedStatusesFail(error))
  })
}

const expandFavoritedStatusesRequest = () => ({
  type: FAVORITED_STATUSES_EXPAND_REQUEST,
})

const expandFavoritedStatusesSuccess = (statuses, next) => ({
  type: FAVORITED_STATUSES_EXPAND_SUCCESS,
  statuses,
  next,
})

const expandFavoritedStatusesFail = (error) => ({
  type: FAVORITED_STATUSES_EXPAND_FAIL,
  showToast: true,
  error,
})