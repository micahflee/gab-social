import Immutable from 'immutable'
import {
  TIMELINE_INJECTION_SHOW,
  TIMELINE_INJECTION_HIDE,
} from '../actions/timeline_injections'

const initialState = Immutable.Map({
  visibleIds: Immutable.List(),
  hiddenIds: Immutable.List(),
})

export default function timeline_injection(state = initialState, action) {
  switch(action.type) {
  case TIMELINE_INJECTION_SHOW:
    return state.withMutations((map) => {
      map.update('hiddenIds', (list) => list.filterNot((id) => id === action.injectionId))
      map.update('visibleIds', (list) => list.push(action.injectionId))
    })
  case TIMELINE_INJECTION_HIDE:
    return state.withMutations((map) => {
      map.update('visibleIds', (list) => list.filterNot((id) => id === action.injectionId))
      map.update('hiddenIds', (list) => list.push(action.injectionId))
    })
  default:
    return state
  }
}
