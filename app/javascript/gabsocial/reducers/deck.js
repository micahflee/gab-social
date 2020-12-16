import {
  DECK_CONNECT,
  DECK_DISCONNECT,
  DECK_SEARCH_USERS_CLEAR,
  DECK_SEARCH_USERS_SUCCESS,
} from '../actions/deck'
import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable'

const initialState = ImmutableMap({
  connected: false,
  accountSuggestions: ImmutableList(),
})

export default function deck(state = initialState, action) {
  switch(action.type) {
  case DECK_CONNECT:
    return state.set('connected', true)
  case DECK_DISCONNECT:
    return state.set('connected', false)
  case DECK_SEARCH_USERS_SUCCESS:
    return state.set('accountSuggestions', ImmutableList(action.accounts.map((item) => item.id)))
  case DECK_SEARCH_USERS_CLEAR:
    return state.set('accountSuggestions', ImmutableList())
  default:
    return state;
  }
}