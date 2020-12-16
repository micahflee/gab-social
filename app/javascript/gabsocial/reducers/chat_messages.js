import { Map as ImmutableMap, fromJS } from 'immutable'
import {
  CHAT_MESSAGES_SEND_SUCCESS,
  CHAT_MESSAGES_DELETE_REQUEST,
  CHAT_MESSAGES_PURGE_REQUEST,
} from '../actions/chat_messages'
import {
  CHAT_MESSAGES_IMPORT,
} from '../actions/importer'

const importChatMessage = (state, chatMessage) => state.set(chatMessage.id, fromJS(chatMessage))

const importChatMessages = (state, chatMessages) =>
  state.withMutations((mutable) => chatMessages.forEach((chatMessage) => importChatMessage(mutable, chatMessage)))

const deleteChatMessage = (state, id) => {
  return state.delete(id)
}

const initialState = ImmutableMap()

export default function chat_messages(state = initialState, action) {
  switch(action.type) {
  case CHAT_MESSAGES_IMPORT:
    return importChatMessages(state, action.chatMessages)
  case CHAT_MESSAGES_SEND_SUCCESS:
    return importChatMessage(state, action.chatMessage)
  case CHAT_MESSAGES_DELETE_REQUEST:
    return deleteChatMessage(state, action.chatMessageId)
  case CHAT_MESSAGES_PURGE_REQUEST:
    return state
  default:
    return state
  }
}
