import Immutable from 'immutable'
import {
  POPOVER_OPEN,
  POPOVER_CLOSE,
} from '../actions/popover'

const initialState = Immutable.Map({
  popoverType: null,
  placement: null,
  keyboard: false
})

export default function popoverMenu(state = initialState, action) {
  switch (action.type) {
    case POPOVER_OPEN:
      console.log("POPOVER_OPEN:", action)
      return {
        popoverType: action.popoverType,
        placement: action.placement,
        keyboard: action.keyboard
      }
    case POPOVER_CLOSE:
      console.log("POPOVER_CLOSE:", action)
      return initialState;
    default:
      return state
  }
}
