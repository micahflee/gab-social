import api, { getLinks } from '../api'
import openDB from '../storage/db'
import {
  importAccount,
  importFetchedAccount,
  importFetchedAccounts,
  importErrorWhileFetchingAccountByUsername,
} from './importer'
import { me } from '../initial_state'

export const ACCOUNT_FETCH_REQUEST = 'ACCOUNT_FETCH_REQUEST'
export const ACCOUNT_FETCH_SUCCESS = 'ACCOUNT_FETCH_SUCCESS'
export const ACCOUNT_FETCH_FAIL    = 'ACCOUNT_FETCH_FAIL'

export const ACCOUNT_FOLLOW_REQUEST = 'ACCOUNT_FOLLOW_REQUEST'
export const ACCOUNT_FOLLOW_SUCCESS = 'ACCOUNT_FOLLOW_SUCCESS'
export const ACCOUNT_FOLLOW_FAIL    = 'ACCOUNT_FOLLOW_FAIL'

export const ACCOUNT_UNFOLLOW_REQUEST = 'ACCOUNT_UNFOLLOW_REQUEST'
export const ACCOUNT_UNFOLLOW_SUCCESS = 'ACCOUNT_UNFOLLOW_SUCCESS'
export const ACCOUNT_UNFOLLOW_FAIL    = 'ACCOUNT_UNFOLLOW_FAIL'

export const ACCOUNT_BLOCK_SUCCESS = 'ACCOUNT_BLOCK_SUCCESS'
export const ACCOUNT_BLOCK_FAIL    = 'ACCOUNT_BLOCK_FAIL'

export const ACCOUNT_UNBLOCK_REQUEST = 'ACCOUNT_UNBLOCK_REQUEST'
export const ACCOUNT_UNBLOCK_SUCCESS = 'ACCOUNT_UNBLOCK_SUCCESS'
export const ACCOUNT_UNBLOCK_FAIL    = 'ACCOUNT_UNBLOCK_FAIL'

export const ACCOUNT_MUTE_REQUEST = 'ACCOUNT_MUTE_REQUEST'
export const ACCOUNT_MUTE_SUCCESS = 'ACCOUNT_MUTE_SUCCESS'
export const ACCOUNT_MUTE_FAIL    = 'ACCOUNT_MUTE_FAIL'

export const ACCOUNT_UNMUTE_REQUEST = 'ACCOUNT_UNMUTE_REQUEST'
export const ACCOUNT_UNMUTE_SUCCESS = 'ACCOUNT_UNMUTE_SUCCESS'
export const ACCOUNT_UNMUTE_FAIL    = 'ACCOUNT_UNMUTE_FAIL'

export const FOLLOWERS_FETCH_REQUEST = 'FOLLOWERS_FETCH_REQUEST'
export const FOLLOWERS_FETCH_SUCCESS = 'FOLLOWERS_FETCH_SUCCESS'
export const FOLLOWERS_FETCH_FAIL    = 'FOLLOWERS_FETCH_FAIL'

export const FOLLOWERS_EXPAND_REQUEST = 'FOLLOWERS_EXPAND_REQUEST'
export const FOLLOWERS_EXPAND_SUCCESS = 'FOLLOWERS_EXPAND_SUCCESS'
export const FOLLOWERS_EXPAND_FAIL    = 'FOLLOWERS_EXPAND_FAIL'

export const FOLLOWING_FETCH_REQUEST = 'FOLLOWING_FETCH_REQUEST'
export const FOLLOWING_FETCH_SUCCESS = 'FOLLOWING_FETCH_SUCCESS'
export const FOLLOWING_FETCH_FAIL    = 'FOLLOWING_FETCH_FAIL'

export const FOLLOWING_EXPAND_REQUEST = 'FOLLOWING_EXPAND_REQUEST'
export const FOLLOWING_EXPAND_SUCCESS = 'FOLLOWING_EXPAND_SUCCESS'
export const FOLLOWING_EXPAND_FAIL    = 'FOLLOWING_EXPAND_FAIL'

export const RELATIONSHIPS_FETCH_REQUEST = 'RELATIONSHIPS_FETCH_REQUEST'
export const RELATIONSHIPS_FETCH_SUCCESS = 'RELATIONSHIPS_FETCH_SUCCESS'
export const RELATIONSHIPS_FETCH_FAIL    = 'RELATIONSHIPS_FETCH_FAIL'

