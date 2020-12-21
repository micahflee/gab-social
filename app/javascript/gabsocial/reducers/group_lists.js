import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import {
  GROUPS_FETCH_REQUEST,
  GROUPS_FETCH_SUCCESS,
  GROUPS_FETCH_FAIL,
  GROUP_SORT,
  GROUP_TIMELINE_SORT,
  GROUP_TIMELINE_TOP_SORT,
  GROUP_CHECK_PASSWORD_RESET,
  GROUP_CHECK_PASSWORD_REQUEST,
  GROUP_CHECK_PASSWORD_SUCCESS,
  GROUP_CHECK_PASSWORD_FAIL,
  GROUPS_BY_CATEGORY_FETCH_REQUEST,
  GROUPS_BY_CATEGORY_FETCH_SUCCESS,
  GROUPS_BY_CATEGORY_FETCH_FAIL,
  GROUPS_BY_TAG_FETCH_REQUEST,
  GROUPS_BY_TAG_FETCH_SUCCESS,
  GROUPS_BY_TAG_FETCH_FAIL,
  GROUP_MEMBERS_SEARCH_SUCCESS,
  CLEAR_GROUP_MEMBERS_SEARCH,
  GROUP_REMOVED_ACCOUNTS_SEARCH_SUCCESS,
  CLEAR_GROUP_REMOVED_ACCOUNTS_SEARCH,
} from '../actions/groups'
import {
  GROUP_TIMELINE_SORTING_TYPE_TOP,
  GROUP_TIMELINE_SORTING_TYPE_NEWEST,
  GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_TODAY,
  ACCEPTED_GROUP_TABS,
} from '../constants'
import slugify from '../utils/slugify'

const initialState = ImmutableMap({
  sortByValue: GROUP_TIMELINE_SORTING_TYPE_NEWEST,
  sortByTopValue: '',
  passwordCheck: ImmutableMap(),
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
  by_category: ImmutableMap(),
  by_tag: ImmutableMap(),
  member_search_accounts: ImmutableList(),
  removed_search_accounts: ImmutableList(),
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

  case GROUP_CHECK_PASSWORD_RESET:
    return state.withMutations((mutable) => {
      mutable.setIn(['passwordCheck', 'isError'], false)
      mutable.setIn(['passwordCheck', 'isSuccess'], false)
      mutable.setIn(['passwordCheck', 'isLoading'], false)
    })
  case GROUP_CHECK_PASSWORD_REQUEST:
    return state.withMutations((mutable) => {
      mutable.setIn(['passwordCheck', 'isError'], false)
      mutable.setIn(['passwordCheck', 'isSuccess'], false)
      mutable.setIn(['passwordCheck', 'isLoading'], true)
    })
  case GROUP_CHECK_PASSWORD_SUCCESS:
    return state.withMutations((mutable) => {
      mutable.setIn(['passwordCheck', 'isError'], false)
      mutable.setIn(['passwordCheck', 'isSuccess'], true)
      mutable.setIn(['passwordCheck', 'isLoading'], false)
    })
  case GROUP_CHECK_PASSWORD_FAIL:
    return state.withMutations((mutable) => {
      mutable.setIn(['passwordCheck', 'isError'], true)
      mutable.setIn(['passwordCheck', 'isSuccess'], false)
      mutable.setIn(['passwordCheck', 'isLoading'], false)
    })

  case GROUPS_BY_CATEGORY_FETCH_REQUEST:
    return state.setIn(['by_category', slugify(action.category), 'isLoading'], true)
  case GROUPS_BY_CATEGORY_FETCH_SUCCESS:
    return state.setIn(['by_category', slugify(action.category)], ImmutableMap({
      items: ImmutableList(action.groups.map(item => item.id)),
      isLoading: false,
    }))
  case GROUPS_BY_CATEGORY_FETCH_FAIL:
    return state.setIn(['by_category', slugify(action.category)], ImmutableMap({
      items: ImmutableList(),
      isLoading: false,
    }))

  case GROUPS_BY_TAG_FETCH_REQUEST:
    return state.setIn(['by_tag', slugify(action.tag), 'isLoading'], true)
  case GROUPS_BY_TAG_FETCH_SUCCESS:
    return state.setIn(['by_tag', slugify(action.tag)], ImmutableMap({
      items: ImmutableList(action.groups.map(item => item.id)),
      isLoading: false,
    }))
  case GROUPS_BY_TAG_FETCH_FAIL:
    return state.setIn(['by_tag', slugify(action.tag)], ImmutableMap({
      items: ImmutableList(),
      isLoading: false,
    }))
  case GROUP_MEMBERS_SEARCH_SUCCESS:
    return state.set('member_search_accounts', ImmutableList(action.accounts.map((item) => item.id)))
  case CLEAR_GROUP_MEMBERS_SEARCH:
    return state.set('member_search_accounts', ImmutableList())
  case GROUP_REMOVED_ACCOUNTS_SEARCH_SUCCESS:
    return state.set('removed_search_accounts', ImmutableList(action.accounts.map((item) => item.id)))
  case CLEAR_GROUP_REMOVED_ACCOUNTS_SEARCH:
    return state.set('removed_search_accounts', ImmutableList())
  default:
    return state
  }
}

