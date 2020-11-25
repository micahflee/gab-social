import api, { getLinks } from '../api'
import {
  importFetchedAccounts,
  importFetchedStatus,
} from './importer'
import { fetchRelationships } from './accounts'
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

export const REPOSTS_EXPAND_REQUEST = 'REPOSTS_EXPAND_REQUEST'
export const REPOSTS_EXPAND_SUCCESS = 'REPOSTS_EXPAND_SUCCESS'
export const REPOSTS_EXPAND_FAIL    = 'REPOSTS_EXPAND_FAIL'

export const PIN_REQUEST = 'PIN_REQUEST'
export const PIN_SUCCESS = 'PIN_SUCCESS'
export const PIN_FAIL    = 'PIN_FAIL'

export const UNPIN_REQUEST = 'UNPIN_REQUEST'
export const UNPIN_SUCCESS = 'UNPIN_SUCCESS'
export const UNPIN_FAIL    = 'UNPIN_FAIL'

export const IS_PIN_REQUEST = 'IS_PIN_REQUEST'
export const IS_PIN_SUCCESS = 'IS_PIN_SUCCESS'
export const IS_PIN_FAIL    = 'IS_PIN_FAIL'

export const BOOKMARK_REQUEST = 'BOOKMARK_REQUEST'
export const BOOKMARK_SUCCESS = 'BOOKMARK_SUCCESS'
export const BOOKMARK_FAIL    = 'BOOKMARK_FAIL'

export const UNBOOKMARK_REQUEST = 'UNBOOKMARK_REQUEST'
export const UNBOOKMARK_SUCCESS = 'UNBOOKMARK_SUCCESS'
export const UNBOOKMARK_FAIL    = 'UNBOOKMARK_FAIL'

export const IS_BOOKMARK_REQUEST = 'IS_BOOKMARK_REQUEST'
export const IS_BOOKMARK_SUCCESS = 'IS_BOOKMARK_SUCCESS'
export const IS_BOOKMARK_FAIL    = 'IS_BOOKMARK_FAIL'

export const LIKES_FETCH_REQUEST = 'LIKES_FETCH_REQUEST'
export const LIKES_FETCH_SUCCESS = 'LIKES_FETCH_SUCCESS'
export const LIKES_FETCH_FAIL    = 'LIKES_FETCH_FAIL'

export const LIKES_EXPAND_REQUEST = 'LIKES_EXPAND_REQUEST'
export const LIKES_EXPAND_SUCCESS = 'LIKES_EXPAND_SUCCESS'
export const LIKES_EXPAND_FAIL    = 'LIKES_EXPAND_FAIL'

/**
 * @description Repost the given status. Set status to status.reblogged:true and
 *              increment status.reblogs_count by 1 on success.
 * @param {ImmutableMap} status
 */
export const repost = (status) => (dispatch, getState) => {
  if (!me || !status) return

  dispatch(repostRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/reblog`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(repostSuccess(status))
  }).catch((error) => {
    dispatch(repostFail(status, error))
  })
}

const repostRequest = (status) => ({
  type: REPOST_REQUEST,
  status,
})

const repostSuccess = (status) => ({
  type: REPOST_SUCCESS,
  status,
})

const repostFail = (status, error) => ({
  type: REPOST_FAIL,
  status,
  error,
})

/**
 * @description Unrepost the given status. Set status to status.reblogged:false and
 *              decrement status.reblogs_count by 1 on success.
 * @param {ImmutableMap} status
 */
export const unrepost = (status) => (dispatch, getState) => {
  if (!me || !status) return

  dispatch(unrepostRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/unreblog`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(unrepostSuccess(status))
  }).catch((error) => {
    dispatch(unrepostFail(status, error))
  })
}

const unrepostRequest = (status) => ({
  type: UNREPOST_REQUEST,
  status,
})

const unrepostSuccess = (status) => ({
  type: UNREPOST_SUCCESS,
  status,
})

const unrepostFail = (status, error) => ({
  type: UNREPOST_FAIL,
  status,
  error,
})

/**
 * @description Favorite the given status. Set status to status.favourited:true and
 *              increment status.favourites_count by 1 on success.
 * @param {ImmutableMap} status
 */
