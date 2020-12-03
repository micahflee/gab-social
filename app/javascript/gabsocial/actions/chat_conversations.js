import api, { getLinks } from '../api'
import { fetchRelationships } from './accounts'
import { importFetchedAccounts } from './importer'
import { me } from '../initial_state'

//

export const CHAT_CONVERSATIONS_APPROVED_FETCH_REQUEST = 'CHAT_CONVERSATIONS_APPROVED_FETCH_REQUEST'
export const CHAT_CONVERSATIONS_APPROVED_FETCH_SUCCESS = 'CHAT_CONVERSATIONS_APPROVED_FETCH_SUCCESS'
export const CHAT_CONVERSATIONS_APPROVED_FETCH_FAIL    = 'CHAT_CONVERSATIONS_APPROVED_FETCH_FAIL'

export const CHAT_CONVERSATIONS_APPROVED_EXPAND_REQUEST = 'CHAT_CONVERSATIONS_APPROVED_EXPAND_REQUEST'
export const CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS = 'CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS'
export const CHAT_CONVERSATIONS_APPROVED_EXPAND_FAIL    = 'CHAT_CONVERSATIONS_APPROVED_EXPAND_FAIL'

export const CHAT_CONVERSATION_APPROVED_UNREAD_COUNT_FETCH_SUCCESS = 'CHAT_CONVERSATIONS_APPROVED_EXPAND_FAIL'

//

export const CHAT_CONVERSATIONS_CREATE_REQUEST = 'CHAT_CONVERSATIONS_CREATE_REQUEST'
export const CHAT_CONVERSATIONS_CREATE_SUCCESS = 'CHAT_CONVERSATIONS_CREATE_SUCCESS'
export const CHAT_CONVERSATIONS_CREATE_FAIL    = 'CHAT_CONVERSATIONS_CREATE_FAIL'

export const CHAT_CONVERSATIONS_DELETE_REQUEST = 'CHAT_CONVERSATIONS_DELETE_REQUEST'
export const CHAT_CONVERSATIONS_DELETE_SUCCESS = 'CHAT_CONVERSATIONS_DELETE_SUCCESS'
export const CHAT_CONVERSATIONS_DELETE_FAIL    = 'CHAT_CONVERSATIONS_DELETE_FAIL'

//

export const CHAT_CONVERSATION_BLOCKS_FETCH_REQUEST = 'CHAT_CONVERSATION_BLOCKS_FETCH_REQUEST'
export const CHAT_CONVERSATION_BLOCKS_FETCH_SUCCESS = 'CHAT_CONVERSATION_BLOCKS_FETCH_SUCCESS'
export const CHAT_CONVERSATION_BLOCKS_FETCH_FAIL    = 'CHAT_CONVERSATION_BLOCKS_FETCH_FAIL'

export const CHAT_CONVERSATION_BLOCKS_EXPAND_REQUEST = 'CHAT_CONVERSATION_BLOCKS_EXPAND_REQUEST'
export const CHAT_CONVERSATION_BLOCKS_EXPAND_SUCCESS = 'CHAT_CONVERSATION_BLOCKS_EXPAND_SUCCESS'
export const CHAT_CONVERSATION_BLOCKS_EXPAND_FAIL    = 'CHAT_CONVERSATION_BLOCKS_EXPAND_FAIL'

export const BLOCK_MESSAGER_REQUEST = 'BLOCK_MESSAGER_REQUEST'
export const BLOCK_MESSAGER_SUCCESS = 'BLOCK_MESSAGER_SUCCESS'
export const BLOCK_MESSAGER_FAIL    = 'BLOCK_MESSAGER_FAIL'

export const UNBLOCK_MESSAGER_REQUEST = 'UNBLOCK_MESSAGER_REQUEST'
export const UNBLOCK_MESSAGER_SUCCESS = 'UNBLOCK_MESSAGER_SUCCESS'
export const UNBLOCK_MESSAGER_FAIL    = 'UNBLOCK_MESSAGER_FAIL'

//

