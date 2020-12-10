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

export const IS_CHAT_MESSENGER_BLOCKED_SUCCESS = 'IS_CHAT_MESSENGER_BLOCKED_SUCCESS'

//

export const CHAT_MESSENGER_MUTES_FETCH_REQUEST = 'CHAT_MESSENGER_MUTES_FETCH_REQUEST'
export const CHAT_MESSENGER_MUTES_FETCH_SUCCESS = 'CHAT_MESSENGER_MUTES_FETCH_SUCCESS'
export const CHAT_MESSENGER_MUTES_FETCH_FAIL    = 'CHAT_MESSENGER_MUTES_FETCH_FAIL'

export const CHAT_MESSENGER_MUTES_EXPAND_REQUEST = 'CHAT_MESSENGER_MUTES_EXPAND_REQUEST'
export const CHAT_MESSENGER_MUTES_EXPAND_SUCCESS = 'CHAT_MESSENGER_MUTES_EXPAND_SUCCESS'
export const CHAT_MESSENGER_MUTES_EXPAND_FAIL    = 'CHAT_MESSENGER_MUTES_EXPAND_FAIL'

export const MUTE_CHAT_MESSAGER_REQUEST = 'MUTE_CHAT_MESSAGER_REQUEST'
export const MUTE_CHAT_MESSAGER_SUCCESS = 'MUTE_CHAT_MESSAGER_SUCCESS'
export const MUTE_CHAT_MESSAGER_FAIL    = 'MUTE_CHAT_MESSAGER_FAIL'

export const UNMUTE_CHAT_MESSAGER_REQUEST = 'UNMUTE_CHAT_MESSAGER_REQUEST'
export const UNMUTE_CHAT_MESSAGER_SUCCESS = 'UNMUTE_CHAT_MESSAGER_SUCCESS'
export const UNMUTE_CHAT_MESSAGER_FAIL    = 'UNMUTE_CHAT_MESSAGER_FAIL'

export const IS_CHAT_MESSENGER_MUTED_SUCCESS = 'IS_CHAT_MESSENGER_MUTED_SUCCESS'

/**
 * 
 */
export const blockChatMessenger = (accountId) => (dispatch, getState) => {
  if (!me || !accountId) return

  dispatch(blockChatMessengerRequest(accountId))
  
  api(getState).post(`/api/v1/chat_conversation_accounts/${accountId}/block_messenger`).then((response) => {
    dispatch(blockChatMessengerSuccess())
  }).catch((error) => {
    dispatch(blockChatMessengerFail(accountId, error))
  })
}

const blockChatMessengerRequest = (accountId) => ({
  type: BLOCK_CHAT_MESSAGER_REQUEST,
  accountId,
})

