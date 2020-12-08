import api from '../api'
import { me } from '../initial_state'

export const FILTERS_FETCH_REQUEST = 'FILTERS_FETCH_REQUEST'
export const FILTERS_FETCH_SUCCESS = 'FILTERS_FETCH_SUCCESS'
export const FILTERS_FETCH_FAIL = 'FILTERS_FETCH_FAIL'

/**
 * 
 */
export const fetchFilters = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchFiltersRequest())

  api(getState).get('/api/v1/filters').then(({ data }) => {
    dispatch(fetchFiltersSuccess(data))
  }).catch((err) => {
    dispatch(fetchFiltersFail(err))
  })
}


const fetchFiltersRequest = () => ({
  type: FILTERS_FETCH_REQUEST,
})

const fetchFiltersSuccess = (filters) => ({
  type: FILTERS_FETCH_SUCCESS,
  filters,
})

const fetchFiltersFail = (error) => ({
  type: FILTERS_FETCH_FAIL,
  error,
  skipAlert: true,
})