export const CHAT_CONVERSATION_MUTES_FETCH_REQUEST = 'CHAT_CONVERSATION_MUTES_FETCH_REQUEST'
export const CHAT_CONVERSATION_MUTES_FETCH_SUCCESS = 'CHAT_CONVERSATION_MUTES_FETCH_SUCCESS'
export const CHAT_CONVERSATION_MUTES_FETCH_FAIL    = 'CHAT_CONVERSATION_MUTES_FETCH_FAIL'

export const CHAT_CONVERSATION_MUTES_EXPAND_REQUEST = 'CHAT_CONVERSATION_MUTES_EXPAND_REQUEST'
export const CHAT_CONVERSATION_MUTES_EXPAND_SUCCESS = 'CHAT_CONVERSATION_MUTES_EXPAND_SUCCESS'
export const CHAT_CONVERSATION_MUTES_EXPAND_FAIL    = 'CHAT_CONVERSATION_MUTES_EXPAND_FAIL'

export const MUTE_MESSAGER_REQUEST = 'BLOCK_MESSAGER_REQUEST'
export const MUTE_MESSAGER_SUCCESS = 'BLOCK_MESSAGER_SUCCESS'
export const MUTE_MESSAGER_FAIL    = 'BLOCK_MESSAGER_FAIL'

export const UNMUTE_MESSAGER_REQUEST = 'UNMUTE_MESSAGER_REQUEST'
export const UNMUTE_MESSAGER_SUCCESS = 'UNMUTE_MESSAGER_SUCCESS'
export const UNMUTE_MESSAGER_FAIL    = 'UNMUTE_MESSAGER_FAIL'

//

export const CHAT_CONVERSATION_REQUESTED_COUNT_FETCH_SUCCESS = 'CHAT_CONVERSATION_REQUESTED_COUNT_FETCH_SUCCESS'

export const CHAT_CONVERSATIONS_REQUESTED_FETCH_REQUEST = 'CHAT_CONVERSATIONS_REQUESTED_FETCH_REQUEST'
export const CHAT_CONVERSATIONS_REQUESTED_FETCH_SUCCESS = 'CHAT_CONVERSATIONS_REQUESTED_FETCH_SUCCESS'
export const CHAT_CONVERSATIONS_REQUESTED_FETCH_FAIL    = 'CHAT_CONVERSATIONS_REQUESTED_FETCH_FAIL'

export const CHAT_CONVERSATIONS_REQUESTED_EXPAND_REQUEST = 'CHAT_CONVERSATIONS_REQUESTED_EXPAND_REQUEST'
export const CHAT_CONVERSATIONS_REQUESTED_EXPAND_SUCCESS = 'CHAT_CONVERSATIONS_REQUESTED_EXPAND_SUCCESS'
export const CHAT_CONVERSATIONS_REQUESTED_EXPAND_FAIL    = 'CHAT_CONVERSATIONS_REQUESTED_EXPAND_FAIL'

//

export const CHAT_CONVERSATION_REQUEST_APPROVE_SUCCESS = 'CHAT_CONVERSATION_REQUEST_APPROVE_SUCCESS'
export const CHAT_CONVERSATION_REQUEST_APPROVE_FAIL    = 'CHAT_CONVERSATION_REQUEST_APPROVE_FAIL'

export const CHAT_CONVERSATION_DELETE_REQUEST = 'CHAT_CONVERSATION_DELETE_REQUEST'
export const CHAT_CONVERSATION_DELETE_SUCCESS = 'CHAT_CONVERSATION_DELETE_SUCCESS'
export const CHAT_CONVERSATION_DELETE_FAIL    = 'CHAT_CONVERSATION_DELETE_FAIL'

/**
 * 
 */
export const fetchChatConversations = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchChatConversationsRequest())

  api(getState).get('/api/v1/chat_conversations/approved_conversations').then((response) => {
    console.log("chat_conversations response: ", response)

    const next = getLinks(response).refs.find(link => link.rel === 'next')
    const conversationsAccounts = [].concat.apply([], response.data.map((c) => c.other_accounts))
    const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

    dispatch(importFetchedAccounts(conversationsAccounts))
    // dispatch(importFetchedChatMessages(conversationsChatMessages))
    dispatch(fetchChatConversationsSuccess(response.data, next ? next.uri : null))
  }).catch((error) => {
    console.log("fetchChatConversationsFail:", error)
    dispatch(fetchChatConversationsFail(error))
  })
}

