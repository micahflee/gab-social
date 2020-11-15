import api from '../api'
import { openModal, closeModal } from './modal'
import { MODAL_REPORT } from '../constants'

export const REPORT_INIT   = 'REPORT_INIT'
export const REPORT_CANCEL = 'REPORT_CANCEL'

export const REPORT_SUBMIT_REQUEST = 'REPORT_SUBMIT_REQUEST'
export const REPORT_SUBMIT_SUCCESS = 'REPORT_SUBMIT_SUCCESS'
export const REPORT_SUBMIT_FAIL    = 'REPORT_SUBMIT_FAIL'

export const REPORT_STATUS_TOGGLE  = 'REPORT_STATUS_TOGGLE'
export const REPORT_COMMENT_CHANGE = 'REPORT_COMMENT_CHANGE'
export const REPORT_FORWARD_CHANGE = 'REPORT_FORWARD_CHANGE'

/**
 * 
 */
export const initReport = (account, status) => (dispatch) => {
  dispatch({
    type: REPORT_INIT,
    account,
    status,
  })

  dispatch(openModal(MODAL_REPORT))
}

/**
 * 
 */
export const cancelReport = () => ({
  type: REPORT_CANCEL,
})

/**
 * 
 */
export const toggleStatusReport = (statusId, checked) => ({
  type: REPORT_STATUS_TOGGLE,
  statusId,
  checked,
})

/**
 * 
 */
export const submitReport = () => (dispatch, getState) => {
  dispatch(submitReportRequest())

  api(getState).post('/api/v1/reports', {
    account_id: getState().getIn(['reports', 'new', 'account_id']),
    status_ids: getState().getIn(['reports', 'new', 'status_ids']),
    comment: getState().getIn(['reports', 'new', 'comment']),
    forward: getState().getIn(['reports', 'new', 'forward']),
  }).then((response) => {
    dispatch(closeModal());
    dispatch(submitReportSuccess(response.data))
  }).catch((error) => dispatch(submitReportFail(error)))
}

const submitReportRequest = () => ({
  type: REPORT_SUBMIT_REQUEST,
})

const submitReportSuccess = (report) => ({
  type: REPORT_SUBMIT_SUCCESS,
  report,
})

const submitReportFail = (error) => ({
  type: REPORT_SUBMIT_FAIL,
  error,
})

/**
 * 
 */
export const changeReportComment = (comment) => ({
  type: REPORT_COMMENT_CHANGE,
  comment,
})
