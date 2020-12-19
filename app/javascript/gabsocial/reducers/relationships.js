import {
  ACCOUNT_FOLLOW_SUCCESS,
  ACCOUNT_FOLLOW_REQUEST,
  ACCOUNT_FOLLOW_FAIL,
  ACCOUNT_UNFOLLOW_SUCCESS,
  ACCOUNT_UNFOLLOW_REQUEST,
  ACCOUNT_UNFOLLOW_FAIL,
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_UNBLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
  ACCOUNT_UNMUTE_SUCCESS,
  RELATIONSHIPS_FETCH_SUCCESS,
} from '../actions/accounts'
import {
  FETCH_CHAT_MESSENGER_BLOCKING_RELATIONSHIPS_SUCCESS,
  BLOCK_CHAT_MESSAGER_SUCCESS,
  UNBLOCK_CHAT_MESSAGER_SUCCESS,
} from '../actions/chat_conversation_accounts'
import { Map as ImmutableMap, fromJS } from 'immutable'

const normalizeRelationship = (state, relationship) => state.set(relationship.id, fromJS(relationship))

const normalizeRelationships = (state, relationships) => {
  relationships.forEach(relationship => {
    state = normalizeRelationship(state, relationship)
  })

  return state
}

const initialState = ImmutableMap()

export default function relationships(state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_FOLLOW_REQUEST:
    return state.setIn([action.id, action.locked ? 'requested' : 'following'], true)
  case ACCOUNT_FOLLOW_FAIL:
    return state.setIn([action.id, action.locked ? 'requested' : 'following'], false)
  case ACCOUNT_UNFOLLOW_REQUEST:
    return state.setIn([action.id, 'following'], false)
  case ACCOUNT_UNFOLLOW_FAIL:
    return state.setIn([action.id, 'following'], true)

  case BLOCK_CHAT_MESSAGER_SUCCESS:
  case FETCH_CHAT_MESSENGER_BLOCKING_RELATIONSHIPS_SUCCESS:
  case UNBLOCK_CHAT_MESSAGER_SUCCESS:
    return state.withMutations((map) => {
      if (action.data.chat_blocking !== undefined) map.setIn([data.target_id, 'chat_blocking'], action.data.chat_blocking)
      if (action.data.chat_blocked_by !== undefined) map.setIn([data.target_id, 'chat_blocked_by'], action.data.chat_blocked_by)
    })

  case ACCOUNT_FOLLOW_SUCCESS:
  case ACCOUNT_UNFOLLOW_SUCCESS:
  case ACCOUNT_BLOCK_SUCCESS:
  case ACCOUNT_UNBLOCK_SUCCESS:
  case ACCOUNT_MUTE_SUCCESS:
  case ACCOUNT_UNMUTE_SUCCESS:
    return normalizeRelationship(state, action.relationship)
  case RELATIONSHIPS_FETCH_SUCCESS:
    return normalizeRelationships(state, action.relationships)
  default:
    return state
  }
}