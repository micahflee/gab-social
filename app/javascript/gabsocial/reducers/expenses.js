import { Map as ImmutableMap } from 'immutable'
import {
  EXPENSES_FETCH_REQUEST,
  EXPENSES_FETCH_SUCCESS,
  EXPENSES_FETCH_FAIL,
} from '../actions/expenses'

const initialState = ImmutableMap({
  fetched: false,
  value: 0,
})

export default function expenses(state = initialState, action) {
  switch (action.type) {
  case EXPENSES_FETCH_REQUEST:
  case EXPENSES_FETCH_FAIL:
    return state.set('fetched', true).set('value', 0)
  case EXPENSES_FETCH_SUCCESS:
    return state.set('fetched', true).set('value', action.value)
  default:
    return state
  }
}
