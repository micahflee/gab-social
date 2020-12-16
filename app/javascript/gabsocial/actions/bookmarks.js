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

/**
 * 
 */
export const fetchBookmarkedStatuses = () => (dispatch, getState) => {
  if (!me) return

  if (getState().getIn(['status_lists', 'bookmarks', 'isLoading'])) {
    return
  }

  dispatch(fetchBookmarkedStatusesRequest())

  api(getState).get('/api/v1/bookmarks').then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedStatuses(response.data))
    dispatch(fetchBookmarkedStatusesSuccess(response.data, next ? next.uri : null))
  }).catch((error) => {
    dispatch(fetchBookmarkedStatusesFail(error))
  })
}

const fetchBookmarkedStatusesRequest = () => ({
  type: BOOKMARKED_STATUSES_FETCH_REQUEST,
})

const fetchBookmarkedStatusesSuccess = (statuses, next) => ({
  type: BOOKMARKED_STATUSES_FETCH_SUCCESS,
  statuses,
  next,
})

const fetchBookmarkedStatusesFail = (error) => ({
  type: BOOKMARKED_STATUSES_FETCH_FAIL,
  showToast: true,
  error,
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

  api(getState).get(url).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedStatuses(response.data))
    dispatch(expandBookmarkedStatusesSuccess(response.data, next ? next.uri : null))
  }).catch((error) => {
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
  showToast: true,
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
  type: BOOKMARK_COLLECTIONS_CREATE_REQUEST,
  bookmarkCollectionId,
})

const removeBookmarkCollectionSuccess = () => ({
  type: BOOKMARK_COLLECTIONS_CREATE_SUCCESS,
})

const removeBookmarkCollectionFail = (error) => ({
  type: BOOKMARK_COLLECTIONS_CREATE_FAIL,
  showToast: true,
  error,
})