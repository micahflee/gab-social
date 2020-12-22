import api, { getLinks } from '../api'
import debounce from 'lodash.debounce'
import { importFetchedAccounts } from './importer'
import { closeModal } from './modal'
import { setChatConversationSelected } from './chats'
import { me } from '../initial_state'

//

export const CHAT_CONVERSATIONS_APPROVED_FETCH_REQUEST = 'CHAT_CONVERSATIONS_APPROVED_FETCH_REQUEST'
export const CHAT_CONVERSATIONS_APPROVED_FETCH_SUCCESS = 'CHAT_CONVERSATIONS_APPROVED_FETCH_SUCCESS'
export const CHAT_CONVERSATIONS_APPROVED_FETCH_FAIL    = 'CHAT_CONVERSATIONS_APPROVED_FETCH_FAIL'

export const CHAT_CONVERSATIONS_APPROVED_EXPAND_REQUEST = 'CHAT_CONVERSATIONS_APPROVED_EXPAND_REQUEST'
export const CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS = 'CHAT_CONVERSATIONS_APPROVED_EXPAND_SUCCESS'
export const CHAT_CONVERSATIONS_APPROVED_EXPAND_FAIL    = 'CHAT_CONVERSATIONS_APPROVED_EXPAND_FAIL'

export const CHAT_CONVERSATION_APPROVED_UNREAD_COUNT_FETCH_SUCCESS = 'CHAT_CONVERSATION_APPROVED_UNREAD_COUNT_FETCH_SUCCESS'

export const CHAT_CONVERSATION_APPROVED_SEARCH_FETCH_SUCCESS = 'CHAT_CONVERSATION_APPROVED_SEARCH_FETCH_SUCCESS'

//

export const CHAT_CONVERSATIONS_CREATE_REQUEST = 'CHAT_CONVERSATIONS_CREATE_REQUEST'
export const CHAT_CONVERSATIONS_CREATE_SUCCESS = 'CHAT_CONVERSATIONS_CREATE_SUCCESS'
export const CHAT_CONVERSATIONS_CREATE_FAIL    = 'CHAT_CONVERSATIONS_CREATE_FAIL'

export const CHAT_CONVERSATIONS_DELETE_REQUEST = 'CHAT_CONVERSATIONS_DELETE_REQUEST'
export const CHAT_CONVERSATIONS_DELETE_SUCCESS = 'CHAT_CONVERSATIONS_DELETE_SUCCESS'
export const CHAT_CONVERSATIONS_DELETE_FAIL    = 'CHAT_CONVERSATIONS_DELETE_FAIL'

//

export const CHAT_CONVERSATION_REQUESTED_COUNT_FETCH_SUCCESS = 'CHAT_CONVERSATION_REQUESTED_COUNT_FETCH_SUCCESS'

export const CHAT_CONVERSATIONS_REQUESTED_FETCH_REQUEST = 'CHAT_CONVERSATIONS_REQUESTED_FETCH_REQUEST'
export const CHAT_CONVERSATIONS_REQUESTED_FETCH_SUCCESS = 'CHAT_CONVERSATIONS_REQUESTED_FETCH_SUCCESS'
export const CHAT_CONVERSATIONS_REQUESTED_FETCH_FAIL    = 'CHAT_CONVERSATIONS_REQUESTED_FETCH_FAIL'

export const CHAT_CONVERSATIONS_REQUESTED_EXPAND_REQUEST = 'CHAT_CONVERSATIONS_REQUESTED_EXPAND_REQUEST'
export const CHAT_CONVERSATIONS_REQUESTED_EXPAND_SUCCESS = 'CHAT_CONVERSATIONS_REQUESTED_EXPAND_SUCCESS'
export const CHAT_CONVERSATIONS_REQUESTED_EXPAND_FAIL    = 'CHAT_CONVERSATIONS_REQUESTED_EXPAND_FAIL'

//

export const CHAT_CONVERSATIONS_MUTED_FETCH_REQUEST = 'CHAT_CONVERSATIONS_MUTED_FETCH_REQUEST'
export const CHAT_CONVERSATIONS_MUTED_FETCH_SUCCESS = 'CHAT_CONVERSATIONS_MUTED_FETCH_SUCCESS'
export const CHAT_CONVERSATIONS_MUTED_FETCH_FAIL    = 'CHAT_CONVERSATIONS_MUTED_FETCH_FAIL'

