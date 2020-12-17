import {
  BOOKMARK_COLLECTIONS_FETCH_REQUEST,
  BOOKMARK_COLLECTIONS_FETCH_SUCCESS,
  BOOKMARK_COLLECTIONS_FETCH_FAIL,
  BOOKMARK_COLLECTIONS_CREATE_SUCCESS,
  BOOKMARK_COLLECTIONS_REMOVE_REQUEST,
} from '../actions/bookmarks'
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable'

const initialState = ImmutableMap({
  items: ImmutableList(),
  isLoading: false,
  isFetched: false,
  isError: false,
})

export default function bookmark_collections(state = initialState, action) {
  switch(action.type) {
    case BOOKMARK_COLLECTIONS_FETCH_REQUEST:
      return state.withMutations((map) => {
        map.set('isLoading', true)
        map.set('isFetched', false)
        map.set('isError', false)
      })
    case BOOKMARK_COLLECTIONS_FETCH_SUCCESS:
      return state.withMutations((map) => {
        map.set('items', fromJS(action.bookmarkCollections))
        map.set('isLoading', false)
        map.set('isFetched', true)
        map.set('isError', false)
      })
    case BOOKMARK_COLLECTIONS_FETCH_FAIL:
      return state.withMutations((map) => {
        map.set('isLoading', false)
        map.set('isFetched', true)
        map.set('isError', true)
      })
    case BOOKMARK_COLLECTIONS_CREATE_SUCCESS:
      return state.update('items', list => list.push(fromJS(action.bookmarkCollection)))
    case BOOKMARK_COLLECTIONS_REMOVE_REQUEST:
      return state.update('items', list => list.filterNot((item) => {
        return item.get('id') === action.bookmarkCollectionId
      }))
    default:
      return state
  }
}
