import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable'
import {
  LINK_FETCH_REQUEST,
  LINK_FETCH_SUCCESS,
  LINK_FETCH_FAIL,
  IMPORT_LINK_CARDS,
} from '../actions/links'

const initialState = ImmutableMap({
  isFetched: false,
  isError: false,
  isLoading: false,
  items: ImmutableMap(),
})

export default function links(state = initialState, action) {
  switch(action.type) {
  case LINK_FETCH_REQUEST:
    return state.set('isLoading', true)
  case LINK_FETCH_SUCCESS:
    return state.withMutations((mutable) => {
      mutable.setIn(['items', `${action.card.id}`], fromJS(action.card))
      mutable.set('isLoading', false)
      mutable.set('isFetched', false)
      mutable.set('isError', false)
    })
  case IMPORT_LINK_CARDS:
    return state.withMutations((mutable) => {
      action.cards.forEach((card) => mutable.setIn(['items', `${card.id}`], fromJS(card)))
      mutable.set('isLoading', false)
      mutable.set('isFetched', false)
      mutable.set('isError', false)
    })
  case LINK_FETCH_FAIL:
    return state.withMutations((mutable) => {
      mutable.set('isLoading', false)
      mutable.set('isFetched', false)
      mutable.set('isError', true)
    })
  default:
    return state
  }
}

