import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import { me } from '../initial_state'
import {
  FOLLOWERS_FETCH_REQUEST,
  FOLLOWERS_FETCH_SUCCESS,
  FOLLOWERS_EXPAND_SUCCESS,
  FOLLOWERS_FETCH_FAIL,
  FOLLOWERS_EXPAND_REQUEST,
  FOLLOWERS_EXPAND_FAIL,
  FOLLOWING_FETCH_REQUEST,
  FOLLOWING_FETCH_FAIL,
  FOLLOWING_EXPAND_REQUEST,
  FOLLOWING_FETCH_SUCCESS,
  FOLLOWING_EXPAND_SUCCESS,
  FOLLOWING_EXPAND_FAIL,
  FOLLOW_REQUESTS_FETCH_REQUEST,
  FOLLOW_REQUESTS_FETCH_FAIL,
  FOLLOW_REQUESTS_EXPAND_REQUEST,
  FOLLOW_REQUESTS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_FAIL,
  FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  FOLLOW_REQUEST_REJECT_SUCCESS,
} from '../actions/accounts'
import {
  REPOSTS_FETCH_SUCCESS,
  LIKES_FETCH_SUCCESS,
} from '../actions/interactions'
import {
  BLOCKS_FETCH_REQUEST,
  BLOCKS_FETCH_SUCCESS,
  BLOCKS_FETCH_FAIL,
  BLOCKS_EXPAND_REQUEST,
  BLOCKS_EXPAND_SUCCESS,
  BLOCKS_EXPAND_FAIL,
} from '../actions/blocks'
import {
  MUTES_FETCH_REQUEST,
  MUTES_FETCH_SUCCESS,
  MUTES_FETCH_FAIL,
  MUTES_EXPAND_REQUEST,
  MUTES_EXPAND_SUCCESS,
  MUTES_EXPAND_FAIL,
} from '../actions/mutes'
import { 
  GROUP_MEMBERS_FETCH_SUCCESS,
  GROUP_MEMBERS_EXPAND_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
} from '../actions/groups'

const initialState = ImmutableMap({
  followers: ImmutableMap(),
  following: ImmutableMap(),
  reblogged_by: ImmutableMap(),
  liked_by: ImmutableMap(),
  follow_requests: ImmutableMap(),
  blocks: ImmutableMap(),
  mutes: ImmutableMap(),
  groups: ImmutableMap(),
  groups_removed_accounts: ImmutableMap(),
});

const setListFailed = (state, type, id) => {
  return state.setIn([type, id], ImmutableMap({
    next: null,
    items: ImmutableList(),
    isLoading: false,
  }))
}

const normalizeList = (state, type, id, accounts, next) => {
  return state.setIn([type, id], ImmutableMap({
    next,
    items: ImmutableList(accounts.map(item => item.id)),
    isLoading: false,
  }))
}

const appendToList = (state, type, id, accounts, next) => {
  return state.updateIn([type, id], (map) => {
    return map
      .set('next', next)
      .set('isLoading', false)
      .update('items', (list) => {
        return list.concat(accounts.map(item => item.id))
      })
  })
}

