import {
  List as ImmutableList,
  fromJS,
}from 'immutable'
import {
  PROMOTIONS_FETCH_REQUEST,
  PROMOTIONS_FETCH_SUCCESS,
  PROMOTIONS_FETCH_FAIL,
} from '../actions/promotions'

const initialState = ImmutableList()

export default function promotions(state = initialState, action) {
  switch (action.type) {
  case PROMOTIONS_FETCH_REQUEST:
  case PROMOTIONS_FETCH_FAIL:
    return initialState
  case PROMOTIONS_FETCH_SUCCESS:
    return fromJS(action.items)
  default:
    return state
  }
}
