import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable'
import { me } from '../initial_state'
import { 
  CHAT_CONVERSATIONS_APPROVED_FETCH_SUCCESS,
  CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS,
  CHAT_CONVERSATIONS_REQUESTED_FETCH_SUCCESS,
  CHAT_CONVERSATIONS_REQUESTED_EXPAND_SUCCESS,
  CHAT_CONVERSATION_REQUEST_APPROVE_SUCCESS,
} from '../actions/chat_conversations'

const initialState = ImmutableMap()

export const normalizeChatConversation = (chatConversation) => {
  const { other_accounts, ...rest } = chatConversation
  return fromJS({
    ...rest,
    other_account_ids: other_accounts.map((a) => a.id),
  })
}

const importChatConversation = (state, chatConversation) => state.set(chatConversation.chat_conversation_id, normalizeChatConversation(chatConversation))

const importChatConversations = (state, chatConversations) => {
  return state.withMutations((mutable) => chatConversations.forEach((chatConversation) => importChatConversation(mutable, chatConversation)))
}

export default function chat_conversations(state = initialState, action) {
  switch(action.type) {
  case CHAT_CONVERSATION_REQUEST_APPROVE_SUCCESS:
    return importChatConversation(state, action.chatConversation)
  case CHAT_CONVERSATIONS_APPROVED_FETCH_SUCCESS:
  case CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS:
  case CHAT_CONVERSATIONS_REQUESTED_FETCH_SUCCESS:
  case CHAT_CONVERSATIONS_REQUESTED_EXPAND_SUCCESS:
    return importChatConversations(state, action.chatConversations)
  default:
    return state
  }
}