export const FOLLOW_REQUESTS_FETCH_REQUEST = 'FOLLOW_REQUESTS_FETCH_REQUEST'
export const FOLLOW_REQUESTS_FETCH_SUCCESS = 'FOLLOW_REQUESTS_FETCH_SUCCESS'
export const FOLLOW_REQUESTS_FETCH_FAIL    = 'FOLLOW_REQUESTS_FETCH_FAIL'

export const FOLLOW_REQUESTS_EXPAND_REQUEST = 'FOLLOW_REQUESTS_EXPAND_REQUEST'
export const FOLLOW_REQUESTS_EXPAND_SUCCESS = 'FOLLOW_REQUESTS_EXPAND_SUCCESS'
export const FOLLOW_REQUESTS_EXPAND_FAIL    = 'FOLLOW_REQUESTS_EXPAND_FAIL'

export const FOLLOW_REQUEST_AUTHORIZE_REQUEST = 'FOLLOW_REQUEST_AUTHORIZE_REQUEST'
export const FOLLOW_REQUEST_AUTHORIZE_SUCCESS = 'FOLLOW_REQUEST_AUTHORIZE_SUCCESS'
export const FOLLOW_REQUEST_AUTHORIZE_FAIL    = 'FOLLOW_REQUEST_AUTHORIZE_FAIL'

export const FOLLOW_REQUEST_REJECT_REQUEST = 'FOLLOW_REQUEST_REJECT_REQUEST'
export const FOLLOW_REQUEST_REJECT_SUCCESS = 'FOLLOW_REQUEST_REJECT_SUCCESS'
export const FOLLOW_REQUEST_REJECT_FAIL    = 'FOLLOW_REQUEST_REJECT_FAIL'

/**
 * 
 */
function getFromDB(dispatch, getState, index, id) {
  return new Promise((resolve, reject) => {
    const request = index.get(id)

    request.onerror = reject

    request.onsuccess = () => {
      if (!request.result) {
        reject()
        return
      }

      dispatch(importAccount(request.result))
      resolve(request.result.moved && getFromDB(dispatch, getState, index, request.result.moved))
    }
  })
}

/**
 * 
 */
export const fetchAccount = (id) => (dispatch, getState) => {
  if (id === -1 || getState().getIn(['accounts', id], null) !== null) return
  if (!id) return

  dispatch(fetchRelationships([id]))
  dispatch(fetchAccountRequest(id))

  openDB().then((db) => getFromDB(
    dispatch,
    getState,
    db.transaction('accounts', 'read').objectStore('accounts').index('id'),
    id
  ).then(() => db.close(), (error) => {
    db.close()
    throw error
  })).catch(() => api(getState).get(`/api/v1/accounts/${id}`).then((response) => {
    dispatch(importFetchedAccount(response.data))
  })).then(() => {
    dispatch(fetchAccountSuccess())
  }).catch((error) => {
    dispatch(fetchAccountFail(id, error))
  })
}

/**
 * 
 */
export const fetchAccountByUsername = (username) => (dispatch, getState) => {
  if (!username) return

  api(getState).get(`/api/v1/account_by_username/${username}`).then((response) => {
    dispatch(importFetchedAccount(response.data))
    dispatch(fetchRelationships([response.data.id]))
  }).then(() => {
    dispatch(fetchAccountSuccess())
  }).catch((error) => {
    dispatch(fetchAccountFail(null, error))
    dispatch(importErrorWhileFetchingAccountByUsername(username))
  })
}

const fetchAccountRequest = (id) => ({
  type: ACCOUNT_FETCH_REQUEST,
  id,
})

const fetchAccountSuccess = () => ({
  type: ACCOUNT_FETCH_SUCCESS,
})

const fetchAccountFail = (id, error) => ({
  type: ACCOUNT_FETCH_FAIL,
  id,
  error,
})

/**
 * 
 */
