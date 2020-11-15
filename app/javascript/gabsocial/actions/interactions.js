import api from '../api'
import { importFetchedAccounts, importFetchedStatus } from './importer'
import { updateStatusStats } from './statuses'
import { me } from '../initial_state'

export const REPOST_REQUEST = 'REPOST_REQUEST'
export const REPOST_SUCCESS = 'REPOST_SUCCESS'
export const REPOST_FAIL    = 'REPOST_FAIL'

export const FAVORITE_REQUEST = 'FAVORITE_REQUEST'
export const FAVORITE_SUCCESS = 'FAVORITE_SUCCESS'
export const FAVORITE_FAIL    = 'FAVORITE_FAIL'

export const UNREPOST_REQUEST = 'UNREPOST_REQUEST'
export const UNREPOST_SUCCESS = 'UNREPOST_SUCCESS'
export const UNREPOST_FAIL    = 'UNREPOST_FAIL'

export const UNFAVORITE_REQUEST = 'UNFAVORITE_REQUEST'
export const UNFAVORITE_SUCCESS = 'UNFAVORITE_SUCCESS'
export const UNFAVORITE_FAIL    = 'UNFAVORITE_FAIL'

export const REPOSTS_FETCH_REQUEST = 'REPOSTS_FETCH_REQUEST'
export const REPOSTS_FETCH_SUCCESS = 'REPOSTS_FETCH_SUCCESS'
export const REPOSTS_FETCH_FAIL    = 'REPOSTS_FETCH_FAIL'

export const PIN_REQUEST = 'PIN_REQUEST'
export const PIN_SUCCESS = 'PIN_SUCCESS'
export const PIN_FAIL    = 'PIN_FAIL'

export const UNPIN_REQUEST = 'UNPIN_REQUEST'
export const UNPIN_SUCCESS = 'UNPIN_SUCCESS'
export const UNPIN_FAIL    = 'UNPIN_FAIL'

export const BOOKMARK_REQUEST = 'BOOKMARK_REQUEST'
export const BOOKMARK_SUCCESS = 'BOOKMARK_SUCCESS'
export const BOOKMARK_FAIL    = 'BOOKMARK_FAIL'

export const UNBOOKMARK_REQUEST = 'UNBOOKMARK_REQUEST'
export const UNBOOKMARK_SUCCESS = 'UNBOOKMARK_SUCCESS'
export const UNBOOKMARK_FAIL    = 'UNBOOKMARK_FAIL'

export const LIKES_FETCH_REQUEST = 'LIKES_FETCH_REQUEST'
export const LIKES_FETCH_SUCCESS = 'LIKES_FETCH_SUCCESS'
export const LIKES_FETCH_FAIL    = 'LIKES_FETCH_FAIL'

/**
 * 
 */
export const repost = (status) => (dispatch, getState) => {
  if (!me) return

  dispatch(repostRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/reblog`).then((response) => {
    // The reblog API method returns a new status wrapped around the original. In this case we are only
    // interested in how the original is modified, hence passing it skipping the wrapper
    dispatch(importFetchedStatus(response.data.reblog))
    dispatch(repostSuccess(status))
  }).catch((error) => {
    dispatch(repostFail(status, error))
  })
}

export const repostRequest = (status) => ({
  type: REPOST_REQUEST,
  status: status,
  skipLoading: true,
})

export const repostSuccess = (status) => ({
  type: REPOST_SUCCESS,
  status: status,
  skipLoading: true,
})

export const repostFail = (status, error) => ({
  type: REPOST_FAIL,
  status: status,
  error: error,
  skipLoading: true,
})

/**
 * 
 */
export const unrepost = (status) => (dispatch, getState) => {
  if (!me) return

  dispatch(unrepostRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/unreblog`).then((response) => {
    dispatch(importFetchedStatus(response.data))
    dispatch(unrepostSuccess(status))
  }).catch((error) => {
    dispatch(unrepostFail(status, error))
  })
}

export const unrepostRequest = (status) => ({
  type: UNREPOST_REQUEST,
  status: status,
  skipLoading: true,
})

export const unrepostSuccess = (status) => ({
  type: UNREPOST_SUCCESS,
  status: status,
  skipLoading: true,
})

export const unrepostFail = (status, error) => ({
  type: UNREPOST_FAIL,
  status: status,
  error: error,
  skipLoading: true,
})

/**
 * 
 */
export const favorite = (status) => (dispatch, getState) => {
  if (!me) return

  dispatch(favoriteRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/favourite`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(favoriteSuccess(status))
  }).catch((error) => {
    dispatch(favoriteFail(status, error))
  })
}

export const favoriteRequest = (status) => ({
  type: FAVORITE_REQUEST,
  status: status,
  skipLoading: true,
})

export const favoriteSuccess = (status) => ({
  type: FAVORITE_SUCCESS,
  status: status,
  skipLoading: true,
})

export const favoriteFail = (status, error) => ({
  type: FAVORITE_FAIL,
  status: status,
  error: error,
  skipLoading: true,
})

/**
 * 
 */
export const unfavorite = (status) => (dispatch, getState) => {
  if (!me) return

  dispatch(unfavoriteRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/unfavourite`).then((response) => {
    dispatch(importFetchedStatus(response.data))
    dispatch(unfavoriteSuccess(status))
  }).catch((error) => {
    dispatch(unfavoriteFail(status, error))
  })
}

