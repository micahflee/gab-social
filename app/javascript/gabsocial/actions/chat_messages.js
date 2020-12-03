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

/**
 * 
 */
export const sendChatMessage = (text = '', chatConversationId) => (dispatch, getState) => {
  if (!me || !chatConversationId) return
  if (text.length === 0) return

  dispatch(sendMessageRequest())

  api(getState).post('/api/v1/chat_messages', {
    text,
    chat_conversation_id: chatConversationId,
  }, {
    // headers: {
    //   'Idempotency-Key': getState().getIn(['chat_compose`', 'idempotencyKey']),
    // },
  }).then((response) => {
    dispatch(importFetchedChatMessages([response.data]))
    dispatch(sendMessageSuccess(response.data, chatConversationId))
  }).catch((error) => {
    dispatch(sendMessageFail(error))
  })
}

const sendMessageRequest = () => ({
  type: CHAT_MESSAGES_SEND_REQUEST,
})

const sendMessageSuccess = (chatMessage, chatConversationId) => ({
  type: CHAT_MESSAGES_SEND_SUCCESS,
  chatMessage,
  chatConversationId,
})

const sendMessageFail = (error) => ({
  type: CHAT_MESSAGES_SEND_FAIL,
  error,
})

/**
 * 
 */
const deleteMessage = (chatMessageId) => (dispatch, getState) => {
  if (!me || !chatMessageId) return

  dispatch(deleteMessageRequest(chatMessageId))

  api(getState).delete(`/api/v1/chat_messages/${chatMessageId}`, {}, {
    // headers: {
    //   'Idempotency-Key': getState().getIn(['chat_compose', 'idempotencyKey']),
    // },
  }).then((response) => {
    deleteMessageSuccess(response)
  }).catch((error) => {
    dispatch(deleteMessageFail(error))
  })
}

const deleteMessageRequest = (chatMessageId) => ({
  type: CHAT_MESSAGES_DELETE_REQUEST,
  chatMessageId,
})

const deleteMessageSuccess = () => ({
  type: CHAT_MESSAGES_DELETE_SUCCESS,
})

const deleteMessageFail = (error) => ({
  type: CHAT_MESSAGES_DELETE_FAIL,
  error,
})