export const fetchChatConversationsRequest = () => ({
  type: CHAT_CONVERSATIONS_APPROVED_FETCH_REQUEST,
})

export const fetchChatConversationsSuccess = (chatConversations, next) => ({
  type: CHAT_CONVERSATIONS_APPROVED_FETCH_SUCCESS,
  chatConversations,
  next,
})

export const fetchChatConversationsFail = (error) => ({
  type: CHAT_CONVERSATIONS_APPROVED_FETCH_FAIL,
  error,
})

/**
 * 
 */
export const expandChatConversations = () => (dispatch, getState) => {
  if (!me) return
  
  const url = getState().getIn(['chat_conversations', 'approved', 'next'])
  const isLoading = getState().getIn(['chat_conversations', 'approved', 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandChatConversationsRequest())

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    const conversationsAccounts = [].concat.apply([], response.data.map((c) => c.other_accounts))
    const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

    dispatch(importFetchedAccounts(conversationsAccounts))
    // dispatch(importFetchedChatMessages(conversationsChatMessages))
    dispatch(expandChatConversationsSuccess(response.data, next ? next.uri : null))
  }).catch(error => dispatch(expandChatConversationsFail(error)))
}

export const expandChatConversationsRequest = () => ({
  type: CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS,
})

export const expandChatConversationsSuccess = (chatConversations, next) => ({
  type: CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS,
  chatConversations,
  next,
})

export const expandChatConversationsFail = (error) => ({
  type: CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS,
  error,
})

/**
 * 
 */
export const fetchChatConversationRequested = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchChatConversationRequestedRequest())

  api(getState).get('/api/v1/chat_conversations/requested_conversations').then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    const conversationsAccounts = [].concat.apply([], response.data.map((c) => c.other_accounts))
    const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

    dispatch(importFetchedAccounts(conversationsAccounts))
    // dispatch(importFetchedChatMessages(conversationsChatMessages))
    dispatch(fetchChatConversationRequestedSuccess(response.data, next ? next.uri : null))
  }).catch((error) => {
    console.log("error:", error)
    dispatch(fetchChatConversationRequestedFail(error))
  })
}

export const fetchChatConversationRequestedRequest = () => ({
  type: CHAT_CONVERSATIONS_REQUESTED_FETCH_REQUEST,
})

export const fetchChatConversationRequestedSuccess = (chatConversations, next) => ({
  type: CHAT_CONVERSATIONS_REQUESTED_FETCH_SUCCESS,
  chatConversations,
  next,
})

export const fetchChatConversationRequestedFail = (error) => ({
  type: CHAT_CONVERSATIONS_REQUESTED_FETCH_FAIL,
  error,
})

/**
 * 
 */
export const expandChatConversationRequested = () => (dispatch, getState) => {
  if (!me) return
  
  const url = getState().getIn(['chat_conversations', 'requested', 'next'])
  const isLoading = getState().getIn(['chat_conversations', 'requested', 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandChatConversationRequestedRequest())

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    const conversationsAccounts = [].concat.apply([], response.data.map((c) => c.other_accounts))
    const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

    dispatch(importFetchedAccounts(conversationsAccounts))
    // dispatch(importFetchedChatMessages(conversationsChatMessages))
    dispatch(expandChatConversationRequestedSuccess(response.data, next ? next.uri : null))
  }).catch(error => dispatch(expandChatConversationRequestedFail(error)))
}

export const expandChatConversationRequestedRequest = () => ({
  type: CHAT_CONVERSATIONS_REQUESTED_EXPAND_REQUEST,
})

export const expandChatConversationRequestedSuccess = (chatConversations, next) => ({
  type: CHAT_CONVERSATIONS_REQUESTED_EXPAND_SUCCESS,
  chatConversations,
  next,
})

export const expandChatConversationRequestedFail = (error) => ({
  type: CHAT_CONVERSATIONS_REQUESTED_EXPAND_FAIL,
  error,
})

/**
 * 
 */
