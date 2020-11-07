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
  POPULAR_LINKS_FETCH_REQUEST,
  POPULAR_LINKS_FETCH_SUCCESS,
  POPULAR_LINKS_FETCH_FAIL,
} from '../actions/links'

const initialState = ImmutableMap({
  isFetched: false,
  isLoading: false,
  items: ImmutableMap(),
  popular: ImmutableMap({
    isLoading: false,
    isFetched: false,
    items: ImmutableList(),
  }),
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
    })
  case IMPORT_LINK_CARDS:
    return state.withMutations((mutable) => {
      action.cards.forEach((card) => mutable.setIn(['items', `${card.id}`], fromJS(card)))
      mutable.set('isLoading', false)
      mutable.set('isFetched', false)
    })
  case LINK_FETCH_FAIL:
    return state.withMutations((mutable) => {
      mutable.set('isLoading', false)
      mutable.set('isFetched', false)
    })
  case POPULAR_LINKS_FETCH_REQUEST:
    return state.setIn(['popular', 'isLoading'], true)
  case POPULAR_LINKS_FETCH_SUCCESS:
    return state.withMutations((mutable) => {
      let popularIds = []
      action.cards.forEach((card) => {
        mutable.setIn(['items', `${card.id}`], fromJS(card))
        popularIds.push(`${card.id}`)
      })
      mutable.setIn(['popular', 'items'], fromJS(popularIds))
      mutable.setIn(['popular', 'isFetched'], true)
    })
  case POPULAR_LINKS_FETCH_FAIL:
    return state.withMutations((mutable) => {
      mutable.setIn(['popular', 'isLoading'], false)
      mutable.setIn(['popular', 'isFetched'], true)
      mutable.setIn(['popular', 'items'], ImmutableList())
    })
  default:
    return state
  }
}

