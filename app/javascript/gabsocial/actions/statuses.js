import debounce from 'lodash.debounce'
import api from '../api'
import openDB from '../storage/db'
import { evictStatus } from '../storage/modifier'
import { deleteFromTimelines } from './timelines'
import { importFetchedStatus, importFetchedStatuses, importAccount, importStatus } from './importer'
import { openModal } from './modal'
import { me } from '../initial_state'

export const STATUS_FETCH_REQUEST = 'STATUS_FETCH_REQUEST'
export const STATUS_FETCH_SUCCESS = 'STATUS_FETCH_SUCCESS'
export const STATUS_FETCH_FAIL    = 'STATUS_FETCH_FAIL'

export const STATUS_DELETE_REQUEST = 'STATUS_DELETE_REQUEST'
export const STATUS_DELETE_SUCCESS = 'STATUS_DELETE_SUCCESS'
export const STATUS_DELETE_FAIL    = 'STATUS_DELETE_FAIL'

export const CONTEXT_FETCH_REQUEST = 'CONTEXT_FETCH_REQUEST'
export const CONTEXT_FETCH_SUCCESS = 'CONTEXT_FETCH_SUCCESS'
export const CONTEXT_FETCH_FAIL    = 'CONTEXT_FETCH_FAIL'

export const COMMENTS_FETCH_REQUEST = 'COMMENTS_FETCH_REQUEST'
export const COMMENTS_FETCH_SUCCESS = 'COMMENTS_FETCH_SUCCESS'
export const COMMENTS_FETCH_FAIL    = 'COMMENTS_FETCH_FAIL'

export const STATUS_REVEAL = 'STATUS_REVEAL'
export const STATUS_HIDE   = 'STATUS_HIDE'

export const STATUS_EDIT = 'STATUS_EDIT'

export const UPDATE_STATUS_STATS = 'UPDATE_STATUS_STATS'

/**
 * 
 */
function getFromDB(dispatch, getState, accountIndex, index, id) {
  return new Promise((resolve, reject) => {
    const request = index.get(id)

    request.onerror = reject

    request.onsuccess = () => {
      const promises = []

      if (!request.result) {
        reject()
        return
      }

      dispatch(importStatus(request.result))

      if (getState().getIn(['accounts', request.result.account], null) === null) {
        promises.push(new Promise((accountResolve, accountReject) => {
          const accountRequest = accountIndex.get(request.result.account)

          accountRequest.onerror = accountReject
          accountRequest.onsuccess = () => {
            if (!request.result) {
              accountReject()
              return
            }

            dispatch(importAccount(accountRequest.result))
            accountResolve()
          }
        }))
      }

      if (request.result.reblog && getState().getIn(['statuses', request.result.reblog], null) === null) {
        promises.push(getFromDB(dispatch, getState, accountIndex, index, request.result.reblog))
      }

      resolve(Promise.all(promises))
    }
  })
}

/**
 * 
 */
export const fetchStatus = (id) => (dispatch, getState) => {
  if (!id) return
  
  const skipLoading = getState().getIn(['statuses', id], null) !== null
  if (skipLoading) return

  dispatch(fetchStatusRequest(id, skipLoading))

  openDB().then((db) => {
    const transaction = db.transaction(['accounts', 'statuses'], 'read')
    const accountIndex = transaction.objectStore('accounts').index('id')
    const index = transaction.objectStore('statuses').index('id')

    return getFromDB(dispatch, getState, accountIndex, index, id).then(() => {
      db.close()
    }, (error) => {
      db.close()
      throw error
    })
  }).then(() => {
    dispatch(fetchStatusSuccess(skipLoading))
  }, () => api(getState).get(`/api/v1/statuses/${id}`).then((response) => {
    dispatch(importFetchedStatus(response.data))
    dispatch(fetchStatusSuccess(skipLoading))
  })).catch((error) => {
    dispatch(fetchStatusFail(id, error, skipLoading))
  })
}

const fetchStatusRequest = (id, skipLoading) => ({
  type: STATUS_FETCH_REQUEST,
  id,
  skipLoading,
})

const fetchStatusSuccess = (skipLoading) => ({
  type: STATUS_FETCH_SUCCESS,
  skipLoading,
})

const fetchStatusFail = (id, error, skipLoading) => ({
  type: STATUS_FETCH_FAIL,
  id,
  error,
  skipLoading,
  skipAlert: true,
})

