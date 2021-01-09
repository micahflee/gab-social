import debounce from 'lodash.debounce'
import api, { getLinks } from '../api'
import { importFetchedAccounts } from './importer'
import { me } from '../initial_state'

export const CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS_SUCCESS = 'CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS_SUCCESS'

export const CLEAR_CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS = 'CLEAR_CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS'

export const SET_CHAT_CONVERSATION_SELECTED = 'SET_CHAT_CONVERSATION_SELECTED'

export const SET_CHAT_CONVERSATION_SEARCH_VALUE = 'SET_CHAT_CONVERSATION_SEARCH_VALUE'

/**
 * 
 */
export const fetchChatConversationAccountSuggestions = (query) => (dispatch, getState) => {
  if (!query) return
  debouncedFetchChatConversationAccountSuggestions(query, dispatch, getState) 
}

export const debouncedFetchChatConversationAccountSuggestions = debounce((query, dispatch, getState) => {
  if (!query) return
  return false

  api(getState).get('/api/v1/accounts/search', {
    params: {
      q: query,
      resolve: false,
      limit: 4,
    },
  }).then((response) => {
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchChatConversationAccountSuggestionsSuccess(response.data))
  }).catch((error) => {
    //
  })
}, 650, { leading: true })

const fetchChatConversationAccountSuggestionsSuccess = (accounts) => ({
  type: CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS_SUCCESS,
  accounts,
})

/**
 * 
 */
export const clearChatConversationAccountSuggestions = () => (dispatch) => {
  dispatch({ type: CLEAR_CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS })
}

/**
 * 
 */
export const setChatConversationSelected = (chatConversationId) => (dispatch) => {
  dispatch({
    type: SET_CHAT_CONVERSATION_SELECTED,
    chatConversationId,
  })
}

/**
 * 
 */
export const onChangeSearch = (value) => (dispatch) => {
  dispatch({
    type: SET_CHAT_CONVERSATION_SEARCH_VALUE,
    value,
  })
}