export const CHAT_CONVERSATIONS_MUTED_EXPAND_REQUEST = 'CHAT_CONVERSATIONS_MUTED_EXPAND_REQUEST'
export const CHAT_CONVERSATIONS_MUTED_EXPAND_SUCCESS = 'CHAT_CONVERSATIONS_MUTED_EXPAND_SUCCESS'
export const CHAT_CONVERSATIONS_MUTED_EXPAND_FAIL    = 'CHAT_CONVERSATIONS_MUTED_EXPAND_FAIL'

//

export const CHAT_CONVERSATION_REQUEST_APPROVE_SUCCESS = 'CHAT_CONVERSATION_REQUEST_APPROVE_SUCCESS'
export const CHAT_CONVERSATION_REQUEST_APPROVE_FAIL    = 'CHAT_CONVERSATION_REQUEST_APPROVE_FAIL'

export const CHAT_CONVERSATION_DELETE_REQUEST = 'CHAT_CONVERSATION_DELETE_REQUEST'
export const CHAT_CONVERSATION_DELETE_SUCCESS = 'CHAT_CONVERSATION_DELETE_SUCCESS'
export const CHAT_CONVERSATION_DELETE_FAIL    = 'CHAT_CONVERSATION_DELETE_FAIL'

//

export const CHAT_CONVERSATION_MARK_READ_FETCH = 'CHAT_CONVERSATION_MARK_READ_FETCH'
export const CHAT_CONVERSATION_MARK_READ_SUCCESS = 'CHAT_CONVERSATION_MARK_READ_SUCCESS'
export const CHAT_CONVERSATION_MARK_READ_FAIL = 'CHAT_CONVERSATION_MARK_READ_FAIL'

export const CHAT_CONVERSATION_HIDE_FETCH = 'CHAT_CONVERSATION_HIDE_FETCH'
export const CHAT_CONVERSATION_HIDE_SUCCESS = 'CHAT_CONVERSATION_HIDE_SUCCESS'
export const CHAT_CONVERSATION_HIDE_FAIL = 'CHAT_CONVERSATION_HIDE_FAIL'

//

export const SET_CHAT_CONVERSATION_EXPIRATION_REQUEST = 'SET_CHAT_CONVERSATION_EXPIRATION_REQUEST'
export const SET_CHAT_CONVERSATION_EXPIRATION_SUCCESS = 'SET_CHAT_CONVERSATION_EXPIRATION_SUCCESS'
export const SET_CHAT_CONVERSATION_EXPIRATION_FAIL    = 'SET_CHAT_CONVERSATION_EXPIRATION_FAIL'

/**
 * @description Fetch paginated active chat conversations, import accounts and set chat converations
 */
export const fetchChatConversations = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchChatConversationsRequest())

  api(getState).get('/api/v1/chat_conversations/approved_conversations').then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    const conversationsAccounts = [].concat.apply([], response.data.map((c) => c.other_accounts))
    // const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

    dispatch(importFetchedAccounts(conversationsAccounts))
    // dispatch(importFetchedChatMessages(conversationsChatMessages))
    dispatch(fetchChatConversationsSuccess(response.data, next ? next.uri : null))
  }).catch((error) => {
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
  showToast: true,
  error,
})

/**
 * @description Expand paginated active chat conversations, import accounts and set chat converations
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
    // const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

    dispatch(importFetchedAccounts(conversationsAccounts))
    // dispatch(importFetchedChatMessages(conversationsChatMessages))
    dispatch(expandChatConversationsSuccess(response.data, next ? next.uri : null))
  }).catch((error) => dispatch(expandChatConversationsFail(error)))
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
  showToast: true,
  error,
})

/**
 * @description Fetch paginated requested chat conversations, import accounts and set chat converations
 */
export const fetchChatConversationRequested = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchChatConversationRequestedRequest())

  api(getState).get('/api/v1/chat_conversations/requested_conversations').then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    const conversationsAccounts = [].concat.apply([], response.data.map((c) => c.other_accounts))
    // const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

    dispatch(importFetchedAccounts(conversationsAccounts))
    // dispatch(importFetchedChatMessages(conversationsChatMessages))
    dispatch(fetchChatConversationRequestedSuccess(response.data, next ? next.uri : null))
  }).catch((error) => {
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
  showToast: true,
  error,
})

