import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import {
  CHAT_CONVERSATIONS_APPROVED_FETCH_REQUEST,
  CHAT_CONVERSATIONS_APPROVED_FETCH_SUCCESS,
  CHAT_CONVERSATIONS_APPROVED_FETCH_FAIL,
  CHAT_CONVERSATIONS_APPROVED_EXPAND_REQUEST,
  CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS,
  CHAT_CONVERSATIONS_APPROVED_EXPAND_FAIL,

  CHAT_CONVERSATIONS_REQUESTED_FETCH_REQUEST,
  CHAT_CONVERSATIONS_REQUESTED_FETCH_SUCCESS,
  CHAT_CONVERSATIONS_REQUESTED_FETCH_FAIL,
  CHAT_CONVERSATIONS_REQUESTED_EXPAND_REQUEST,
  CHAT_CONVERSATIONS_REQUESTED_EXPAND_SUCCESS,
  CHAT_CONVERSATIONS_REQUESTED_EXPAND_FAIL,

  CHAT_CONVERSATION_REQUEST_APPROVE_SUCCESS,
} from '../actions/chat_conversations'

const initialState = ImmutableMap({
  approved: ImmutableMap({
    next: null,
    isLoading: false,
    items: ImmutableList(),
  }),
  requested: ImmutableMap({
    next: null,
    isLoading: false,
    items: ImmutableList(),
  }),
})

const normalizeList = (state, source, chatConversations, next) => {
  return state.update(source, listMap => listMap.withMutations(map => {
    map.set('next', next)
    map.set('loaded', true)
    map.set('isLoading', false)
    map.set('items', ImmutableList(chatConversations.map(chatConversation => chatConversation.chat_conversation_id)))
  }))
}

const appendToList = (state, source, chatConversations, next) => {
  return state.update(source, listMap => listMap.withMutations(map => {
    map.set('next', next)
    map.set('isLoading', false)
    map.set('items', map.get('items').concat(chatConversations.map(chatConversation => chatConversation.chat_conversation_id)))
  }))
}

const removeOneFromList = (state, source, chatConversationId) => {
  return state.update(source, listMap => listMap.withMutations(map => {
    map.set('items', map.get('items').filter(id => id !== chatConversationId))
  }))
}

export default function chat_conversation_lists(state = initialState, action) {
  switch (action.type) {
  case CHAT_CONVERSATIONS_APPROVED_FETCH_REQUEST:
  case CHAT_CONVERSATIONS_APPROVED_EXPAND_REQUEST:
    return state.setIn(['approved', 'isLoading'], true)
  case CHAT_CONVERSATIONS_APPROVED_FETCH_FAIL:
  case CHAT_CONVERSATIONS_APPROVED_EXPAND_FAIL:
    return state.setIn(['approved', 'isLoading'], false)
  case CHAT_CONVERSATIONS_APPROVED_FETCH_SUCCESS:
    return normalizeList(state, 'approved', action.chatConversations, action.next)
  case CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS:
    return appendToList(state, 'approved', action.chatConversations, action.next)
  
  case CHAT_CONVERSATIONS_REQUESTED_FETCH_REQUEST:
  case CHAT_CONVERSATIONS_REQUESTED_EXPAND_REQUEST:
    return state.setIn(['requested', 'isLoading'], true)
  case CHAT_CONVERSATIONS_REQUESTED_FETCH_FAIL:
  case CHAT_CONVERSATIONS_REQUESTED_EXPAND_FAIL:
    return state.setIn(['requested', 'isLoading'], false)
  case CHAT_CONVERSATIONS_REQUESTED_FETCH_SUCCESS:
    return normalizeList(state, 'requested', action.chatConversations, action.next) 
  case CHAT_CONVERSATIONS_REQUESTED_EXPAND_SUCCESS:
    return appendToList(state, 'requested', action.chatConversations, action.next)

  case CHAT_CONVERSATION_REQUEST_APPROVE_SUCCESS:
    return removeOneFromList(state, 'requested', action.chatConversation.chat_conversation_id)
  default:
    return state
  }
}