export const favorite = (status) => (dispatch, getState) => {
  if (!me || !status) return

  dispatch(favoriteRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/favourite`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(favoriteSuccess(response.data))
  }).catch((error) => {
    dispatch(favoriteFail(status, error))
  })
}

const favoriteRequest = (status) => ({
  type: FAVORITE_REQUEST,
  status,
})

const favoriteSuccess = (data) => ({
  type: FAVORITE_SUCCESS,
  data,
})

const favoriteFail = (status, error) => ({
  type: FAVORITE_FAIL,
  status,
  error,
})

/**
 * @description Unfavorite the given status. Set status to status.favourited:false and
 *              decrement status.favourites_count by 1 on success.
 * @param {ImmutableMap} status
 */
export const unfavorite = (status) => (dispatch, getState) => {
  if (!me || !status) return

  dispatch(unfavoriteRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/unfavourite`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(unfavoriteSuccess(status))
  }).catch((error) => {
    dispatch(unfavoriteFail(status, error))
  })
}

const unfavoriteRequest = (status) => ({
  type: UNFAVORITE_REQUEST,
  status,
})

const unfavoriteSuccess = (status) => ({
  type: UNFAVORITE_SUCCESS,
  status,
})

const unfavoriteFail = (status, error) => ({
  type: UNFAVORITE_FAIL,
  status,
  error,
})

/**
 * @description Pin the given status to your profile. Set status to status.pinned:true
 *              on success.
 * @param {ImmutableMap} status
 */
export const pin = (status) => (dispatch, getState) => {
  if (!me || !status) return

  dispatch(pinRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/pin`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(pinSuccess(status))
  }).catch((error) => {
    dispatch(pinFail(status, error))
  })
}

const pinRequest = (status) => ({
  type: PIN_REQUEST,
  status,
})

const pinSuccess = (status) => ({
  type: PIN_SUCCESS,
  status,
})

const pinFail = (status, error) => ({
  type: PIN_FAIL,
  status,
  error,
})

/**
 * @description Unpin the given status from your profile. Set status to status.pinned:false
 *              on success and remove from account pins in timeline reducer.
 * @param {ImmutableMap} status
 */
export const unpin = (status) => (dispatch, getState) => {
  if (!me || !status) return
  
  dispatch(unpinRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/unpin`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(unpinSuccess(status, response.data.account_id))
  }).catch((error) => {
    dispatch(unpinFail(status, error))
  })
}

const unpinRequest = (status) => ({
  type: UNPIN_REQUEST,
  status,
})

const unpinSuccess = (status, accountId) => ({
  type: UNPIN_SUCCESS,
  accountId,
  status,
})

const unpinFail = (status, error) => ({
  type: UNPIN_FAIL,
  status,
  error,
})

/**
 * @description Check if a status is pinned to the current user account.
 * @param {String} statusId
 */
export const isPin = (statusId) => (dispatch, getState) => {
  if (!me || !statusId) return

  dispatch(isPinRequest(statusId))

  api(getState).get(`/api/v1/statuses/${statusId}/pin`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(isPinSuccess(statusId))
  }).catch((error) => {
    dispatch(isPinFail(statusId, error))
  })
}

const isPinRequest = (statusId) => ({
  type: IS_PIN_REQUEST,
  statusId,
})

const isPinSuccess = (statusId) => ({
  type: IS_PIN_SUCCESS,
  statusId,
})

const isPinFail = (statusId, error) => ({
  type: IS_PIN_FAIL,
  statusId,
  error,
})

/**
 * @description Bookmark the given status in your profile if PRO. Set status to
 *              status.bookmarked:true on success.
 * @param {ImmutableMap} status
 */
