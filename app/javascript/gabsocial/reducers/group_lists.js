import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import {
  GROUPS_FETCH_REQUEST,
  GROUPS_FETCH_SUCCESS,
  GROUPS_FETCH_FAIL,
} from '../actions/groups'

const tabs = ['new', 'featured', 'member', 'admin']

const initialState = ImmutableMap({
  new: ImmutableMap({
    fetched: false,
    loading: false,
    items: ImmutableList(),
  }),
  featured: ImmutableMap({
    fetched: false,
    loading: false,
    items: ImmutableList(),
  }),
  member: ImmutableMap({
    fetched: false,
    loading: false,
    items: ImmutableList(),
  }),
  admin: ImmutableMap({
    fetched: false,
    loading: false,
    items: ImmutableList(),
  }),
})

export default function groupLists(state = initialState, action) {
  if (tabs.indexOf(action.tab) === -1) return state
  
  switch(action.type) {
  case GROUPS_FETCH_REQUEST:
    return state.withMutations((mutable) => {
      mutable.setIn([action.tab, 'loading'], true)
    });
  case GROUPS_FETCH_SUCCESS:
    return state.withMutations((mutable) => {
      mutable.setIn([action.tab, 'items'], ImmutableList(action.groups.map(item => item.id)))
      mutable.setIn([action.tab, 'loading'], false)
      mutable.setIn([action.tab, 'fetched'], true)
    })
  case GROUPS_FETCH_FAIL:
    return state.withMutations((mutable) => {
      mutable.setIn([action.tab, 'items'], ImmutableList())
      mutable.setIn([action.tab, 'loading'], false)
      mutable.setIn([action.tab, 'fetched'], true)
    })
  default:
    return state
  }
}
