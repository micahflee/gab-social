import api, { getLinks } from '../api'
import { importFetchedAccounts } from './importer'
import { me } from '../initial_state'

//

export const CHAT_MESSENGER_BLOCKS_FETCH_REQUEST = 'CHAT_MESSENGER_BLOCKS_FETCH_REQUEST'
export const CHAT_MESSENGER_BLOCKS_FETCH_SUCCESS = 'CHAT_MESSENGER_BLOCKS_FETCH_SUCCESS'
export const CHAT_MESSENGER_BLOCKS_FETCH_FAIL    = 'CHAT_MESSENGER_BLOCKS_FETCH_FAIL'

export const CHAT_MESSENGER_BLOCKS_EXPAND_REQUEST = 'CHAT_MESSENGER_BLOCKS_EXPAND_REQUEST'
export const CHAT_MESSENGER_BLOCKS_EXPAND_SUCCESS = 'CHAT_MESSENGER_BLOCKS_EXPAND_SUCCESS'
export const CHAT_MESSENGER_BLOCKS_EXPAND_FAIL    = 'CHAT_MESSENGER_BLOCKS_EXPAND_FAIL'

export const BLOCK_CHAT_MESSAGER_REQUEST = 'BLOCK_CHAT_MESSAGER_REQUEST'
export const BLOCK_CHAT_MESSAGER_SUCCESS = 'BLOCK_CHAT_MESSAGER_SUCCESS'
export const BLOCK_CHAT_MESSAGER_FAIL    = 'BLOCK_CHAT_MESSAGER_FAIL'

export const UNBLOCK_CHAT_MESSAGER_REQUEST = 'UNBLOCK_CHAT_MESSAGER_REQUEST'
export const UNBLOCK_CHAT_MESSAGER_SUCCESS = 'UNBLOCK_CHAT_MESSAGER_SUCCESS'
export const UNBLOCK_CHAT_MESSAGER_FAIL    = 'UNBLOCK_CHAT_MESSAGER_FAIL'

export const FETCH_CHAT_MESSENGER_BLOCKING_RELATIONSHIPS_SUCCESS = 'FETCH_CHAT_MESSENGER_BLOCKING_RELATIONSHIPS_SUCCESS'

//

export const MUTE_CHAT_CONVERSATION_REQUEST = 'MUTE_CHAT_CONVERSATION_REQUEST'
export const MUTE_CHAT_CONVERSATION_SUCCESS = 'MUTE_CHAT_CONVERSATION_SUCCESS'
export const MUTE_CHAT_CONVERSATION_FAIL    = 'MUTE_CHAT_CONVERSATION_FAIL'

export const UNMUTE_CHAT_CONVERSATION_REQUEST = 'UNMUTE_CHAT_CONVERSATION_REQUEST'
export const UNMUTE_CHAT_CONVERSATION_SUCCESS = 'UNMUTE_CHAT_CONVERSATION_SUCCESS'
export const UNMUTE_CHAT_CONVERSATION_FAIL    = 'UNMUTE_CHAT_CONVERSATION_FAIL'

/**
 * 
 */
export const blockChatMessenger = (accountId) => (dispatch, getState) => {
  if (!me || !accountId) return

  dispatch(blockChatMessengerRequest(accountId))
  
  api(getState).post(`/api/v1/chat_conversation_accounts/_/block_messenger`, { account_id: accountId }).then((response) => {
    dispatch(blockChatMessengerSuccess(response.data))
  }).catch((error) => {
    dispatch(blockChatMessengerFail(accountId, error))
  })
}

const blockChatMessengerRequest = (accountId) => ({
  type: BLOCK_CHAT_MESSAGER_REQUEST,
  accountId,
})

const blockChatMessengerSuccess = (data) => ({
  type: BLOCK_CHAT_MESSAGER_SUCCESS,
  data,
  showToast: true,
})

const blockChatMessengerFail = (accountId, error) => ({
  type: BLOCK_CHAT_MESSAGER_FAIL,
  showToast: true,
  accountId,
  error,
})

/**
 *
 */
export const unblockChatMessenger = (accountId) => (dispatch, getState) => {
  if (!me || !accountId) return

  dispatch(unblockChatMessengerRequest(accountId))

  api(getState).post(`/api/v1/chat_conversation_accounts/_/unblock_messenger`, { account_id: accountId }).then((response) => {
    dispatch(unblockChatMessengerSuccess(response.data))
  }).catch((error) => {
    dispatch(unblockChatMessengerFail(accountId, error))
  })
}

const unblockChatMessengerRequest = (accountId) => ({
  type: UNBLOCK_CHAT_MESSAGER_REQUEST,
  accountId,
})

const unblockChatMessengerSuccess = (data) => ({
  type: UNBLOCK_CHAT_MESSAGER_SUCCESS,
  data,
  showToast: true,
})

