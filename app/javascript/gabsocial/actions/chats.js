import throttle from 'lodash.throttle'
import api, { getLinks } from '../api'
import { importFetchedAccounts } from './importer'
import { me } from '../initial_state'

export const CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS_SUCCESS = 'CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS_SUCCESS'

export const SET_CHAT_CONVERSATION_SELECTED = 'SET_CHAT_CONVERSATION_SELECTED'

/**
 * 
 */
export const fetchChatConversationAccountSuggestions = (query) => throttle((dispatch, getState) => {
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
}, 200, { leading: true, trailing: true })

const fetchChatConversationAccountSuggestionsSuccess = (accounts) => ({
  type: CHAT_CONVERSATION_CREATE_SEARCH_ACCOUNTS_SUCCESS,
  accounts,
})

/**
 * 
 */
export const setChatConversationSelected = (chatConversationId) => (dispatch) => {
  dispatch({
    type: SET_CHAT_CONVERSATION_SELECTED,
    chatConversationId,
  })
}