/**
 * @description Expand paginated requested chat conversations, import accounts and set chat converations
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
    // const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

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
  showToast: true,
  error,
})

/**
 * @description Fetch paginated muted chat conversations, import accounts and set chat converations
 */
export const fetchChatConversationMuted = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchChatConversationMutedRequest())

  api(getState).get('/api/v1/chat_conversations/muted_conversations').then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    const conversationsAccounts = [].concat.apply([], response.data.map((c) => c.other_accounts))
    // const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

    dispatch(importFetchedAccounts(conversationsAccounts))
    // dispatch(importFetchedChatMessages(conversationsChatMessages))
    dispatch(fetchChatConversationMutedSuccess(response.data, next ? next.uri : null))
  }).catch((error) => {
    dispatch(fetchChatConversationMutedFail(error))
  })
}

export const fetchChatConversationMutedRequest = () => ({
  type: CHAT_CONVERSATIONS_MUTED_FETCH_REQUEST,
})

export const fetchChatConversationMutedSuccess = (chatConversations, next) => ({
  type: CHAT_CONVERSATIONS_MUTED_FETCH_SUCCESS,
  chatConversations,
  next,
})

export const fetchChatConversationMutedFail = (error) => ({
  type: CHAT_CONVERSATIONS_MUTED_FETCH_FAIL,
  showToast: true,
  error,
})

/**
 * @description Expand paginated muted chat conversations, import accounts and set chat converations
 */
export const expandChatConversationMuted = () => (dispatch, getState) => {
  if (!me) return
  
  const url = getState().getIn(['chat_conversations', 'muted', 'next'])
  const isLoading = getState().getIn(['chat_conversations', 'muted', 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandChatConversationMutedRequest())

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    const conversationsAccounts = [].concat.apply([], response.data.map((c) => c.other_accounts))
    // const conversationsChatMessages = response.data.map((c) => c.last_chat_message)

    dispatch(importFetchedAccounts(conversationsAccounts))
    // dispatch(importFetchedChatMessages(conversationsChatMessages))
    dispatch(expandChatConversationMutedSuccess(response.data, next ? next.uri : null))
  }).catch(error => dispatch(expandChatConversationMutedFail(error)))
}

export const expandChatConversationMutedRequest = () => ({
  type: CHAT_CONVERSATIONS_MUTED_EXPAND_REQUEST,
})

export const expandChatConversationMutedSuccess = (chatConversations, next) => ({
  type: CHAT_CONVERSATIONS_MUTED_EXPAND_SUCCESS,
  chatConversations,
  next,
})

export const expandChatConversationMutedFail = (error) => ({
  type: CHAT_CONVERSATIONS_MUTED_EXPAND_FAIL,
  showToast: true,
  error,
})

/**
 * @description Create a chat conversation with given accountId. May fail because of blocks.
 * @param {String} accountId
 */
export const createChatConversation = (accountId, routerHistory) => (dispatch, getState) => {
  if (!me || !accountId) return

  dispatch(createChatConversationRequest())

  api(getState).post('/api/v1/chat_conversation', { account_id: accountId }).then((response) => {
    dispatch(createChatConversationSuccess(response.data))
    dispatch(closeModal())
    dispatch(setChatConversationSelected(response.data.chat_conversation_id))
    if (routerHistory) routerHistory.push(`/messages/${response.data.chat_conversation_id}`)
  }).catch((error) => {
    dispatch(createChatConversationFail(error))
  })
}

export const createChatConversationRequest = () => ({
  type: CHAT_CONVERSATIONS_CREATE_REQUEST,
})

export const createChatConversationSuccess = (chatConversation) => ({
  type: CHAT_CONVERSATIONS_CREATE_SUCCESS,
  showToast: true,
  chatConversation,
})

export const createChatConversationFail = (error) => ({
  type: CHAT_CONVERSATIONS_CREATE_FAIL,
  showToast: true,
  error,
})

/**
 * @description Delete a chat conversation with given chatConversationId.
 * @param {String} chatConversationId
 */
