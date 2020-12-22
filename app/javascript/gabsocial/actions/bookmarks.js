import api, { getLinks } from '../api'
import { importFetchedStatuses } from './importer'
import { me } from '../initial_state'

export const BOOKMARKED_STATUSES_FETCH_REQUEST = 'BOOKMARKED_STATUSES_FETCH_REQUEST'
export const BOOKMARKED_STATUSES_FETCH_SUCCESS = 'BOOKMARKED_STATUSES_FETCH_SUCCESS'
export const BOOKMARKED_STATUSES_FETCH_FAIL = 'BOOKMARKED_STATUSES_FETCH_FAIL'

export const BOOKMARKED_STATUSES_EXPAND_REQUEST = 'BOOKMARKED_STATUSES_EXPAND_REQUEST'
export const BOOKMARKED_STATUSES_EXPAND_SUCCESS = 'BOOKMARKED_STATUSES_EXPAND_SUCCESS'
export const BOOKMARKED_STATUSES_EXPAND_FAIL = 'BOOKMARKED_STATUSES_EXPAND_FAIL'

//

export const BOOKMARK_COLLECTIONS_FETCH_REQUEST = 'BOOKMARK_COLLECTIONS_FETCH_REQUEST'
export const BOOKMARK_COLLECTIONS_FETCH_SUCCESS = 'BOOKMARK_COLLECTIONS_FETCH_SUCCESS'
export const BOOKMARK_COLLECTIONS_FETCH_FAIL = 'BOOKMARK_COLLECTIONS_FETCH_FAIL'

export const BOOKMARK_COLLECTIONS_CREATE_REQUEST = 'BOOKMARK_COLLECTIONS_CREATE_REQUEST'
export const BOOKMARK_COLLECTIONS_CREATE_SUCCESS = 'BOOKMARK_COLLECTIONS_CREATE_SUCCESS'
export const BOOKMARK_COLLECTIONS_CREATE_FAIL = 'BOOKMARK_COLLECTIONS_CREATE_FAIL'

export const BOOKMARK_COLLECTIONS_REMOVE_REQUEST = 'BOOKMARK_COLLECTIONS_REMOVE_REQUEST'
export const BOOKMARK_COLLECTIONS_REMOVE_SUCCESS = 'BOOKMARK_COLLECTIONS_REMOVE_SUCCESS'
export const BOOKMARK_COLLECTIONS_REMOVE_FAIL = 'BOOKMARK_COLLECTIONS_REMOVE_FAIL'

//

export const UPDATE_BOOKMARK_COLLECTION_FAIL = 'UPDATE_BOOKMARK_COLLECTION_FAIL'
export const UPDATE_BOOKMARK_COLLECTION_REQUEST = 'UPDATE_BOOKMARK_COLLECTION_REQUEST'
export const UPDATE_BOOKMARK_COLLECTION_SUCCESS = 'UPDATE_BOOKMARK_COLLECTION_SUCCESS'

export const UPDATE_BOOKMARK_COLLECTION_STATUS_FAIL = 'UPDATE_BOOKMARK_COLLECTION_STATUS_FAIL'
export const UPDATE_BOOKMARK_COLLECTION_STATUS_REQUEST = 'UPDATE_BOOKMARK_COLLECTION_STATUS_REQUEST'
export const UPDATE_BOOKMARK_COLLECTION_STATUS_SUCCESS = 'UPDATE_BOOKMARK_COLLECTION_STATUS_SUCCESS'

/**
 * 
 */
export const fetchBookmarkedStatuses = (bookmarkCollectionId) => (dispatch, getState) => {
  if (!me) return

  if (getState().getIn(['status_lists', 'bookmarks', bookmarkCollectionId, 'isLoading'])) {
    return
  }

  dispatch(fetchBookmarkedStatusesRequest(bookmarkCollectionId))

  api(getState).get(`/api/v1/bookmark_collections/${bookmarkCollectionId}/bookmarks`).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedStatuses(response.data))
    dispatch(fetchBookmarkedStatusesSuccess(response.data, bookmarkCollectionId, next ? next.uri : null))
  }).catch((error) => {
    dispatch(fetchBookmarkedStatusesFail(bookmarkCollectionId, error))
  })
}

const fetchBookmarkedStatusesRequest = (bookmarkCollectionId) => ({
  type: BOOKMARKED_STATUSES_FETCH_REQUEST,
  bookmarkCollectionId,
})

const fetchBookmarkedStatusesSuccess = (statuses, bookmarkCollectionId, next) => ({
  type: BOOKMARKED_STATUSES_FETCH_SUCCESS,
  bookmarkCollectionId,
  statuses,
  next,
})

const fetchBookmarkedStatusesFail = (bookmarkCollectionId, error) => ({
  type: BOOKMARKED_STATUSES_FETCH_FAIL,
  showToast: true,
  bookmarkCollectionId,
  error,
})

/**
 * 
 */
export const expandBookmarkedStatuses = (bookmarkCollectionId) => (dispatch, getState) => {
  if (!me) return

  const url = getState().getIn(['status_lists', 'bookmarks', bookmarkCollectionId, 'next'], null)

  if (url === null || getState().getIn(['status_lists', 'bookmarks', bookmarkCollectionId, 'isLoading'])) {
    return
  }

  dispatch(expandBookmarkedStatusesRequest(bookmarkCollectionId))

  api(getState).get(url).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedStatuses(response.data))
    dispatch(expandBookmarkedStatusesSuccess(response.data, bookmarkCollectionId, next ? next.uri : null))
  }).catch((error) => {
    dispatch(expandBookmarkedStatusesFail(bookmarkCollectionId, error))
  })
}

