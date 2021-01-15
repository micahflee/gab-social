import api from '../api'
import { me } from '../initial_state'

export const TRENDING_HASHTAGS_FETCH_REQUEST = 'TRENDING_HASHTAGS_FETCH_REQUEST'
export const TRENDING_HASHTAGS_FETCH_SUCCESS = 'TRENDING_HASHTAGS_FETCH_SUCCESS'
export const TRENDING_HASHTAGS_FETCH_FAIL = 'TRENDING_HASHTAGS_FETCH_FAIL'

/**
 * Fetch trending hashtags
 */
export const fetchTrendingHashtags = () => (dispatch, getState) => {
  if (!me) return

  const isFetched = getState().getIn(['trending_hashtags', 'fetched'], false)
  if (isFetched) return

  dispatch(fetchTrendingHashtagsRequest())

  api(getState).get('/api/v1/trending_hashtags').then((response) => {
    dispatch(fetchTrendingHashtagsSuccess(response.data.trending_hashtags))        
  }).catch((error) => {
    dispatch(fetchTrendingHashtagsFail(error))
  })
}

const fetchTrendingHashtagsRequest = () => ({
  type: TRENDING_HASHTAGS_FETCH_REQUEST,
})

const fetchTrendingHashtagsSuccess = (hashtags) => ({
  type: TRENDING_HASHTAGS_FETCH_SUCCESS,
  hashtags,
})

const fetchTrendingHashtagsFail = (error, listType) => ({
  type: TRENDING_HASHTAGS_FETCH_FAIL,
  error,
})