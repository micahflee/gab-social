import { Map as ImmutableMap, List as ImmutableList, toJS } from 'immutable'
import noop from 'lodash.noop'
import api from '../api'
import { me } from '../initial_state'
import { importFetchedChatMessages } from './importer'

export const CHAT_MESSAGES_SEND_REQUEST = 'CHAT_MESSAGES_SEND_REQUEST'
export const CHAT_MESSAGES_SEND_SUCCESS = 'CHAT_MESSAGES_SEND_SUCCESS'
export const CHAT_MESSAGES_SEND_FAIL    = 'CHAT_MESSAGES_SEND_FAIL'

export const CHAT_MESSAGES_DELETE_REQUEST = 'CHAT_MESSAGES_DELETE_REQUEST'
export const CHAT_MESSAGES_DELETE_SUCCESS = 'CHAT_MESSAGES_DELETE_SUCCESS'
export const CHAT_MESSAGES_DELETE_FAIL    = 'CHAT_MESSAGES_DELETE_FAIL'

export const CHAT_MESSAGES_PURGE_REQUEST = 'CHAT_MESSAGES_PURGE_REQUEST'
export const CHAT_MESSAGES_PURGE_SUCCESS = 'CHAT_MESSAGES_PURGE_SUCCESS'
export const CHAT_MESSAGES_PURGE_FAIL    = 'CHAT_MESSAGES_PURGE_FAIL'

/**
 * 
 */
export const sendChatMessage = (text = '', chatConversationId) => (dispatch, getState) => {
  if (!me || !chatConversationId) return
  if (text.length === 0) return

  dispatch(sendChatMessageRequest(chatConversationId))

  api(getState).post('/api/v1/chat_messages', {
    text,
    chat_conversation_id: chatConversationId,
  }, {
    // headers: {
    //   'Idempotency-Key': getState().getIn(['chat_compose`', 'idempotencyKey']),
    // },
  }).then((response) => {
    dispatch(importFetchedChatMessages([response.data]))
    dispatch(sendChatMessageSuccess(response.data))
  }).catch((error) => {
    dispatch(sendChatMessageFail(error))
  })
}

const sendChatMessageRequest = (chatConversationId) => ({
  type: CHAT_MESSAGES_SEND_REQUEST,
  chatConversationId,
})

export const sendChatMessageSuccess = (chatMessage) => ({
  type: CHAT_MESSAGES_SEND_SUCCESS,
  chatMessage,
})

const sendChatMessageFail = (error) => ({
  type: CHAT_MESSAGES_SEND_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const manageIncomingChatMessage = (chatMessage) => (dispatch, getState) => {
  if (!chatMessage) return

  dispatch(sendChatMessageSuccess(chatMessage))

  const isOnline = getState().getIn(['chat_conversation_messages', chatMessage.chat_conversation_id, 'online'])

  // : todo :
  // Check if is online for conversation, if not increase total/convo unread count 
}

/**
 * 
 */
export const deleteChatMessage = (chatMessageId) => (dispatch, getState) => {
  if (!me || !chatMessageId) return

  dispatch(deleteChatMessageRequest(chatMessageId))

  api(getState).delete(`/api/v1/chat_messages/${chatMessageId}`, {}, {
    // headers: {
    //   'Idempotency-Key': getState().getIn(['chat_compose', 'idempotencyKey']),
    // },
  }).then((response) => {
    dispatch(deleteChatMessageSuccess(response.data))
  }).catch((error) => {
    dispatch(deleteChatMessageFail(error))
  })
}

const deleteChatMessageRequest = (chatMessageId) => ({
  type: CHAT_MESSAGES_DELETE_REQUEST,
  chatMessageId,
})

const deleteChatMessageSuccess = () => ({
  type: CHAT_MESSAGES_DELETE_SUCCESS,
  showToast: true,
})

const deleteChatMessageFail = (error) => ({
  type: CHAT_MESSAGES_DELETE_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const purgeChatMessages = (chatConversationId) => (dispatch, getState) => {
  if (!me || !chatConversationId) return

  dispatch(purgeChatMessagesRequest(chatConversationId))

  api(getState).delete(`/api/v1/chat_conversations/messages/${chatConversationId}/destroy_all`).then((response) => {
  dispatch(purgeChatMessagesSuccess(chatConversationId))
  }).catch((error) => {
    dispatch(purgeChatMessagesFail(error))
  })
}

const purgeChatMessagesRequest = (chatConversationId) => ({
  type: CHAT_MESSAGES_PURGE_REQUEST,
  chatConversationId,
})

const purgeChatMessagesSuccess = (chatConversationId) => ({
  type: CHAT_MESSAGES_PURGE_SUCCESS,
  chatConversationId,
  showToast: true,
})

const purgeChatMessagesFail = (error) => ({
  type: CHAT_MESSAGES_PURGE_FAIL,
  showToast: true,
  error,
})