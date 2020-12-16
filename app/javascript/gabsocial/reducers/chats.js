import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable'
import { me } from '../initial_state'
import {
  CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS_SUCCESS,
  SET_CHAT_CONVERSATION_SELECTED,
} from '../actions/chats'
import {
  CHAT_CONVERSATION_APPROVED_UNREAD_COUNT_FETCH_SUCCESS,
  CHAT_CONVERSATION_REQUESTED_COUNT_FETCH_SUCCESS,
  CHAT_CONVERSATION_MARK_READ_FETCH,
} from '../actions/chat_conversations'
import { 
  CHAT_MESSAGES_FETCH_SUCCESS,
  CHAT_CONVERSATION_MESSAGES_EXPAND_SUCCESS,
} from '../actions/chat_messages'

const initialState = ImmutableMap({
  createChatConversationSuggestionIds: ImmutableList(),
  selectedChatConversationId: null,
  chatConversationRequestCount: 0,
  chatsUnreadCount: 0,
})

export default function chats(state = initialState, action) {
  switch(action.type) {
  case CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS_SUCCESS:
    return state.set('createChatConversationSuggestionIds', ImmutableList(action.accounts.map((item) => item.id)))
  case SET_CHAT_CONVERSATION_SELECTED:
    return state.set('selectedChatConversationId', action.chatConversationId)
  case CHAT_CONVERSATION_REQUESTED_COUNT_FETCH_SUCCESS:
    return state.set('chatConversationRequestCount', action.count)
  case CHAT_CONVERSATION_APPROVED_UNREAD_COUNT_FETCH_SUCCESS:
    return state.set('chatsUnreadCount', action.count)
  case CHAT_CONVERSATION_MARK_READ_FETCH:
    const chatConversationUnreadCount = action.chatConversation.get('unread_count')
    const totalUnreadCount = state.get('chatsUnreadCount')
    return state.set('chatsUnreadCount', Math.max(totalUnreadCount - chatConversationUnreadCount, 0))
  default:
    return state
  }
}
