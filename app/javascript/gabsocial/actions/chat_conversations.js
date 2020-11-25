import api, { getLinks } from '../api'
import { fetchRelationships } from './accounts'
import { importFetchedAccounts } from './importer'
import { me } from '../initial_state'

export const CONVERSATION_BLOCKS_FETCH_REQUEST = 'CONVERSATION_BLOCKS_FETCH_REQUEST'
export const CONVERSATION_BLOCKS_FETCH_SUCCESS = 'CONVERSATION_BLOCKS_FETCH_SUCCESS'
export const CONVERSATION_BLOCKS_FETCH_FAIL    = 'CONVERSATION_BLOCKS_FETCH_FAIL'

export const CONVERSATION_BLOCKS_EXPAND_REQUEST = 'CONVERSATION_BLOCKS_EXPAND_REQUEST'
export const CONVERSATION_BLOCKS_EXPAND_SUCCESS = 'CONVERSATION_BLOCKS_EXPAND_SUCCESS'
export const CONVERSATION_BLOCKS_EXPAND_FAIL    = 'CONVERSATION_BLOCKS_EXPAND_FAIL'

export const BLOCK_MESSAGER_REQUEST = 'BLOCK_MESSAGER_REQUEST'
export const BLOCK_MESSAGER_SUCCESS = 'BLOCK_MESSAGER_SUCCESS'
export const BLOCK_MESSAGER_FAIL    = 'BLOCK_MESSAGER_FAIL'

export const UNBLOCK_MESSAGER_REQUEST = 'UNBLOCK_MESSAGER_REQUEST'
export const UNBLOCK_MESSAGER_SUCCESS = 'UNBLOCK_MESSAGER_SUCCESS'
export const UNBLOCK_MESSAGER_FAIL    = 'UNBLOCK_MESSAGER_FAIL'

//

export const CONVERSATION_MUTES_FETCH_REQUEST = 'CONVERSATION_MUTES_FETCH_REQUEST'
export const CONVERSATION_MUTES_FETCH_SUCCESS = 'CONVERSATION_MUTES_FETCH_SUCCESS'
export const CONVERSATION_MUTES_FETCH_FAIL    = 'CONVERSATION_MUTES_FETCH_FAIL'

export const CONVERSATION_MUTES_EXPAND_REQUEST = 'CONVERSATION_MUTES_EXPAND_REQUEST'
export const CONVERSATION_MUTES_EXPAND_SUCCESS = 'CONVERSATION_MUTES_EXPAND_SUCCESS'
export const CONVERSATION_MUTES_EXPAND_FAIL    = 'CONVERSATION_MUTES_EXPAND_FAIL'

export const MUTE_MESSAGER_REQUEST = 'BLOCK_MESSAGER_REQUEST'
export const MUTE_MESSAGER_SUCCESS = 'BLOCK_MESSAGER_SUCCESS'
export const MUTE_MESSAGER_FAIL    = 'BLOCK_MESSAGER_FAIL'

export const UNMUTE_MESSAGER_REQUEST = 'UNMUTE_MESSAGER_REQUEST'
export const UNMUTE_MESSAGER_SUCCESS = 'UNMUTE_MESSAGER_SUCCESS'
export const UNMUTE_MESSAGER_FAIL    = 'UNMUTE_MESSAGER_FAIL'

//

export const CONVERSATION_REQUEST_APPROVE_SUCCESS = 'CONVERSATION_REQUEST_APPROVE_SUCCESS'
export const CONVERSATION_REQUEST_APPROVE_FAIL    = 'CONVERSATION_REQUEST_APPROVE_FAIL'

export const CONVERSATION_REQUEST_REJECT_SUCCESS = 'CONVERSATION_REQUEST_REJECT_SUCCESS'
export const CONVERSATION_REQUEST_REJECT_FAIL    = 'CONVERSATION_REQUEST_REJECT_FAIL'

