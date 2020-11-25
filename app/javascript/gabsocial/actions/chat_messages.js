import api from '../api'
import { me } from '../initial_state'

export const MESSAGE_SEND_REQUEST = 'MESSAGE_SEND_REQUEST'
export const MESSAGE_SEND_SUCCESS = 'MESSAGE_SEND_SUCCESS'
export const MESSAGE_SEND_FAIL    = 'MESSAGE_SEND_FAIL'

export const MESSAGE_DELETE_REQUEST = 'MESSAGE_DELETE_REQUEST'
export const MESSAGE_DELETE_SUCCESS = 'MESSAGE_DELETE_SUCCESS'
export const MESSAGE_DELETE_FAIL    = 'MESSAGE_DELETE_FAIL'

/**
 * 
 */
const sendMessage = (text, conversationId) => (dispatch, getState) => {
  if (!me) return

  // : todo :
  // let text = getState().getIn(['chat_messages', 'text'], '')
  // let conversationId = getState().getIn(['chat_messags', 'conversation_id'], '')
  
  dispatch(sendMessageRequest())

  api(getState).put('/api/v1/messages/chat', {
    text,
    conversationId,
  }, {
    headers: {
      'Idempotency-Key': getState().getIn(['compose', 'idempotencyKey']),
    },
  }).then((response) => {
    sendMessageSuccess(response)
  }).catch((error) => {
    dispatch(sendMessageFail(error))
  })
}

const sendMessageRequest = (text, conversationId) => ({
  type: MESSAGE_SEND_REQUEST,
  text,
  conversationId,
})

const sendMessageSuccess = () => ({
  type: MESSAGE_SEND_SUCCESS,
})

const sendMessageFail = (error) => ({
  type: MESSAGE_SEND_FAIL,
  error,
})

/**
 * 
 */
const deleteMessage = (messageId) => (dispatch, getState) => {
  if (!me || !messageId) return

  // : todo :
  
  dispatch(sendMessageRequest())

  api(getState).delete(`/api/v1/messages/chat/${messageId}`, {}, {
    headers: {
      'Idempotency-Key': getState().getIn(['compose', 'idempotencyKey']),
    },
  }).then((response) => {
    sendMessageSuccess(response)
  }).catch((error) => {
    dispatch(sendMessageFail(error))
  })
}

const deleteMessageRequest = (messageId) => ({
  type: MESSAGE_DELETE_REQUEST,
  messageId,
})

const deleteMessageSuccess = () => ({
  type: MESSAGE_DELETE_SUCCESS,
})

const deleteMessageFail = (error) => ({
  type: MESSAGE_DELETE_FAIL,
  error,
})