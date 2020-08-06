import {
  GROUP_CATEGORIES_FETCH_REQUEST,
  GROUP_CATEGORIES_FETCH_SUCCESS,
  GROUP_CATEGORIES_FETCH_FAIL,
} from '../actions/group_categories'
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable'

const initialState = ImmutableMap({
  items: ImmutableList(),
  isLoading: false,
  isError: false,
})

export default function groupCategoriesReducer(state = initialState, action) {
  switch(action.type) {
    case GROUP_CATEGORIES_FETCH_REQUEST:
      return state.withMutations((map) => {
        map.set('isLoading', true)
        map.set('isError', false)
      })
    case GROUP_CATEGORIES_FETCH_SUCCESS:
      return state.withMutations((map) => {
        map.set('items', fromJS(action.categories.map((x => x))))
        map.set('isLoading', false)
        map.set('isError', false)
      })
    case GROUP_CATEGORIES_FETCH_FAIL:
      return state.withMutations((map) => {
        map.set('isLoading', false)
        map.set('isError', true)
      })
    default:
      return state
  }
}
