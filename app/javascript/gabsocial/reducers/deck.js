import {
  DECK_CONNECT,
  DECK_DISCONNECT,
} from '../actions/deck'
import { Map as ImmutableMap } from 'immutable'

const initialState = ImmutableMap({
  connected: false,
})

export default function deck(state = initialState, action) {
  switch(action.type) {
  case DECK_CONNECT:
    return state.set('connected', true)
  case DECK_DISCONNECT:
    return state.set('connected', false)
  default:
    return state;
  }
}