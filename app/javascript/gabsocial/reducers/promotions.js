import {
  PROMOTIONS_FETCH_REQUEST,
  PROMOTIONS_FETCH_SUCCESS,
  PROMOTIONS_FETCH_FAIL,
} from '../actions/promotions'

const initialState = []

export default function promotions(state = initialState, action) {
  switch (action.type) {
  case PROMOTIONS_FETCH_REQUEST:
  case PROMOTIONS_FETCH_FAIL:
    return initialState
  case PROMOTIONS_FETCH_SUCCESS:
    return action.items
  default:
    return state
  }
}
