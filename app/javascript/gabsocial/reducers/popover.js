import Immutable from 'immutable'
import {
  POPOVER_OPEN,
  POPOVER_CLOSE,
} from '../actions/popover'

const initialState = Immutable.Map({
  popoverType: null,
  placement: null,
})

export default function popoverMenu(state = initialState, action) {
  switch (action.type) {
    case POPOVER_OPEN:
      return {
        popoverType: action.popoverType,
        popoverProps: action.popoverProps,
      }
    case POPOVER_CLOSE:
      return initialState
    default:
      return state
  }
}
