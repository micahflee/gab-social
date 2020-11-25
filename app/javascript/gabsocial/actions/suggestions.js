import api from '../api'
import { importFetchedAccounts } from './importer'
import { fetchRelationships } from './accounts'
import { me } from '../initial_state'
import {
  SUGGESTION_TYPE_VERIFIED,
  SUGGESTION_TYPE_RELATED,
} from '../constants'

export const SUGGESTIONS_FETCH_REQUEST = 'SUGGESTIONS_FETCH_REQUEST'
export const SUGGESTIONS_FETCH_SUCCESS = 'SUGGESTIONS_FETCH_SUCCESS'
export const SUGGESTIONS_FETCH_FAIL    = 'SUGGESTIONS_FETCH_FAIL'

export const SUGGESTIONS_DISMISS = 'SUGGESTIONS_DISMISS'

/**
 * 
 */
export const fetchPopularSuggestions = () => (dispatch, getState) => {
  if (!me) return false
  fetchSuggestions(SUGGESTION_TYPE_VERIFIED, dispatch, getState)
}

/**
 * 
 */
export const fetchRelatedSuggestions = (unlimited = false) => (dispatch, getState) => {
  if (!me) return false
  fetchSuggestions(SUGGESTION_TYPE_RELATED, dispatch, getState, unlimited)
}

/**
 * 
 */
const fetchSuggestions = (suggestionType, dispatch, getState, unlimited = false) => {
  dispatch(fetchSuggestionsRequest(suggestionType))

  api(getState).get(`/api/v1/suggestions?type=${suggestionType}&unlimited=${!!unlimited}`).then((response) => {
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchSuggestionsSuccess(response.data, suggestionType))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch(error => dispatch(fetchSuggestionsFail(error, suggestionType)))
}

const fetchSuggestionsRequest = (suggestionType) => ({
  type: SUGGESTIONS_FETCH_REQUEST,
  suggestionType,
})

const fetchSuggestionsSuccess = (accounts, suggestionType) => ({
  type: SUGGESTIONS_FETCH_SUCCESS,
  accounts,
  suggestionType
})

const fetchSuggestionsFail = (error, suggestionType) => ({
  type: SUGGESTIONS_FETCH_FAIL,
  skipAlert: true,
  error,
  suggestionType,
})

/**
 * 
 */
export const dismissRelatedSuggestion = (accountId) => (dispatch, getState) => {
  if (!me) return

  dispatch({
    type: SUGGESTIONS_DISMISS,
    id: accountId,
  })

  api(getState).delete(`/api/v1/suggestions/related/${accountId}`)
}