/**
 * 
 */
export const editStatus = (status) => (dispatch) => {
  dispatch({
    type: STATUS_EDIT,
    status,
  })

  dispatch(openModal('COMPOSE'))
}

/**
 * 
 */
export const deleteStatus = (id, routerHistory) => (dispatch, getState) => {
  if (!me || !id) return

  let status = getState().getIn(['statuses', id])

  if (status.get('poll')) {
    status = status.set('poll', getState().getIn(['polls', status.get('poll')]))
  }

  dispatch(deleteStatusRequest(id))

  api(getState).delete(`/api/v1/statuses/${id}`).then((response) => {
    evictStatus(id)
    dispatch(deleteStatusSuccess(id))
    dispatch(deleteFromTimelines(id))
  }).catch((error) => {
    dispatch(deleteStatusFail(id, error))
  })
}

const deleteStatusRequest = (id) => ({
  type: STATUS_DELETE_REQUEST,
  id: id,
})

const deleteStatusSuccess = (id) => ({
  type: STATUS_DELETE_SUCCESS,
  id: id,
})

const deleteStatusFail = (id, error) => ({
  type: STATUS_DELETE_FAIL,
  id: id,
  error,
})

/**
 * 
 */
export const fetchContext = (id, ensureIsReply) => (dispatch, getState) => {
  if (!id || !me) return

  if (ensureIsReply) {
    const isReply = !!getState().getIn(['statuses', id, 'in_reply_to_id'], null)
    if (!isReply) return
  }

  dispatch(fetchContextRequest(id))

  api(getState).get(`/api/v1/statuses/${id}/context`).then((response) => {
    dispatch(importFetchedStatuses(response.data.ancestors.concat(response.data.descendants)))
    dispatch(fetchContextSuccess(id, response.data.ancestors, response.data.descendants))
  }).catch((error) => {
    if (error.response && error.response.status === 404) {
      dispatch(deleteFromTimelines(id))
    }
    dispatch(fetchContextFail(id, error))
  })
}

/**
 * 
 */
const fetchContextRequest = (id) => ({
  type: CONTEXT_FETCH_REQUEST,
  id,
})

const fetchContextSuccess = (id, ancestors, descendants) => ({
  type: CONTEXT_FETCH_SUCCESS,
  id,
  ancestors,
  descendants,
  statuses: ancestors.concat(descendants),
})

const fetchContextFail = (id, error) => ({
  type: CONTEXT_FETCH_FAIL,
  id,
  error,
  skipAlert: true,
})

/**
 * 
 */
export const fetchComments = (id) => (dispatch, getState) => {
  if (!id || !me) return
  debouncedFetchComments(id, dispatch, getState)
}

export const debouncedFetchComments = debounce((id, dispatch, getState) => {
  if (!id) return
  dispatch(fetchCommentsRequest(id))

  api(getState).get(`/api/v1/statuses/${id}/comments`).then((response) => {
    dispatch(importFetchedStatuses(response.data.descendants))
    dispatch(fetchCommentsSuccess(id, response.data.descendants))
  }).catch((error) => {
    if (error.response && error.response.status === 404) {
      dispatch(deleteFromTimelines(id))
    }

    dispatch(fetchCommentsFail(id, error))
  })
}, 5000, { leading: true })


const fetchCommentsRequest = (id) => ({
  type: COMMENTS_FETCH_REQUEST,
  id,
})

const fetchCommentsSuccess = (id, descendants) => ({
  type: COMMENTS_FETCH_SUCCESS,
  id,
  descendants,
})

const fetchCommentsFail = (id, error) => ({
  type: COMMENTS_FETCH_FAIL,
  id,
  error,
  skipAlert: true,
})

/**
 * 
 */
export const hideStatus = (ids) => {
  if (!Array.isArray(ids)) {
    ids = [ids]
  }

  return {
    type: STATUS_HIDE,
    ids,
  }
}

/**
 * 
 */
export const revealStatus = (ids) => {
  if (!Array.isArray(ids)) {
    ids = [ids]
  }

  return {
    type: STATUS_REVEAL,
    ids,
  }
}

/**
 * 
 */
export const updateStatusStats = (data) => ({
  type: UPDATE_STATUS_STATS,
  data,
})