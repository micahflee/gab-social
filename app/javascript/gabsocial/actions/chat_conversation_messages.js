import { Map as ImmutableMap, List as ImmutableList, toJS } from 'immutable'
import noop from 'lodash.noop'
import api, { getLinks } from '../api'
import { me } from '../initial_state'
import { importFetchedChatMessages } from './importer'

export const CHAT_CONVERSATION_MESSAGES_EXPAND_REQUEST = 'CHAT_CONVERSATION_MESSAGES_EXPAND_REQUEST'
export const CHAT_CONVERSATION_MESSAGES_EXPAND_SUCCESS = 'CHAT_CONVERSATION_MESSAGES_EXPAND_SUCCESS'
export const CHAT_CONVERSATION_MESSAGES_EXPAND_FAIL    = 'CHAT_CONVERSATION_MESSAGES_EXPAND_FAIL'

//

export const CHAT_CONVERSATION_MESSAGES_CONNECT    = 'CHAT_CONVERSATION_MESSAGES_CONNECT'
export const CHAT_CONVERSATION_MESSAGES_DISCONNECT = 'CHAT_CONVERSATION_MESSAGES_DISCONNECT'
export const CHAT_CONVERSATION_MESSAGES_CLEAR      = 'CHAT_CONVERSATION_MESSAGES_CLEAR'
export const CHAT_CONVERSATION_MESSAGES_SCROLL_BOTTOM = 'CHAT_CONVERSATION_MESSAGES_SCROLL_BOTTOM'

/**
 * 
 */
export const connectChatMessageConversation = (chatConversationId) => ({
  type: CHAT_CONVERSATION_MESSAGES_CONNECT,
  chatConversationId,
})

/**
 * 
 */
export const disconnectChatMessageConversation = (chatConversationId) => ({
  type: CHAT_CONVERSATION_MESSAGES_DISCONNECT,
  chatConversationId,
})

/**
 * 
 */
export const clearChatMessageConversation = (chatConversationId) => (dispatch) => {
  dispatch({
    type: CHAT_CONVERSATION_MESSAGES_CLEAR,
    chatConversationId
  })
}

/**
 * 
 */
export const scrollBottomChatMessageConversation = (chatConversationId, bottom) => ({
  type: CHAT_CONVERSATION_MESSAGES_SCROLL_BOTTOM,
  chatConversationId,
  bottom,
})

/**
 * 
 */
export const expandChatMessages = (chatConversationId, params = {}, done = noop) => (dispatch, getState) => {
  if (!me || !chatConversationId) return

  const chatConversation = getState().getIn(['chat_conversations', chatConversationId], ImmutableMap())
  const isLoadingMore = !!params.maxId

  if (!!chatConversation && (chatConversation.get('isLoading') || chatConversation.get('isError'))) {
    done()
    return
  }

  if (!params.maxId && chatConversation.get('items', ImmutableList()).size > 0) {
    params.sinceId = chatConversation.getIn(['items', 0])
  }

  const isLoadingRecent = !!params.sinceId

  dispatch(expandChatMessagesRequest(chatConversationId, isLoadingMore))

  api(getState).get(`/api/v1/chat_conversations/messages/${chatConversationId}`, {
    params: {
      max_id: params.maxId,
      since_id: params.sinceId,
    }
  }).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedChatMessages(response.data))
    dispatch(expandChatMessagesSuccess(chatConversationId, response.data, next ? next.uri : null, response.code === 206, isLoadingRecent, isLoadingMore))
    done()
  }).catch((error) => {
    dispatch(expandChatMessagesFail(chatConversationId, error, isLoadingMore))
    done()
  })
}

export const expandChatMessagesRequest = (chatConversationId, isLoadingMore) => ({
  type: CHAT_CONVERSATION_MESSAGES_EXPAND_REQUEST,
  chatConversationId,
  skipLoading: !isLoadingMore,
})

export const expandChatMessagesSuccess = (chatConversationId, chatMessages, next, partial, isLoadingRecent, isLoadingMore) => ({
  type: CHAT_CONVERSATION_MESSAGES_EXPAND_SUCCESS,
  chatConversationId,
  chatMessages,
  next,
  partial,
  isLoadingRecent,
  skipLoading: !isLoadingMore,
})

export const expandChatMessagesFail = (chatConversationId, error, isLoadingMore) => ({
  type: CHAT_CONVERSATION_MESSAGES_EXPAND_FAIL,
  showToast: true,
  chatConversationId,
  error,
  skipLoading: !isLoadingMore,
})

