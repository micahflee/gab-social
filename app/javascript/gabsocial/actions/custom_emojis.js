import api from '../api'

export const CUSTOM_EMOJIS_FETCH_REQUEST = 'CUSTOM_EMOJIS_FETCH_REQUEST'
export const CUSTOM_EMOJIS_FETCH_SUCCESS = 'CUSTOM_EMOJIS_FETCH_SUCCESS'
export const CUSTOM_EMOJIS_FETCH_FAIL = 'CUSTOM_EMOJIS_FETCH_FAIL'

export const fetchCustomEmojis = () => (dispatch, getState) => {
  dispatch(fetchCustomEmojisRequest())

  api(getState).get('/api/v1/custom_emojis').then((response) => {
    dispatch(fetchCustomEmojisSuccess(response.data))
  }).catch((error) => {
    dispatch(fetchCustomEmojisFail(error))
  })
}

const fetchCustomEmojisRequest = () => ({
  type: CUSTOM_EMOJIS_FETCH_REQUEST,
  skipLoading: true,
})

const fetchCustomEmojisSuccess = (custom_emojis) => ({
  type: CUSTOM_EMOJIS_FETCH_SUCCESS,
  custom_emojis,
  skipLoading: true,
})

const fetchCustomEmojisFail = (error) => ({
  type: CUSTOM_EMOJIS_FETCH_FAIL,
  error,
  skipLoading: true,
})