const unblockChatMessengerFail = (accountId, error) => ({
  type: UNBLOCK_CHAT_MESSAGER_FAIL,
  showToast: true,
  accountId,
  error,
})

/**
 * @description Check if a chat messenger is blocked by the current user account.
 * @param {String} accountId
 */
export const fetchMessengerBlockingRelationships = (accountId) => (dispatch, getState) => {
  if (!me || !accountId) return

  api(getState).post(`/api/v1/chat_conversation_accounts/_/messenger_block_relationships`, { account_id: accountId }).then((response) => {
    dispatch(fetchMessengerBlockingRelationshipsSuccess(response.data))
  })
}

const fetchMessengerBlockingRelationshipsSuccess = (data) => ({
  type: FETCH_CHAT_MESSENGER_BLOCKING_RELATIONSHIPS_SUCCESS,
  data,
})

/**
 * 
 */
export const fetchChatMessengerBlocks = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchChatMessengerBlocksRequest())

  api(getState).get('/api/v1/chat_conversation_accounts/blocked_chat_accounts').then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchChatMessengerBlocksSuccess(response.data, next ? next.uri : null))
  }).catch(error => dispatch(fetchChatMessengerBlocksFail(error)))
}

export const fetchChatMessengerBlocksRequest = () => ({
  type: CHAT_MESSENGER_BLOCKS_FETCH_REQUEST,
})

export const fetchChatMessengerBlocksSuccess = (accounts, next) => ({
  type: CHAT_MESSENGER_BLOCKS_FETCH_SUCCESS,
  accounts,
  next,
})

export const fetchChatMessengerBlocksFail = (error) => ({
  type: CHAT_MESSENGER_BLOCKS_FETCH_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const expandChatMessengerBlocks = () => (dispatch, getState) => {
  if (!me) return
  
  const url = getState().getIn(['user_lists', 'chat_blocks', me, 'next'])
  const isLoading = getState().getIn(['user_lists', 'chat_blocks', me, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandChatMessengerBlocksRequest())

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(expandChatMessengerBlocksSuccess(response.data, next ? next.uri : null))
  }).catch(error => dispatch(expandChatMessengerBlocksFail(error)))
}

export const expandChatMessengerBlocksRequest = () => ({
  type: CHAT_MESSENGER_BLOCKS_EXPAND_REQUEST,
})

export const expandChatMessengerBlocksSuccess = (accounts, next) => ({
  type: CHAT_MESSENGER_BLOCKS_EXPAND_SUCCESS,
  accounts,
  next,
})

export const expandChatMessengerBlocksFail = (error) => ({
  type: CHAT_MESSENGER_BLOCKS_EXPAND_FAIL,
  error,
})

//

/**
 * 
 */
export const muteChatConversation = (chatConversationId) => (dispatch, getState) => {
  if (!me || !chatConversationId) return

  dispatch(muteChatConversationRequest(chatConversationId))
  
  api(getState).post(`/api/v1/chat_conversation_accounts/${chatConversationId}/mute_chat_conversation`).then((response) => {
    dispatch(muteChatConversationSuccess(response.data))
  }).catch((error) => {
    dispatch(muteChatConversationFail(error))
  })
}

const muteChatConversationRequest = (accountId) => ({
  type: MUTE_CHAT_CONVERSATION_REQUEST,
  accountId,
})

const muteChatConversationSuccess = (chatConversation) => ({
  type: MUTE_CHAT_CONVERSATION_SUCCESS,
  chatConversation,
  showToast: true,
})

const muteChatConversationFail = (error) => ({
  type: MUTE_CHAT_CONVERSATION_FAIL,
  showToast: true,
  error,
})

/**
 *
 */
export const unmuteChatConversation = (chatConversationId) => (dispatch, getState) => {
  if (!me || !chatConversationId) return

  dispatch(unmuteChatConversationRequest(chatConversationId))

  api(getState).post(`/api/v1/chat_conversation_accounts/${chatConversationId}/unmute_chat_conversation`).then((response) => {
    dispatch(unmuteChatConversationSuccess(response.data))
  }).catch((error) => {
    dispatch(unmuteChatConversationFail(error))
  })
}

const unmuteChatConversationRequest = (accountId) => ({
  type: UNMUTE_CHAT_CONVERSATION_REQUEST,
  accountId,
})

const unmuteChatConversationSuccess = (chatConversation) => ({
  type: UNMUTE_CHAT_CONVERSATION_SUCCESS,
  chatConversation,
  showToast: true,
})

const unmuteChatConversationFail = (accountId, error) => ({
  type: UNMUTE_CHAT_CONVERSATION_FAIL,
  showToast: true,
  accountId,
  error,
})
