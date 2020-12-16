import debounce from 'lodash.debounce'
import api from '../api'
import { me } from '../initial_state'
import { saveSettings } from './settings'
import { importFetchedAccounts } from './importer'

export const DECK_CONNECT = 'DECK_CONNECT'
export const DECK_DISCONNECT = 'DECK_DISCONNECT'

export const DECK_SET_COLUMN_AT_INDEX = 'DECK_SET_COLUMN_AT_INDEX'
export const DECK_DELETE_COLUMN_AT_INDEX = 'DECK_DELETE_COLUMN_AT_INDEX'
export const DECK_CHANGE_COLUMN_AT_INDEX = 'DECK_CHANGE_COLUMN_AT_INDEX'

export const DECK_SEARCH_USERS_SUCCESS = 'DECK_SEARCH_USERS_SUCCESS'
export const DECK_SEARCH_USERS_CLEAR = 'DECK_SEARCH_USERS_CLEAR'

export const deckConnect = () => ({
  type: DECK_CONNECT,
})

export const deckDisconnect = () => ({
  type: DECK_DISCONNECT,
})

export const setDeckColumnAtIndex = (column, index) => (dispatch) => {
  dispatch({
    type: DECK_SET_COLUMN_AT_INDEX,
    column,
    index,
  })
  dispatch(saveSettings())
}

export const deleteDeckColumnAtIndex = (index) => (dispatch) => {
  dispatch({
    type: DECK_DELETE_COLUMN_AT_INDEX,
    index,
  })
  dispatch(saveSettings())
}

export const updateDeckColumnAtIndex = (oldIndex, newIndex) => (dispatch) => {
  dispatch({
    type: DECK_CHANGE_COLUMN_AT_INDEX,
    oldIndex,
    newIndex,
  })
  dispatch(saveSettings())
}

/**
 * 
 */
export const fetchDeckAccountSuggestions = (query) => (dispatch, getState) => {
  if (!query) return
  debouncedFetchDeckAccountSuggestions(query, dispatch, getState)
}

const debouncedFetchDeckAccountSuggestions = debounce((query, dispatch, getState) => {
  if (!query) return

  api(getState).get('/api/v1/accounts/search', {
    params: {
      q: query,
      resolve: false,
      limit: 4,
    },
  }).then((response) => {
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchDeckAccountSuggestionsSuccess(response.data))
  }).catch((error) => {
    //
  })
}, 650, { leading: true })

const fetchDeckAccountSuggestionsSuccess = (accounts) => ({
  type: DECK_SEARCH_USERS_SUCCESS,
  accounts,
})

/**
 * 
 */
export const clearDeckAccountSuggestions = () => (dispatch) => {
  dispatch({ type: DECK_SEARCH_USERS_CLEAR })
}