export default function userLists(state = initialState, action) {
  switch(action.type) {

  case FOLLOWERS_FETCH_SUCCESS:
    return normalizeList(state, 'followers', action.id, action.accounts, action.next);
  case FOLLOWERS_EXPAND_SUCCESS:
    return appendToList(state, 'followers', action.id, action.accounts, action.next);
  case FOLLOWERS_FETCH_REQUEST:
  case FOLLOWERS_EXPAND_REQUEST:
    return state.setIn(['followers', action.id, 'isLoading'], true);
  case FOLLOWERS_FETCH_FAIL:
  case FOLLOWERS_EXPAND_FAIL:
    return setListFailed(state, 'followers', action.id)

  case FOLLOWING_FETCH_SUCCESS:
    return normalizeList(state, 'following', action.id, action.accounts, action.next);
  case FOLLOWING_EXPAND_SUCCESS:
    return appendToList(state, 'following', action.id, action.accounts, action.next);
  case FOLLOWING_FETCH_REQUEST:
  case FOLLOWING_EXPAND_REQUEST:
    return state.setIn(['following', action.id, 'isLoading'], true);
  case FOLLOWING_FETCH_FAIL:
  case FOLLOWING_EXPAND_FAIL:
    return state.setIn(['following', action.id, 'isLoading'], false);

  case REPOSTS_FETCH_SUCCESS:
    return state.setIn(['reblogged_by', action.id], ImmutableList(action.accounts.map(item => item.id)));

  case LIKES_FETCH_SUCCESS:
    return state.setIn(['liked_by', action.id], ImmutableList(action.accounts.map(item => item.id)));

  case FOLLOW_REQUESTS_FETCH_SUCCESS:
    return state.setIn(['follow_requests', 'items'], ImmutableList(action.accounts.map(item => item.id))).setIn(['follow_requests', 'next'], action.next).setIn(['follow_requests', 'isLoading'], false);
  case FOLLOW_REQUESTS_EXPAND_SUCCESS:
    return state.updateIn(['follow_requests', 'items'], list => list.concat(action.accounts.map(item => item.id))).setIn(['follow_requests', 'next'], action.next).setIn(['follow_requests', 'isLoading'], false);
  case FOLLOW_REQUESTS_FETCH_REQUEST:
  case FOLLOW_REQUESTS_EXPAND_REQUEST:
    return state.setIn(['follow_requests', 'isLoading'], true);
  case FOLLOW_REQUESTS_FETCH_FAIL:
  case FOLLOW_REQUESTS_EXPAND_FAIL:
    return state.setIn(['follow_requests', 'isLoading'], false);
  case FOLLOW_REQUEST_AUTHORIZE_SUCCESS:
  case FOLLOW_REQUEST_REJECT_SUCCESS:
    return state.updateIn(['follow_requests', 'items'], list => list.filterNot(item => item === action.id));

  case BLOCKS_FETCH_REQUEST:
  case BLOCKS_EXPAND_REQUEST:
    return state.setIn(['blocks', me, 'isLoading'], true)
  case BLOCKS_FETCH_SUCCESS:
    return normalizeList(state, 'blocks', me, action.accounts, action.next)
  case BLOCKS_EXPAND_SUCCESS:
    return appendToList(state, 'blocks', me, action.accounts, action.next)
  case BLOCKS_FETCH_FAIL:
  case BLOCKS_EXPAND_FAIL:
    return setListFailed(state, 'blocks', me)

  case MUTES_FETCH_REQUEST:
  case MUTES_EXPAND_REQUEST:
    return state.setIn(['mutes', me, 'isLoading'], true)
  case MUTES_FETCH_SUCCESS:
    return normalizeList(state, 'mutes', me, action.accounts, action.next)
  case MUTES_EXPAND_SUCCESS:
    return appendToList(state, 'mutes', me, action.accounts, action.next)
  case MUTES_FETCH_FAIL:
  case MUTES_EXPAND_FAIL:
    return setListFailed(state, 'mutes', me)

  case GROUP_MEMBERS_FETCH_SUCCESS:
    return normalizeList(state, 'groups', action.id, action.accounts, action.next);
  case GROUP_MEMBERS_EXPAND_SUCCESS:
    return appendToList(state, 'groups', action.id, action.accounts, action.next);
  
  case GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS:
    return normalizeList(state, 'groups_removed_accounts', action.id, action.accounts, action.next);
  case GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS:
    return appendToList(state, 'groups_removed_accounts', action.id, action.accounts, action.next);
  case GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS:
    return state.updateIn(['groups_removed_accounts', action.groupId, 'items'], list => list.filterNot(item => item === action.id));
  
  default:
    return state;
  }
};