export const bookmark = (status) => (dispatch, getState) => {
  if (!me || !status) return

  dispatch(bookmarkRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/bookmark`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(bookmarkSuccess(status))
  }).catch((error) => {
    dispatch(bookmarkFail(status, error))
  })
}

const bookmarkRequest = (status) => ({
  type: BOOKMARK_REQUEST,
  status,
})

const bookmarkSuccess = (status) => ({
  type: BOOKMARK_SUCCESS,
  status,
})

const bookmarkFail = (status, error) => ({
  type: BOOKMARK_FAIL,
  status,
  error,
})

/**
 * @description Unbookmark the given status in your profile if PRO. Set status to
 *              status.bookmarked:false on success.
 * @param {ImmutableMap} status
 */
export const unbookmark = (status) => (dispatch, getState) => {
  if (!me || !status) return
  
  dispatch(unbookmarkRequest(status))

  api(getState).post(`/api/v1/statuses/${status.get('id')}/unbookmark`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(unbookmarkSuccess(status))
  }).catch((error) => {
    dispatch(unbookmarkFail(status, error))
  })
}

const unbookmarkRequest = (status) => ({
  type: UNBOOKMARK_REQUEST,
  status,
})

const unbookmarkSuccess = (status) => ({
  type: UNBOOKMARK_SUCCESS,
  status,
})

const unbookmarkFail = (status, error) => ({
  type: UNBOOKMARK_FAIL,
  status,
  error,
})

/**
 * @description Check if a status is bookmarked to the current user account.
 * @param {String} statusId
 */
export const isBookmark = (statusId) => (dispatch, getState) => {
  if (!me || !statusId) return

  dispatch(isBookmarkRequest(statusId))

  api(getState).get(`/api/v1/statuses/${statusId}/bookmark`).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(isBookmarkSuccess(statusId))
  }).catch((error) => {
    dispatch(isBookmarkFail(statusId, error))
  })
}

const isBookmarkRequest = (statusId) => ({
  type: IS_BOOKMARK_REQUEST,
  statusId,
})

const isBookmarkSuccess = (statusId) => ({
  type: IS_BOOKMARK_SUCCESS,
  statusId,
})

const isBookmarkFail = (statusId, error) => ({
  type: IS_BOOKMARK_FAIL,
  statusId,
  error,
})

/**
 * @description Fetch reposts for the given statusId and imports paginated accounts
 *              and sets in user_lists reducer.
 * @param {String} statusId
 */
export const fetchReposts = (statusId) => (dispatch, getState) => {
  if (!me || !statusId) return

  dispatch(fetchRepostsRequest(statusId))

  api(getState).get(`/api/v1/statuses/${statusId}/reblogged_by`).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchRepostsSuccess(statusId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(fetchRepostsFail(statusId, error))
  })
}

const fetchRepostsRequest = (statusId) => ({
  type: REPOSTS_FETCH_REQUEST,
  statusId,
})

const fetchRepostsSuccess = (statusId, accounts, next) => ({
  type: REPOSTS_FETCH_SUCCESS,
  statusId,
  accounts,
  next,
})

const fetchRepostsFail = (statusId, error) => ({
  type: REPOSTS_FETCH_FAIL,
  statusId,
  error,
})

/**
 * @description Expand reposts for the given statusId and imports paginated accounts
 *              and sets in user_lists reducer.
 * @param {String} statusId
 */
export const expandReposts = (statusId) => (dispatch, getState) => {
  if (!me || !statusId) return

  const url = getState().getIn(['user_lists', 'reblogged_by', statusId, 'next'])
  const isLoading = getState().getIn(['user_lists', 'reblogged_by', statusId, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandRepostsRequest(statusId))

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(expandRepostsSuccess(statusId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch(error => dispatch(expandRepostsFail(error)))
}

const expandRepostsRequest = (statusId) => ({
  type: REPOSTS_EXPAND_REQUEST,
  statusId,
})

const expandRepostsSuccess = (statusId, accounts, next) => ({
  type: REPOSTS_EXPAND_SUCCESS,
  statusId,
  accounts,
  next,
})

const expandRepostsFail = (statusId, error) => ({
  type: REPOSTS_EXPAND_FAIL,
  statusId,
  error,
})


/**
 * @description Fetch likes for the given statusId and imports paginated accounts
 *              and sets in user_lists reducer.
 * @param {String} statusId
 */
export const fetchLikes = (statusId) => (dispatch, getState) => {
  if (!me || !statusId) return

  dispatch(fetchLikesRequest(statusId))

  api(getState).get(`/api/v1/statuses/${statusId}/favourited_by`).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchLikesSuccess(statusId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(fetchLikesFail(statusId, error))
  })
}

const fetchLikesRequest = (statusId) => ({
  type: LIKES_FETCH_REQUEST,
  statusId,
})

const fetchLikesSuccess = (statusId, accounts, next) => ({
  type: LIKES_FETCH_SUCCESS,
  statusId,
  accounts,
  next,
})

const fetchLikesFail = (statusId, error) => ({
  type: LIKES_FETCH_FAIL,
  statusId,
  error,
})

/**
 * @description Expand likes for the given statusId and imports paginated accounts
 *              and sets in user_lists reducer.
 * @param {String} statusId
 */
export const expandLikes = (statusId) => (dispatch, getState) => {
  if (!me || !statusId) return

  const url = getState().getIn(['user_lists', 'liked_by', statusId, 'next'])
  const isLoading = getState().getIn(['user_lists', 'liked_by', statusId, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandLikesRequest(statusId))

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(expandLikesSuccess(statusId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch(error => dispatch(expandLikesFail(error)))
}

const expandLikesRequest = (statusId) => ({
  type: LIKES_EXPAND_REQUEST,
  statusId,
})

const expandLikesSuccess = (statusId, accounts, next) => ({
  type: LIKES_EXPAND_SUCCESS,
  statusId,
  accounts,
  next,
})

const expandLikesFail = (statusId, error) => ({
  type: LIKES_EXPAND_FAIL,
  statusId,
  error,
})