export const createChatConversation = (accountId) => (dispatch, getState) => {
  if (!me || !accountId) return

  dispatch(createChatConversationRequest())

  api(getState).post('/api/v1/chat_conversation', { account_id: accountId }).then((response) => {
    dispatch(createChatConversationSuccess(response.data))
  }).catch((error) => {
    dispatch(createChatConversationFail(error))
  })
}

export const createChatConversationRequest = () => ({
  type: CHAT_CONVERSATIONS_CREATE_REQUEST,
})

export const createChatConversationSuccess = (chatConversation) => ({
  type: CHAT_CONVERSATIONS_CREATE_SUCCESS,
  chatConversation,
})

export const createChatConversationFail = (error) => ({
  type: CHAT_CONVERSATIONS_CREATE_FAIL,
  error,
})

/**
 * 
 */
export const deleteChatConversation = (chatConversationId) => (dispatch, getState) => {
  if (!me || !chatConversationId) return

  dispatch(deleteChatConversationRequest(conversationId))

  api(getState).delete(`/api/v1/chat_conversation/${chatConversationId}`).then((response) => {
    console.log("chat_conversations delete response: ", response)
    dispatch(deleteChatConversationSuccess())
  }).catch((error) => {
    dispatch(deleteChatConversationFail(error))
  })
}

export const deleteChatConversationRequest = (conversationId) => ({
  type: CHAT_CONVERSATIONS_DELETE_REQUEST,
  conversationId,
})

export const deleteChatConversationSuccess = () => ({
  type: CHAT_CONVERSATIONS_DELETE_SUCCESS,
})

export const deleteChatConversationFail = (error) => ({
  type: CHAT_CONVERSATIONS_DELETE_FAIL,
  error,
})


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

const unblockMessengerSuccess = (data) => ({
  type: UNBLOCK_MESSAGER_REQUEST,
  data,
})

const unblockMessengerFail = (accountId, error) => ({
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

// export const fetchBlocksRequest = () => ({
//   type: BLOCKS_FETCH_REQUEST,
// })

// export const fetchBlocksSuccess = (accounts, next) => ({
//   type: BLOCKS_FETCH_SUCCESS,
//   accounts,
//   next,
// })

// export const fetchBlocksFail = (error) => ({
//   type: BLOCKS_FETCH_FAIL,
//   error,
// })

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

// export const expandBlocksRequest = () => ({
//   type: BLOCKS_EXPAND_REQUEST,
// })

// export const expandBlocksSuccess = (accounts, next) => ({
//   type: BLOCKS_EXPAND_SUCCESS,
//   accounts,
//   next,
// })

// export const expandBlocksFail = (error) => ({
//   type: BLOCKS_EXPAND_FAIL,
//   error,
// })

/**
 * 
 */
export const fetchChatConversationRequestedCount = () => (dispatch, getState) => {
  if (!me) return

  api(getState).get('/api/v1/chat_conversations/requested_conversations/count').then(response => {
    dispatch({
      type: CHAT_CONVERSATION_REQUESTED_COUNT_FETCH_SUCCESS,
      count: response.data,
    })
  })
}

/**
 * 
 */
export const fetchChatConversationUnreadCount = () => (dispatch, getState) => {
  if (!me) return

  api(getState).get('/api/v1/chat_conversations/approved_conversations/unread_count').then(response => {
    dispatch({
      type: CHAT_CONVERSATION_APPROVED_UNREAD_COUNT_FETCH_SUCCESS,
      count: response.data,
    })
  })
}

/**
 * 
 */
export const approveChatConversationRequest = (chatConversationId) => (dispatch, getState) => {
  if (!me|| !chatConversationId) return

  api(getState).post(`/api/v1/chat_conversation/${chatConversationId}/mark_chat_conversation_approved`).then((response) => {
    dispatch(approveChatConversationRequestSuccess(response.data))
  }).catch((error) => dispatch(approveChatConversationRequestFail(error)))
}

export const approveChatConversationRequestSuccess = (chatConversation) => ({
  type: CHAT_CONVERSATION_REQUEST_APPROVE_SUCCESS,
  chatConversation,
})

export const approveChatConversationRequestFail = () => ({
  type: CHAT_CONVERSATION_REQUEST_APPROVE_FAIL,
})