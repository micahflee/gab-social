import api, { getLinks } from '../api'
import { me } from '../initial_state'

//

export const ALBUMS_FETCH_REQUEST = 'ALBUMS_FETCH_REQUEST'
export const ALBUMS_FETCH_SUCCESS = 'ALBUMS_FETCH_SUCCESS'
export const ALBUMS_FETCH_FAIL = 'ALBUMS_FETCH_FAIL'

export const ALBUMS_EXPAND_REQUEST = 'ALBUMS_EXPAND_REQUEST'
export const ALBUMS_EXPAND_SUCCESS = 'ALBUMS_EXPAND_SUCCESS'
export const ALBUMS_EXPAND_FAIL = 'ALBUMS_EXPAND_FAIL'

//

export const ALBUM_CREATE_REQUEST = 'ALBUM_CREATE_REQUEST'
export const ALBUM_CREATE_SUCCESS = 'ALBUM_CREATE_SUCCESS'
export const ALBUM_CREATE_FAIL = 'ALBUM_CREATE_FAIL'

export const ALBUM_REMOVE_REQUEST = 'ALBUM_REMOVE_REQUEST'
export const ALBUM_REMOVE_SUCCESS = 'ALBUM_REMOVE_SUCCESS'
export const ALBUM_REMOVE_FAIL = 'ALBUM_REMOVE_FAIL'

export const ALBUM_EDIT_REQUEST = 'ALBUM_EDIT_REQUEST'
export const ALBUM_EDIT_SUCCESS = 'ALBUM_EDIT_SUCCESS'
export const ALBUM_EDIT_FAIL = 'ALBUM_EDIT_FAIL'

//

export const ALBUM_UPDATE_MEDIA_REQUEST = 'ALBUM_UPDATE_MEDIA_REQUEST'
export const ALBUM_UPDATE_MEDIA_SUCCESS = 'ALBUM_UPDATE_MEDIA_SUCCESS'
export const ALBUM_UPDATE_MEDIA_FAIL = 'ALBUM_UPDATE_MEDIA_FAIL'

export const SET_ALBUM_COVER_REQUEST = 'SET_ALBUM_COVER_REQUEST'
export const SET_ALBUM_COVER_SUCCESS = 'SET_ALBUM_COVER_SUCCESS'
export const SET_ALBUM_COVER_FAIL = 'SET_ALBUM_COVER_FAIL'

/**
 * 
 */
export const fetchAlbums = (accountId) => (dispatch, getState) => {
  if (!accountId) return

  if (getState().getIn(['album_lists', accountId, 'isLoading'])) {
    return
  }

  dispatch(fetchAlbumsRequest(accountId))

  api(getState).get(`/api/v1/album_lists/${accountId}`).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(fetchAlbumsSuccess(response.data, accountId, next ? next.uri : null))
  }).catch((error) => {
    dispatch(fetchAlbumsFail(accountId, error))
  })
}

const fetchAlbumsRequest = (accountId) => ({
  type: ALBUMS_FETCH_REQUEST,
  accountId,
})

const fetchAlbumsSuccess = (albums, accountId, next) => ({
  type: ALBUMS_FETCH_SUCCESS,
  albums,
  accountId,
  next,
})

const fetchAlbumsFail = (accountId, error) => ({
  type: ALBUMS_FETCH_FAIL,
  showToast: true,
  accountId,
  error,
})

/**
 * 
 */
export const expandAlbums = (accountId) => (dispatch, getState) => {
  if (!me) return

  const url = getState().getIn(['album_lists', accountId, 'next'], null)

  if (url === null || getState().getIn(['album_lists', accountId, 'isLoading'])) {
    return
  }

  dispatch(expandAlbumsRequest(accountId))

  api(getState).get(url).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(expandAlbumsSuccess(response.data, accountId, next ? next.uri : null))
  }).catch((error) => {
    dispatch(expandAlbumsFail(accountId, error))
  })
}

const expandAlbumsRequest = (accountId) => ({
  type: ALBUMS_EXPAND_REQUEST,
  accountId,
})

const expandAlbumsSuccess = (statuses, accountId, next) => ({
  type: ALBUMS_EXPAND_SUCCESS,
  accountId,
  statuses,
  next,
})

