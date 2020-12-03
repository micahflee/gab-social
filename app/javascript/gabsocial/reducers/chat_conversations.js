import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable'
import { me } from '../initial_state'
import {
  CHAT_MESSAGES_SEND_SUCCESS,
  CHAT_MESSAGES_DELETE_REQUEST,
} from '../actions/chat_messages'
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

const setLastChatMessage = (state, chatMessage) => {
  return state.setIn([chatMessage.chat_conversation_id, 'last_chat_message'], fromJS(chatMessage))
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
  case CHAT_MESSAGES_SEND_SUCCESS:
    return setLastChatMessage(state, action.chatMessage)
  case CHAT_MESSAGES_DELETE_REQUEST:
    // : todo : set last conversation message to one prior to this one
    return state
  default:
    return state
  }
}