export const followAccount = (id, reblogs = true) => (dispatch, getState) => {
  if (!me) return

  const alreadyFollowing = getState().getIn(['relationships', id, 'following'])
  const locked = getState().getIn(['accounts', id, 'locked'], false)

  dispatch(followAccountRequest(id, locked))

  api(getState).post(`/api/v1/accounts/${id}/follow`, { reblogs }).then((response) => {
    dispatch(followAccountSuccess(response.data, alreadyFollowing))
  }).catch((error) => {
    dispatch(followAccountFail(error, locked))
  })
}

const followAccountRequest = (id, locked) => ({
  type: ACCOUNT_FOLLOW_REQUEST,
  id,
  locked,
})

const followAccountSuccess = (relationship, alreadyFollowing) => ({
  type: ACCOUNT_FOLLOW_SUCCESS,
  showToast: true,
  relationship,
  alreadyFollowing,
})

const followAccountFail = (error, locked) => ({
  type: ACCOUNT_FOLLOW_FAIL,
  showToast: true,
  error,
  locked,
})

/**
 * 
 */
export const unfollowAccount = (id) => (dispatch, getState) => {
  if (!me) return

  dispatch(unfollowAccountRequest(id))

  api(getState).post(`/api/v1/accounts/${id}/unfollow`).then((response) => {
    dispatch(unfollowAccountSuccess(response.data, getState().get('statuses')))
  }).catch((error) => {
    dispatch(unfollowAccountFail(error))
  })
}

const unfollowAccountRequest = (id) => ({
  type: ACCOUNT_UNFOLLOW_REQUEST,
  id,
})

const unfollowAccountSuccess = (relationship, statuses) => ({
  type: ACCOUNT_UNFOLLOW_SUCCESS,
  showToast: true,
  relationship,
  statuses,
})