const blockChatMessengerSuccess = () => ({
  type: BLOCK_CHAT_MESSAGER_SUCCESS,
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

  api(getState).post(`/api/v1/chat_conversation_accounts/${accountId}/unblock_messenger`).then((response) => {
    dispatch(unblockChatMessengerSuccess())
  }).catch((error) => {
    dispatch(unblockChatMessengerFail(accountId, error))
  })
}

const unblockChatMessengerRequest = (accountId) => ({
  type: UNBLOCK_CHAT_MESSAGER_REQUEST,
  accountId,
})

const unblockChatMessengerSuccess = () => ({
  type: UNBLOCK_CHAT_MESSAGER_REQUEST,
  showToast: true,
})

const unblockChatMessengerFail = (accountId, error) => ({
  type: UNBLOCK_CHAT_MESSAGER_REQUEST,
  showToast: true,
  accountId,
  error,
})

/**
 * @description Check if a chat messenger is blocked by the current user account.
 * @param {String} accountId
 */
export const isChatMessengerBlocked = (accountId) => (dispatch, getState) => {
  if (!me || !accountId) return

  api(getState).post(`/api/v1/chat_conversation_accounts/${accountId}/is_messenger_blocked`).then((response) => {
    dispatch(isChatMessengerBlockedSuccess(response.data))
  })
}

const isChatMessengerBlockedSuccess = (data) => ({
  type: IS_CHAT_MESSENGER_BLOCKED_SUCCESS,
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
export const muteChatMessenger = (accountId) => (dispatch, getState) => {
  if (!me || !accountId) return

  dispatch(muteChatMessengerRequest(accountId))
  
  api(getState).post(`/api/v1/chat_conversation_accounts/${accountId}/mute_messenger`).then((response) => {
    dispatch(muteChatMessengerSuccess())
  }).catch((error) => {
    dispatch(muteChatMessengerFail(accountId, error))
  })
}

const muteChatMessengerRequest = (accountId) => ({
  type: MUTE_CHAT_MESSAGER_REQUEST,
  accountId,
})

const muteChatMessengerSuccess = () => ({
  type: MUTE_CHAT_MESSAGER_SUCCESS,
  showToast: true,
})

const muteChatMessengerFail = (accountId, error) => ({
  type: MUTE_CHAT_MESSAGER_FAIL,
  showToast: true,
  accountId,
  error,
})

/**
 *
 */
export const unmuteChatMessenger = (accountId) => (dispatch, getState) => {
  if (!me || !accountId) return

  dispatch(unmuteChatMessengerRequest(accountId))

  api(getState).post(`/api/v1/chat_conversation_accounts/${accountId}/unmute_messenger`).then((response) => {
    dispatch(unmuteChatMessengerSuccess())
  }).catch((error) => {
    dispatch(unmuteChatMessengerFail(accountId, error))
  })
}

const unmuteChatMessengerRequest = (accountId) => ({
  type: UNMUTE_CHAT_MESSAGER_REQUEST,
  accountId,
})

const unmuteChatMessengerSuccess = () => ({
  type: UNMUTE_CHAT_MESSAGER_REQUEST,
  showToast: true,
})

const unmuteChatMessengerFail = (accountId, error) => ({
  type: UNMUTE_CHAT_MESSAGER_REQUEST,
  showToast: true,
  accountId,
  error,
})

/**
 * @description Check if a chat messenger is muted by the current user account.
 * @param {String} accountId
 */
export const isChatMessengerMuted = (accountId) => (dispatch, getState) => {
  if (!me || !accountId) return

  api(getState).post(`/api/v1/chat_conversation_accounts/${accountId}/is_messenger_muted`).then((response) => {
    dispatch(isChatMessengerMutedSuccess(response.data))
  })
}

const isChatMessengerMutedSuccess = (data) => ({
  type: IS_CHAT_MESSENGER_MUTED_SUCCESS,
  data,
})

/**
 * 
 */
export const fetchChatMessengerMutes = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchChatMessengerMutesRequest())

  api(getState).get('/api/v1/chat_conversation_accounts/muted_chat_accounts').then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchChatMessengerMutesSuccess(response.data, next ? next.uri : null))
  }).catch(error => dispatch(fetchChatMessengerMutesFail(error)))
}

export const fetchChatMessengerMutesRequest = () => ({
  type: CHAT_MESSENGER_MUTES_FETCH_REQUEST,
})

export const fetchChatMessengerMutesSuccess = (accounts, next) => ({
  type: CHAT_MESSENGER_MUTES_FETCH_SUCCESS,
  accounts,
  next,
})

export const fetchChatMessengerMutesFail = (error) => ({
  type: CHAT_MESSENGER_MUTES_FETCH_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const expandChatMessengerMutes = () => (dispatch, getState) => {
  if (!me) return
  
  const url = getState().getIn(['user_lists', 'chat_mutes', me, 'next'])
  const isLoading = getState().getIn(['user_lists', 'chat_mutes', me, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandChatMessengerMutesRequest())

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(expandChatMessengerMutesSuccess(response.data, next ? next.uri : null))
  }).catch(error => dispatch(expandChatMessengerMutesFail(error)))
}

export const expandChatMessengerMutesRequest = () => ({
  type: CHAT_MESSENGER_MUTES_EXPAND_REQUEST,
})

export const expandChatMessengerMutesSuccess = (accounts, next) => ({
  type: CHAT_MESSENGER_MUTES_EXPAND_SUCCESS,
  accounts,
  next,
})

export const expandChatMessengerMutesFail = (error) => ({
  type: CHAT_MESSENGER_MUTES_EXPAND_FAIL,
  error,
})

