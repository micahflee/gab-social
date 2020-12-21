import api from '../api'

export const HASHTAG_FETCH_REQUEST = 'HASHTAG_FETCH_REQUEST'
export const HASHTAG_FETCH_SUCCESS = 'HASHTAG_FETCH_SUCCESS'
export const HASHTAG_FETCH_FAIL    = 'HASHTAG_FETCH_FAIL'

export const fetchHashtag = (tag) => (dispatch, getState) => {
  if (!tag) return

  dispatch(fetchHashtagRequest())

  api(getState).get(`/api/v1/hashtags/${tag.toLowerCase()}`)
    .then(({ data }) => dispatch(fetchHashtagSuccess(data)))
    .catch(err => dispatch(fetchHashtagFail(err)))
}

export const fetchHashtagRequest = () => ({
  type: HASHTAG_FETCH_REQUEST,
})

export const fetchHashtagSuccess = (hashtag) => ({
  type: HASHTAG_FETCH_SUCCESS,
  hashtag,
})

export const fetchHashtagFail = error => ({
  type: HASHTAG_FETCH_FAIL,
  error,
})