const unfollowAccountFail = (error) => ({
  type: ACCOUNT_UNFOLLOW_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const blockAccount = (id) => (dispatch, getState) => {
  if (!me) return

  dispatch(blockAccountRequest(id))

  api(getState).post(`/api/v1/accounts/${id}/block`).then((response) => {
    // : todo : remove gay stuff like passing entire status below:
    // Pass in entire statuses map so we can use it to filter stuff in different parts of the reducers
    dispatch(blockAccountSuccess(response.data, getState().get('statuses')))
  }).catch((error) => {
    dispatch(blockAccountFail(id, error))
  })
}

const blockAccountRequest = (id) => ({
  type: ACCOUNT_BLOCK_REQUEST,
  id,
})

const blockAccountSuccess = (relationship, statuses) => ({
  type: ACCOUNT_BLOCK_SUCCESS,
  showToast: true,
  relationship,
  statuses,
})

const blockAccountFail = (error) => ({
  type: ACCOUNT_BLOCK_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const unblockAccount = (id) => (dispatch, getState) => {
  if (!me) return

  dispatch(unblockAccountRequest(id))

  api(getState).post(`/api/v1/accounts/${id}/unblock`).then((response) => {
    dispatch(unblockAccountSuccess(response.data))
  }).catch((error) => {
    dispatch(unblockAccountFail(id, error))
  })
}

const unblockAccountRequest = (id) => ({
  type: ACCOUNT_UNBLOCK_REQUEST,
  id,
})

const unblockAccountSuccess = (relationship) => ({
  type: ACCOUNT_UNBLOCK_SUCCESS,
  showToast: true,
  relationship,
})

const unblockAccountFail = (error) => ({
  type: ACCOUNT_UNBLOCK_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const muteAccount = (id, notifications) => (dispatch, getState) => {
  if (!me) return

  dispatch(muteAccountRequest(id))

  api(getState).post(`/api/v1/accounts/${id}/mute`, { notifications }).then((response) => {
    // Pass in entire statuses map so we can use it to filter stuff in different parts of the reducers
    dispatch(muteAccountSuccess(response.data, getState().get('statuses')))
  }).catch((error) => {
    dispatch(muteAccountFail(id, error))
  })
}

const muteAccountRequest = (id) => ({
  type: ACCOUNT_MUTE_REQUEST,
  id,
})

const muteAccountSuccess = (relationship, statuses) => ({
  type: ACCOUNT_MUTE_SUCCESS,
  showToast: true,
  relationship,
  statuses,
})

const muteAccountFail = (error) => ({
  type: ACCOUNT_MUTE_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const unmuteAccount = (id) => (dispatch, getState) => {
  if (!me) return

  dispatch(unmuteAccountRequest(id))

  api(getState).post(`/api/v1/accounts/${id}/unmute`).then((response) => {
    dispatch(unmuteAccountSuccess(response.data))
  }).catch((error) => {
    dispatch(unmuteAccountFail(id, error))
  })
}

const unmuteAccountRequest = (id) => ({
  type: ACCOUNT_UNMUTE_REQUEST,
  id,
})

const unmuteAccountSuccess = (relationship) => ({
  type: ACCOUNT_UNMUTE_SUCCESS,
  showToast: true,
  relationship,
})

const unmuteAccountFail = (error) => ({
  type: ACCOUNT_UNMUTE_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const fetchFollowers = (id) => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchFollowersRequest(id))

  api(getState).get(`/api/v1/accounts/${id}/followers`).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchFollowersSuccess(id, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(fetchFollowersFail(id, error))
  })
}

const fetchFollowersRequest = (id) => ({
  type: FOLLOWERS_FETCH_REQUEST,
  id,
})

const fetchFollowersSuccess = (id, accounts, next) => ({
  type: FOLLOWERS_FETCH_SUCCESS,
  id,
  accounts,
  next,
})

const fetchFollowersFail = (id, error) => ({
  type: FOLLOWERS_FETCH_FAIL,
  showToast: true,
  id,
  error,
})

/**
 * 
 */
export const expandFollowers = (id) => (dispatch, getState) => {
  if (!me) return

  const url = getState().getIn(['user_lists', 'followers', id, 'next'])
  const isLoading = getState().getIn(['user_lists', 'followers', id, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandFollowersRequest(id))

  api(getState).get(url).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(expandFollowersSuccess(id, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(expandFollowersFail(id, error))
  })
}

const expandFollowersRequest = (id) => ({
  type: FOLLOWERS_EXPAND_REQUEST,
  id,
})

const expandFollowersSuccess = (id, accounts, next) => ({
  type: FOLLOWERS_EXPAND_SUCCESS,
  id,
  accounts,
  next,
})

const expandFollowersFail = (id, error) => ({
  type: FOLLOWERS_EXPAND_FAIL,
  showToast: true,
  id,
  error,
})

/**
 * 
 */
export const fetchFollowing = (id) => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchFollowingRequest(id))

  api(getState).get(`/api/v1/accounts/${id}/following`).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchFollowingSuccess(id, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(fetchFollowingFail(id, error))
  })
}

const fetchFollowingRequest = (id) => ({
  type: FOLLOWING_FETCH_REQUEST,
  id,
})

const fetchFollowingSuccess = (id, accounts, next) => ({
  type: FOLLOWING_FETCH_SUCCESS,
  id,
  accounts,
  next,
})

const fetchFollowingFail = (id, error) => ({
  type: FOLLOWING_FETCH_FAIL,
  showToast: true,
  id,
  error,
})

/**
 * 
 */
export const expandFollowing = (id) => (dispatch, getState) => {
  if (!me) return

  const url = getState().getIn(['user_lists', 'following', id, 'next'])
  const isLoading = getState().getIn(['user_lists', 'following', id, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandFollowingRequest(id))

  api(getState).get(url).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(expandFollowingSuccess(id, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(expandFollowingFail(id, error))
  })
}

const expandFollowingRequest = (id) => ({
  type: FOLLOWING_EXPAND_REQUEST,
  id,
})

const expandFollowingSuccess = (id, accounts, next) => ({
  type: FOLLOWING_EXPAND_SUCCESS,
  id,
  accounts,
  next,
})

const expandFollowingFail = (id, error) => ({
  type: FOLLOWING_EXPAND_FAIL,
  showToast: true,
  id,
  error,
})

/**
 * 
 */
export const fetchRelationships = (accountIds) => (dispatch, getState) => {
  if (!me) return

  const loadedRelationships = getState().get('relationships')
  let newAccountIds = accountIds.filter((id) => {
    if (id === me) return false
    return loadedRelationships.get(id, null) === null
  })

  if (newAccountIds.length === 0) return
  
  if (newAccountIds.length == 1) {
    const firstId = newAccountIds[0]
    if (me === firstId) return
  }

  // Unique
  newAccountIds = Array.from(new Set(newAccountIds))

  dispatch(fetchRelationshipsRequest(newAccountIds))

  api(getState).get(`/api/v1/accounts/relationships?${newAccountIds.map(id => `id[]=${id}`).join('&')}`).then((response) => {
    dispatch(fetchRelationshipsSuccess(response.data))
  }).catch((error) => {
    dispatch(fetchRelationshipsFail(error))
  })
}

const fetchRelationshipsRequest = (ids) => ({
  type: RELATIONSHIPS_FETCH_REQUEST,
  ids,
})

const fetchRelationshipsSuccess = (relationships) => ({
  type: RELATIONSHIPS_FETCH_SUCCESS,
  relationships,
})

const fetchRelationshipsFail = (error) => ({
  type: RELATIONSHIPS_FETCH_FAIL,
  error,
})

/**
 * 
 */
export const fetchFollowRequests = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchFollowRequestsRequest())

  api(getState).get('/api/v1/follow_requests').then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchFollowRequestsSuccess(response.data, next ? next.uri : null))
  }).catch((error) => dispatch(fetchFollowRequestsFail(error)))
}

const fetchFollowRequestsRequest = () => ({
  type: FOLLOW_REQUESTS_FETCH_REQUEST,
})

const fetchFollowRequestsSuccess = (accounts, next) => ({
  type: FOLLOW_REQUESTS_FETCH_SUCCESS,
  accounts,
  next,
})

const fetchFollowRequestsFail = (error) => ({
  type: FOLLOW_REQUESTS_FETCH_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const expandFollowRequests = () => (dispatch, getState) => {
  if (!me) return

  const url = getState().getIn(['user_lists', 'follow_requests', me, 'next'])
  const isLoading = getState().getIn(['user_lists', 'follow_requests', me, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandFollowRequestsRequest())

  api(getState).get(url).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(expandFollowRequestsSuccess(response.data, next ? next.uri : null))
  }).catch((error) => dispatch(expandFollowRequestsFail(error)))
}

const expandFollowRequestsRequest = () => ({
  type: FOLLOW_REQUESTS_EXPAND_REQUEST,
})

const expandFollowRequestsSuccess = (accounts, next) => ({
  type: FOLLOW_REQUESTS_EXPAND_SUCCESS,
  accounts,
  next,
})

const expandFollowRequestsFail = (error) => ({
  type: FOLLOW_REQUESTS_EXPAND_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const authorizeFollowRequest = (id) => (dispatch, getState) => {
  if (!me) return

  dispatch(authorizeFollowRequestRequest(id))

  api(getState)
    .post(`/api/v1/follow_requests/${id}/authorize`)
    .then(() => dispatch(authorizeFollowRequestSuccess(id)))
    .catch((error) => dispatch(authorizeFollowRequestFail(id, error)))
}

const authorizeFollowRequestRequest = (id) => ({
  type: FOLLOW_REQUEST_AUTHORIZE_REQUEST,
  id,
})

const authorizeFollowRequestSuccess = (id) => ({
  type: FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  showToast: true,
  id,
})

const authorizeFollowRequestFail = (id, error) => ({
  type: FOLLOW_REQUEST_AUTHORIZE_FAIL,
  showToast: true,
  id,
  error,
})

/**
 * 
 */
export const rejectFollowRequest = (id) => (dispatch, getState) => {
  if (!me) return

  dispatch(rejectFollowRequestRequest(id))

  api(getState)
    .post(`/api/v1/follow_requests/${id}/reject`)
    .then(() => dispatch(rejectFollowRequestSuccess(id)))
    .catch((error) => dispatch(rejectFollowRequestFail(id, error)))
}

const rejectFollowRequestRequest = (id) => ({
  type: FOLLOW_REQUEST_REJECT_REQUEST,
  id,
})

const rejectFollowRequestSuccess = (id) => ({
  type: FOLLOW_REQUEST_REJECT_SUCCESS,
  showToast: true,
  id,
})

const rejectFollowRequestFail = (id, error) => ({
  type: FOLLOW_REQUEST_REJECT_FAIL,
  showToast: true,
  id,
  error,
})

