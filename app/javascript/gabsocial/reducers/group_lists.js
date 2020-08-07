import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import {
  GROUPS_FETCH_REQUEST,
  GROUPS_FETCH_SUCCESS,
  GROUPS_FETCH_FAIL,
  GROUP_SORT,
  GROUP_TIMELINE_SORT,
  GROUP_TIMELINE_TOP_SORT,
} from '../actions/groups'
import {
  GROUP_TIMELINE_SORTING_TYPE_TOP,
  GROUP_TIMELINE_SORTING_TYPE_NEWEST,
  GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_TODAY,
} from '../constants'

const tabs = ['new', 'featured', 'member', 'admin']

const initialState = ImmutableMap({
  sortByValue: GROUP_TIMELINE_SORTING_TYPE_NEWEST,
  sortByTopValue: '',
  new: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
  featured: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
  member: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
  admin: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
})

export default function groupLists(state = initialState, action) {
  // if (tabs.indexOf(action.tab) === -1) return state

  switch(action.type) {
  case GROUPS_FETCH_REQUEST:
    return state.withMutations((mutable) => {
      mutable.setIn([action.tab, 'isLoading'], true)
    });
  case GROUPS_FETCH_SUCCESS:
    return state.withMutations((mutable) => {
      let list = ImmutableList(action.groups.map(item => item.id))
      if (action.tab === 'featured') list = list.sortBy(Math.random)
      mutable.setIn([action.tab, 'items'], list)
      mutable.setIn([action.tab, 'isLoading'], false)
      mutable.setIn([action.tab, 'isFetched'], true)
    })
  case GROUPS_FETCH_FAIL:
    return state.withMutations((mutable) => {
      mutable.setIn([action.tab, 'items'], ImmutableList())
      mutable.setIn([action.tab, 'isLoading'], false)
      mutable.setIn([action.tab, 'isFetched'], true)
    })
  case GROUP_SORT:
    return state.withMutations((mutable) => {
      mutable.setIn([action.tab, 'items'], ImmutableList(action.groupIds))
    })
  case GROUP_TIMELINE_SORT:
    return state.withMutations((mutable) => {
      mutable.set('sortByValue', action.sortValue)
      if (action.sortValue === GROUP_TIMELINE_SORTING_TYPE_TOP) {
        mutable.set('sortByTopValue', GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_TODAY)
      } else {
        mutable.set('sortByTopValue', '')
      }
    })
  case GROUP_TIMELINE_TOP_SORT:
    return state.withMutations((mutable) => {
      mutable.set('sortByValue', GROUP_TIMELINE_SORTING_TYPE_TOP)
      mutable.set('sortByTopValue', action.sortValue)
    })
  default:
    return state
  }
}
