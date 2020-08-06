import {
  TOAST_SHOW,
  TOAST_DISMISS,
  TOAST_CLEAR,
} from '../actions/toasts'
import { Map as ImmutableMap, List as ImmutableList } from 'immutable'

const initialState = ImmutableList([])

export default function toasts(state = initialState, action) {
  switch(action.type) {
  case TOAST_SHOW:
    return state.push(ImmutableMap({
      key: state.size > 0 ? state.last().get('key') + 1 : 0,
      message: action.message,
      type: action.toastType,
    }))
  case TOAST_DISMISS:
    return state.filterNot(item => item.get('key') === action.toast.key)
  case TOAST_CLEAR:
    return state.clear()
  default:
    return state
  }
}