export const deleteChatConversation = (chatConversationId) => (dispatch, getState) => {
  // : todo :
  if (!me || !chatConversationId) return

  dispatch(deleteChatConversationRequest(conversationId))

  api(getState).delete(`/api/v1/chat_conversation/${chatConversationId}`).then((response) => {
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

/**
 * 
 */
export const hideChatConversation = (chatConversationId) => (dispatch, getState) => {
  if (!me|| !chatConversationId) return

  dispatch(hideChatConversationFetch(chatConversationId))

  api(getState).post(`/api/v1/chat_conversation/${chatConversationId}/mark_chat_conversation_hidden`).then((response) => {
    dispatch(approveChatConversationRequestSuccess(chatConversationId))
  }).catch((error) => dispatch(approveChatConversationRequestFail(error)))
}

export const hideChatConversationFetch = (chatConversationId) => ({
  type: CHAT_CONVERSATION_HIDE_SUCCESS,
  chatConversationId,
})

export const hideChatConversationSuccess = (chatConversationId) => ({
  type: CHAT_CONVERSATION_HIDE_SUCCESS,
  chatConversationId,
})

export const hideChatConversationFail = () => ({
  type: CHAT_CONVERSATION_HIDE_FAIL,
})

/**
 * 
 */
export const readChatConversation = (chatConversationId) => (dispatch, getState) => {
  if (!me|| !chatConversationId) return

  const chatConversation = getState().getIn(['chat_conversations', chatConversationId])
  if (!chatConversation) return
  if (chatConversation.get('unread_count') < 1) return

  dispatch(readChatConversationFetch(chatConversation))

  api(getState).post(`/api/v1/chat_conversation/${chatConversationId}/mark_chat_conversation_read`).then((response) => {
    dispatch(readChatConversationSuccess(response.data))
  }).catch((error) => dispatch(readChatConversationFail(error)))
}

export const readChatConversationFetch = (chatConversation) => ({
  type: CHAT_CONVERSATION_MARK_READ_FETCH,
  chatConversation,
})

export const readChatConversationSuccess = (chatConversation) => ({
  type: CHAT_CONVERSATION_MARK_READ_SUCCESS,
  chatConversation,
})

export const readChatConversationFail = () => ({
  type: CHAT_CONVERSATION_MARK_READ_FAIL,
})

/**
 * 
 */
export const setChatConversationExpiration = (chatConversationId, expiration) => (dispatch, getState) => {
  if (!me|| !chatConversationId) return

  dispatch(setChatConversationExpirationFetch(chatConversationId))

  api(getState).post(`/api/v1/chat_conversation/${chatConversationId}/set_expiration_policy`, {
    expiration,
  }).then((response) => {
    dispatch(setChatConversationExpirationSuccess(response.data))
  }).catch((error) => dispatch(setChatConversationExpirationFail(error)))
}

export const setChatConversationExpirationFetch = (chatConversationId) => ({
  type: SET_CHAT_CONVERSATION_EXPIRATION_REQUEST,
  chatConversationId,
})

export const setChatConversationExpirationSuccess = (chatConversation) => ({
  type: SET_CHAT_CONVERSATION_EXPIRATION_SUCCESS,
  chatConversation,
})

export const setChatConversationExpirationFail = (error) => ({
  type: SET_CHAT_CONVERSATION_EXPIRATION_FAIL,
  error,
})


/**
 * 
 */
export const searchApprovedChatConversations = (query) => (dispatch, getState) => {
  if (!query) return
  debouncedSearchApprovedChatConversations(query, dispatch, getState) 
}

export const debouncedSearchApprovedChatConversations = debounce((query, dispatch, getState) => {
  if (!query) return
  
  api(getState).get('/api/v1/chat_conversation_accounts/_/search', {
    params: { q: query },
  }).then((response) => {
    const conversationsAccounts = [].concat.apply([], response.data.map((c) => c.other_accounts))
    dispatch(searchApprovedChatConversationsSuccess(response.data))
  }).catch((error) => {
    //
  })
}, 650, { leading: true })

const searchApprovedChatConversationsSuccess = (chatConversations) => ({
  type: CHAT_CONVERSATION_APPROVED_SEARCH_FETCH_SUCCESS,
  chatConversations,
})