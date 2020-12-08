import api from '../api'

export const STATUS_REVISIONS_LOAD_REQUEST = 'STATUS_REVISIONS_LOAD_REQUEST'
export const STATUS_REVISIONS_LOAD_SUCCESS = 'STATUS_REVISIONS_SUCCESS'
export const STATUS_REVISIONS_LOAD_FAIL = 'STATUS_REVISIONS_FAIL'

/**
 * 
 */
export const loadStatusRevisions = (statusId) => (dispatch, getState) => {
  dispatch(loadStatusRevisionsRequest())
  api(getState).get(`/api/v1/statuses/${statusId}/revisions`)
    .then(res => dispatch(loadStatusRevisionsSuccess(res.data)))
    .catch((error) => dispatch(loadStatusRevisionsFail(error)))
}

const loadStatusRevisionsRequest = () => ({
  type: STATUS_REVISIONS_LOAD_REQUEST,
})

const loadStatusRevisionsSuccess = (data) => ({
  type: STATUS_REVISIONS_LOAD_SUCCESS,
  revisions: data,
})

const loadStatusRevisionsFail = (error) => ({
  type: STATUS_REVISIONS_LOAD_FAIL,
  showToast: true,
  error,
})
