import {
  List as ImmutableList,
  Map as ImmutableMap,
  fromJS,
} from 'immutable'
import compareId from '../utils/compare_id'
import {
  CHAT_MESSAGES_SEND_SUCCESS,
  CHAT_MESSAGES_DELETE_REQUEST,
} from '../actions/chat_messages'
import {
  CHAT_CONVERSATION_MESSAGES_EXPAND_REQUEST,
  CHAT_CONVERSATION_MESSAGES_EXPAND_SUCCESS,
  CHAT_CONVERSATION_MESSAGES_EXPAND_FAIL,
  CHAT_CONVERSATION_MESSAGES_CONNECT,
  CHAT_CONVERSATION_MESSAGES_DISCONNECT,
  CHAT_CONVERSATION_MESSAGES_CLEAR,
} from '../actions/chat_conversation_messages'

const initialState = ImmutableMap()

const initialConversation = ImmutableMap({
  unread: 0,
  online: false,
  top: true,
  isLoading: false,
  isError: false,
  hasMore: true,
  items: ImmutableList(),
})

const expandNormalizedChatConversation = (state, chatConversationId, chatMessages, next, isPartial, isLoadingRecent) => {
  return state.update(chatConversationId, initialConversation, map => map.withMutations((mMap) => {
    mMap.set('isLoading', false)
    mMap.set('isPartial', isPartial)

    if (!next && !isLoadingRecent) mMap.set('hasMore', false)

    if (!!chatMessages && !chatMessages.isEmpty()) {
      mMap.update('items', ImmutableList(), oldIds => {
        const newIds = chatMessages.map(chatMessage => chatMessage.get('id'));

        const lastIndex = oldIds.findLastIndex((id) => id !== null && compareId(id, newIds.last()) >= 0) + 1;
        const firstIndex = oldIds.take(lastIndex).findLastIndex(id => id !== null && compareId(id, newIds.first()) > 0);

        if (firstIndex < 0) {
          return (isPartial ? newIds.unshift(null) : newIds).concat(oldIds.skip(lastIndex));
        }

        return oldIds.take(firstIndex + 1).concat(
          isPartial && oldIds.get(firstIndex) !== null ? newIds.unshift(null) : newIds,
          oldIds.skip(lastIndex)
        );
      });
    }
  }));
};

const updateChatMessageConversation = (state, chatConversationId, chatMessage) => {
  const top        = state.getIn([chatConversationId, 'top']);
  const ids        = state.getIn([chatConversationId, 'items'], ImmutableList());
  const includesId = ids.includes(chatMessage.get('id'));
  const unread     = state.getIn([chatConversationId, 'unread'], 0);

  if (includesId) {
    return state;
  }

  let newIds = ids;

  return state.update(chatConversationId, initialConversation, map => map.withMutations(mMap => {
    if (!top) mMap.set('unread', unread + 1);
    // if (top && ids.size > 40) newIds = newIds.take(20);
    mMap.set('items', newIds.unshift(chatMessage.get('id')));
  }));
};

export default function chat_conversation_messages(state = initialState, action) {
  switch (action.type) {
  case CHAT_CONVERSATION_MESSAGES_CONNECT:
    return state.update(action.chatConversationId, initialConversation, map => map.set('online', true))
  case CHAT_CONVERSATION_MESSAGES_DISCONNECT:
    return state.update(
      action.chatConversationId,
      initialConversation,
      map => map.set('online', false).update('items', items => items.first() ? items.unshift(null) : items)
    )
  case CHAT_CONVERSATION_MESSAGES_CLEAR:
    return state.set(chatConversationId, initialTimeline)
  case CHAT_CONVERSATION_MESSAGES_EXPAND_REQUEST:
    return state.update(action.chatConversationId, initialConversation, map => map.set('isLoading', true))
  case CHAT_CONVERSATION_MESSAGES_EXPAND_FAIL:
    return state.update(action.chatConversationId, initialConversation, map => map.withMutations((mMap) => {
      map.set('isLoading', false)
      map.set('isError', true)
    }))
  case CHAT_CONVERSATION_MESSAGES_EXPAND_SUCCESS:
    return expandNormalizedChatConversation(state, action.chatConversationId, fromJS(action.chatMessages), action.next, action.partial, action.isLoadingRecent)
  case CHAT_MESSAGES_SEND_SUCCESS:
    return updateChatMessageConversation(state, action.chatMessage.chat_conversation_id, fromJS(action.chatMessage))
  case CHAT_MESSAGES_DELETE_REQUEST:
    // : todo : 
    return state
  default:
    return state
  }
}