export const CONVERSATION_DELETE_REQUEST = 'CONVERSATION_DELETE_REQUEST'
export const CONVERSATION_DELETE_SUCCESS = 'CONVERSATION_DELETE_SUCCESS'
export const CONVERSATION_DELETE_FAIL    = 'CONVERSATION_DELETE_FAIL'

//

export const CONVERSATIONS_FETCH_REQUEST = 'CONVERSATIONS_FETCH_REQUEST'
export const CONVERSATIONS_FETCH_SUCCESS = 'CONVERSATIONS_FETCH_SUCCESS'
export const CONVERSATIONS_FETCH_FAIL    = 'CONVERSATIONS_FETCH_FAIL'

export const CONVERSATIONS_EXPAND_REQUEST = 'CONVERSATIONS_EXPAND_REQUEST'
export const CONVERSATIONS_EXPAND_SUCCESS = 'CONVERSATIONS_EXPAND_SUCCESS'
export const CONVERSATIONS_EXPAND_FAIL    = 'CONVERSATIONS_EXPAND_FAIL'

/**
 * 
 */
export const blockMessenger = (accountId) => (dispatch, getState) => {
  if (!accountId) return

  dispatch(blockMessengerRequest(accountId))

  api(getState).post(`/api/v1/messages/accounts/${accountId}/block`).then((response) => {
    dispatch(blockMessengerSuccess(response.data))
  }).catch((error) => {
    dispatch(blockMessengerFail(accountId, error))
  })
}

const blockMessengerRequest = (accountId) => ({
  type: BLOCK_MESSAGER_REQUEST,
  accountId,
})

const blockMessengerSuccess = (data) => ({
  type: BLOCK_MESSAGER_REQUEST,
  data,
})

const blockMessengerFail = (accountId, error) => ({
  type: BLOCK_MESSAGER_REQUEST,
  accountId,
  error,
})

/**
 *
 */
export const unblockMessenger = (accountId) => (dispatch, getState) => {
  if (!accountId) return

  dispatch(unblockMessengerRequest(accountId))

  api(getState).post(`/api/v1/messages/accounts/${accountId}/unblock`).then((response) => {
    dispatch(unblockMessengerSuccess(response.data))
  }).catch((error) => {
    dispatch(unblockMessengerFail(accountId, error))
  })
}

const unblockMessengerRequest = (accountId) => ({
  type: UNBLOCK_MESSAGER_REQUEST,
  accountId,
})

const blockMessengerSuccess = (data) => ({
  type: UNBLOCK_MESSAGER_REQUEST,
  data,
})

const blockMessengerFail = (accountId, error) => ({
  type: UNBLOCK_MESSAGER_REQUEST,
  accountId,
  error,
})

/**
 * 
 */
export const fetchBlocks = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchBlocksRequest())

  api(getState).get('/api/v1/blocks').then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchBlocksSuccess(response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch(error => dispatch(fetchBlocksFail(error)))
}

export const fetchBlocksRequest = () => ({
  type: BLOCKS_FETCH_REQUEST,
})

export const fetchBlocksSuccess = (accounts, next) => ({
  type: BLOCKS_FETCH_SUCCESS,
  accounts,
  next,
})

export const fetchBlocksFail = (error) => ({
  type: BLOCKS_FETCH_FAIL,
  error,
})

/**
 * 
 */
export const expandBlocks = () => (dispatch, getState) => {
  if (!me) return
  
  const url = getState().getIn(['user_lists', 'blocks', me, 'next'])
  const isLoading = getState().getIn(['user_lists', 'blocks', me, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandBlocksRequest())

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedAccounts(response.data))
    dispatch(expandBlocksSuccess(response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch(error => dispatch(expandBlocksFail(error)))
}

export const expandBlocksRequest = () => ({
  type: BLOCKS_EXPAND_REQUEST,
})

export const expandBlocksSuccess = (accounts, next) => ({
  type: BLOCKS_EXPAND_SUCCESS,
  accounts,
  next,
})

export const expandBlocksFail = (error) => ({
  type: BLOCKS_EXPAND_FAIL,
  error,
})