const expandBookmarkedStatusesRequest = (bookmarkCollectionId) => ({
  type: BOOKMARKED_STATUSES_EXPAND_REQUEST,
  bookmarkCollectionId,
})

const expandBookmarkedStatusesSuccess = (statuses, bookmarkCollectionId, next) => ({
  type: BOOKMARKED_STATUSES_EXPAND_SUCCESS,
  bookmarkCollectionId,
  statuses,
  next,
})

const expandBookmarkedStatusesFail = (bookmarkCollectionId, error) => ({
  type: BOOKMARKED_STATUSES_EXPAND_FAIL,
  showToast: true,
  bookmarkCollectionId,
  error,
})

/**
 * 
 */
export const fetchBookmarkCollections = () => (dispatch, getState) => {
  if (!me) return

  if (getState().getIn(['bookmark_collections', 'isLoading'])) return

  dispatch(fetchBookmarkCollectionsRequest())

  api(getState).get('/api/v1/bookmark_collections').then((response) => {
    dispatch(fetchBookmarkCollectionsSuccess(response.data))
  }).catch((error) => {
    dispatch(fetchBookmarkCollectionsFail(error))
  })
}

const fetchBookmarkCollectionsRequest = () => ({
  type: BOOKMARK_COLLECTIONS_FETCH_REQUEST,
})

const fetchBookmarkCollectionsSuccess = (bookmarkCollections) => ({
  type: BOOKMARK_COLLECTIONS_FETCH_SUCCESS,
  bookmarkCollections,
})

const fetchBookmarkCollectionsFail = (error) => ({
  type: BOOKMARK_COLLECTIONS_FETCH_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const createBookmarkCollection = (title) => (dispatch, getState) => {
  if (!me || !title) return

  dispatch(createBookmarkCollectionRequest())

  api(getState).post('/api/v1/bookmark_collections', { title }).then((response) => {
    dispatch(createBookmarkCollectionSuccess(response.data))
  }).catch((error) => {
    dispatch(createBookmarkCollectionFail(error))
  })
}

const createBookmarkCollectionRequest = () => ({
  type: BOOKMARK_COLLECTIONS_CREATE_REQUEST,
})

const createBookmarkCollectionSuccess = (bookmarkCollection) => ({
  type: BOOKMARK_COLLECTIONS_CREATE_SUCCESS,
  bookmarkCollection,
})

const createBookmarkCollectionFail = (error) => ({
  type: BOOKMARK_COLLECTIONS_CREATE_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const removeBookmarkCollection = (bookmarkCollectionId) => (dispatch, getState) => {
  if (!me || !bookmarkCollectionId) return

  dispatch(removeBookmarkCollectionRequest(bookmarkCollectionId))

  api(getState).delete(`/api/v1/bookmark_collection/${bookmarkCollectionId}`).then((response) => {
    dispatch(removeBookmarkCollectionSuccess(response.data))
  }).catch((error) => {
    dispatch(removeBookmarkCollectionFail(error))
  })
}

const removeBookmarkCollectionRequest = (bookmarkCollectionId) => ({
  type: BOOKMARK_COLLECTIONS_REMOVE_REQUEST,
  bookmarkCollectionId,
})

const removeBookmarkCollectionSuccess = () => ({
  type: BOOKMARK_COLLECTIONS_REMOVE_SUCCESS,
})

const removeBookmarkCollectionFail = (error) => ({
  type: BOOKMARK_COLLECTIONS_REMOVE_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const updateBookmarkCollection = (bookmarkCollectionId, title) => (dispatch, getState) => {
  if (!me || !statusId) return

  dispatch(updateBookmarkCollectionRequest())

  api(getState).put('/api/v1/bookmark_collections', { title }).then((response) => {
    dispatch(updateBookmarkCollectionSuccess(response.data))
  }).catch((error) => {
    dispatch(updateBookmarkCollectionFail(error))
  })
}

const updateBookmarkCollectionRequest = () => ({
  type: UPDATE_BOOKMARK_COLLECTION_REQUEST,
})

const updateBookmarkCollectionSuccess = (bookmarkCollection) => ({
  type: UPDATE_BOOKMARK_COLLECTION_SUCCESS,
  bookmarkCollection,
})

const updateBookmarkCollectionFail = (error) => ({
  type: UPDATE_BOOKMARK_COLLECTION_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const updateBookmarkCollectionStatus = (statusId, bookmarkCollectionId) => (dispatch, getState) => {
  if (!me || !statusId) return

  dispatch(updateBookmarkCollectionStatusRequest())

  api(getState).post(`/api/v1/bookmark_collections/${bookmarkCollectionId}/update_status`, { statusId }).then((response) => {
    dispatch(importFetchedStatuses([response.data]))
    dispatch(updateBookmarkCollectionStatusSuccess())
  }).catch((error) => {
    dispatch(updateBookmarkCollectionStatusFail(error))
  })
}

const updateBookmarkCollectionStatusRequest = () => ({
  type: UPDATE_BOOKMARK_COLLECTION_STATUS_REQUEST,
})

const updateBookmarkCollectionStatusSuccess = () => ({
  type: UPDATE_BOOKMARK_COLLECTION_STATUS_SUCCESS,
})

const updateBookmarkCollectionStatusFail = (error) => ({
  type: UPDATE_BOOKMARK_COLLECTION_STATUS_FAIL,
  showToast: true,
  error,
})