const expandAlbumsFail = (accountId, error) => ({
  type: ALBUMS_EXPAND_FAIL,
  showToast: true,
  accountId,
  error,
})


/**
 * 
 */
export const createAlbum = (title, description) => (dispatch, getState) => {
  if (!me || !title) return

  dispatch(createAlbumRequest())

  api(getState).post('/api/v1/albums', {
    title,
    description,
  }).then((response) => {
    dispatch(createAlbumSuccess(response.data))
  }).catch((error) => {
    dispatch(createAlbumFail(error))
  })
}

const createAlbumRequest = () => ({
  type: ALBUM_CREATE_REQUEST,
})

const createAlbumSuccess = (bookmarkCollection) => ({
  type: ALBUM_CREATE_SUCCESS,
  bookmarkCollection,
})

const createAlbumFail = (error) => ({
  type: ALBUM_CREATE_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const editAlbum = (albumId, title, description, visibility) => (dispatch, getState) => {
  if (!me || !albumId || !title) return

  dispatch(editAlbumRequest(albumId))

  api(getState).put(`/api/v1/albums/${albumId}`, {
    title,
    description,
    visibility,
  }).then((response) => {
    dispatch(editAlbumSuccess(response.data))
  }).catch((error) => {
    dispatch(editAlbumFail(error))
  })
}

const editAlbumRequest = (albumId) => ({
  type: ALBUM_EDIT_REQUEST,
  albumId,
})

const editAlbumSuccess = (album) => ({
  type: ALBUM_EDIT_SUCCESS,
  album,
})

const editAlbumFail = (error) => ({
  type: ALBUM_EDIT_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const removeAlbum = (albumId) => (dispatch, getState) => {
  if (!me || !albumId) return

  dispatch(removeAlbumRequest(albumId))

  api(getState).delete(`/api/v1/albums/${albumId}`).then((response) => {
    dispatch(removeAlbumSuccess(response.data))
  }).catch((error) => {
    dispatch(removeAlbumFail(error))
  })
}

const removeAlbumRequest = (albumId) => ({
  type: ALBUM_REMOVE_REQUEST,
  albumId,
})

const removeAlbumSuccess = () => ({
  type: ALBUM_REMOVE_SUCCESS,
})

const removeAlbumFail = (error) => ({
  type: ALBUM_REMOVE_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const updateMediaAttachmentAlbum = (albumId, mediaAttachmentId) => (dispatch, getState) => {
  if (!me || !albumId || !mediaAttachmentId) return

  dispatch(updateMediaAttachmentAlbumRequest())

  api(getState).post(`/api/v1/albums/${albumId}/update_status`, { statusId }).then((response) => {
    dispatch(updateMediaAttachmentAlbumSuccess(response.data))
  }).catch((error) => {
    dispatch(updateMediaAlbumFail(error))
  })
}

const updateMediaAttachmentAlbumRequest = () => ({
  type: ALBUM_UPDATE_MEDIA_REQUEST,
})

const updateMediaAttachmentAlbumSuccess = (album) => ({
  type: ALBUM_UPDATE_MEDIA_SUCCESS,
  album,
})

const updateMediaAlbumFail = (error) => ({
  type: ALBUM_UPDATE_MEDIA_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const setAlbumCover = (albumId, mediaAttachmentId) => (dispatch, getState) => {
  if (!me || !albumId || !mediaAttachmentId) return

  dispatch(setAlbumCoverRequest())

  api(getState).post(`/api/v1/albums/${albumId}/set_cover`, { mediaAttachmentId }).then((response) => {
    dispatch(setAlbumCoverSuccess(response.data))
  }).catch((error) => {
    dispatch(setAlbumCoverFail(error))
  })
}

const setAlbumCoverRequest = () => ({
  type: SET_ALBUM_COVER_REQUEST,
})

const setAlbumCoverSuccess = (album) => ({
  type: SET_ALBUM_COVER_SUCCESS,
  album,
})

const setAlbumCoverFail = (error) => ({
  type: SET_ALBUM_COVER_FAIL,
  showToast: true,
  error,
})
