import api from '../api'
import { me } from '../initial_state'

export const EXPENSES_FETCH_REQUEST = 'EXPENSES_FETCH_REQUEST'
export const EXPENSES_FETCH_SUCCESS = 'EXPENSES_FETCH_SUCCESS'
export const EXPENSES_FETCH_FAIL = 'EXPENSES_FETCH_FAIL'

/**
 * Fetch monthly expenses completion
 */
export const fetchExpenses = () => (dispatch, getState) => {
  if (!me) return
  
  const isFetched = getState().getIn(['expenses', 'fetched'], false)
  if (isFetched) return

  dispatch(fetchExpensesRequest())

  api(getState).get('/api/v1/expenses').then((response) => {
    dispatch(fetchExpensesSuccess(response.data.expenses))        
  }).catch((error) => {
    dispatch(fetchExpensesFail(error))
  })
}

const fetchExpensesRequest = () => ({
  type: EXPENSES_FETCH_REQUEST,
})

const fetchExpensesSuccess = (value) => ({
  type: EXPENSES_FETCH_SUCCESS,
  value,
})

const fetchExpensesFail = (error, listType) => ({
  type: EXPENSES_FETCH_FAIL,
  error,
})