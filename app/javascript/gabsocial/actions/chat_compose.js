import api from '../api'
import { me } from '../initial_state'

export const MESSAGE_INPUT_CHANGE = 'MESSAGE_INPUT_CHANGE'
export const MESSAGE_INPUT_RESET  = 'MESSAGE_INPUT_RESET'

/**
 * 
 */
export const messageInputChange = (text) => (dispatch, getState) => {
  if (!me) return

  //Ensure has conversation
  const conversationId = getState().getIn(['chat_conversations', 'current', 'conversation_id'], null)
  if (!conversationId) return

  dispatch({
    type: MESSAGE_INPUT_CHANGE,
    text,
  })
}

/**
 * 
 */
export const messageInputReset = (dispatch) => {
  dispatch({ type: MESSAGE_INPUT_RESET })
}