export const unfavoriteRequest = (status) => ({
  type: UNFAVORITE_REQUEST,
  status: status,
  skipLoading: true,
})

export const unfavoriteSuccess = (status) => ({
  type: UNFAVORITE_SUCCESS,
  status: status,
  skipLoading: true,
})

export const unfavoriteFail = (status, error) => ({
  type: UNFAVORITE_FAIL,
  status: status,
  error: error,
  skipLoading: true,
})

/**
 * 
 */
export const fetchReposts = (id) => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchRepostsRequest(id))

  api(getState).get(`/api/v1/statuses/${id}/reblogged_by`).then((response) => {
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchRepostsSuccess(id, response.data))
  }).catch((error) => {
    dispatch(fetchRepostsFail(id, error))
  })
}

export const fetchRepostsRequest = (id) => ({
  type: REPOSTS_FETCH_REQUEST,
  id,
})

export const fetchRepostsSuccess = (id, accounts) => ({
  type: REPOSTS_FETCH_SUCCESS,
  id,
  accounts,
})

export const fetchRepostsFail = (id, error) => ({
  type: REPOSTS_FETCH_FAIL,
  error,
})

/**
 * 
 */
export const pin = (status) => (dispatch, getState) => {
  if (!me) return

  dispatch(pinRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/pin`).then((response) => {
    dispatch(importFetchedStatus(response.data))
    dispatch(pinSuccess(status))
  }).catch((error) => {
    dispatch(pinFail(status, error))
  })
}

export const pinRequest = (status) => ({
  type: PIN_REQUEST,
  status,
  skipLoading: true,
})

export const pinSuccess = (status) => ({
  type: PIN_SUCCESS,
  status,
  skipLoading: true,
})

export const pinFail = (status, error) => ({
  type: PIN_FAIL,
  status,
  error,
  skipLoading: true,
})

/**
 * 
 */
export const unpin = (status) => (dispatch, getState) => {
  if (!me) return
  
  dispatch(unpinRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/unpin`).then((response) => {
    dispatch(importFetchedStatus(response.data))
    dispatch(unpinSuccess(status))
  }).catch((error) => {
    dispatch(unpinFail(status, error))
  })
}

export const unpinRequest = (status) => ({
  type: UNPIN_REQUEST,
  status,
  skipLoading: true,
})

export const unpinSuccess = (status) => ({
  type: UNPIN_SUCCESS,
  status,
  skipLoading: true,
})

export const unpinFail = (status, error) => ({
  type: UNPIN_FAIL,
  status,
  error,
  skipLoading: true,
})

/**
 * 
 */
export const fetchLikes = (id) => (dispatch, getState) => {
  dispatch(fetchLikesRequest(id))

  api(getState).get(`/api/v1/statuses/${id}/favourited_by`).then((response) => {
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchLikesSuccess(id, response.data))
  }).catch((error) => {
    dispatch(fetchLikesFail(id, error))
  })
}

export const fetchLikesRequest = (id) => ({
  type: LIKES_FETCH_REQUEST,
  id,
})

export const fetchLikesSuccess = (id, accounts) => ({
  type: LIKES_FETCH_SUCCESS,
  id,
  accounts,
})

export const fetchLikesFail = (id, error) => ({
  type: LIKES_FETCH_FAIL,
  error,
})

/**
 * 
 */
export const bookmark = (status) => (dispatch, getState) => {
  dispatch(bookmarkRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/bookmark`).then((response) => {
    dispatch(importFetchedStatus(response.data))
    dispatch(bookmarkSuccess(status, response.data))
  }).catch((error) => {
    dispatch(bookmarkFail(status, error))
  })
}

export const bookmarkRequest = (status) => ({
  type: BOOKMARK_REQUEST,
  status: status,
})

export const bookmarkSuccess = (status, response) => ({
  type: BOOKMARK_SUCCESS,
  status: status,
  response: response,
})

export const bookmarkFail = (status, error) => ({
  type: BOOKMARK_FAIL,
  status: status,
  error: error,
})

/**
 * 
 */
export const unbookmark = (status) => (dispatch, getState) => {
  dispatch(unbookmarkRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/unbookmark`).then((response) => {
    dispatch(importFetchedStatus(response.data))
    dispatch(unbookmarkSuccess(status, response.data))
  }).catch((error) => {
    dispatch(unbookmarkFail(status, error))
  })
}

export const unbookmarkRequest = (status) => ({
  type: UNBOOKMARK_REQUEST,
  status: status,
})

export const unbookmarkSuccess = (status, response) => ({
  type: UNBOOKMARK_SUCCESS,
  status: status,
  response: response,
})

export const unbookmarkFail = (status, error) => ({
  type: UNBOOKMARK_FAIL,
  status: status,
  error: error,
})