import api from '../api';
import { fetchRelationships } from './accounts';
import { fetchGroupsSuccess, fetchGroupRelationships } from './groups'
import {
  importFetchedAccounts,
  importFetchedStatuses,
} from './importer';
import { importLinkCards } from './links'
import { me } from '../initial_state'
import { SEARCH_FILTERS } from '../constants'

export const SEARCH_CHANGE = 'SEARCH_CHANGE';
export const SEARCH_CLEAR  = 'SEARCH_CLEAR';
export const SEARCH_SHOW   = 'SEARCH_SHOW';

export const SEARCH_FETCH_REQUEST = 'SEARCH_FETCH_REQUEST';
export const SEARCH_FETCH_SUCCESS = 'SEARCH_FETCH_SUCCESS';
export const SEARCH_FETCH_FAIL    = 'SEARCH_FETCH_FAIL';

export const SEARCH_FILTER_SET = 'SEARCH_FILTER_SET'

/**
 * 
 */
export const changeSearch = (value) => ({
  type: SEARCH_CHANGE,
  value,
})

/**
 * 
 */
export const clearSearch = () => ({
  type: SEARCH_CLEAR,
})

/**
 * 
 */
export const submitSearch = () => (dispatch, getState) => {
  if (!me) return

  const value = getState().getIn(['search', 'value'])
  const onlyVerified = getState().getIn(['search', 'filter', 'onlyVerified'])

  if (value.length === 0) return

  dispatch(fetchSearchRequest())

  api(getState).get('/api/v2/search', {
    params: {
      onlyVerified,
      q: value,
      resolve: true,
    },
  }).then((response) => {
    if (response.data.accounts) {
      dispatch(importFetchedAccounts(response.data.accounts))
      dispatch(fetchRelationships(response.data.accounts.map(item => item.id)))
    }

    if (response.data.statuses) {
      dispatch(importFetchedStatuses(response.data.statuses))
    }

    if (response.data.links) {
      dispatch(importLinkCards(response.data.links))
    }

    if (response.data.groups) {
      dispatch(fetchGroupsSuccess(response.data.groups))
      dispatch(fetchGroupRelationships(response.data.groups.map(item => item.id)))
    }

    dispatch(fetchSearchSuccess(response.data))
  }).catch((error) => {
    dispatch(fetchSearchFail(error))
  })
}

const fetchSearchRequest = () => ({
  type: SEARCH_FETCH_REQUEST,
})

const fetchSearchSuccess = (results) => ({
  type: SEARCH_FETCH_SUCCESS,
  results,
})

const fetchSearchFail = (error) => ({
  type: SEARCH_FETCH_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const showSearch = () => ({
  type: SEARCH_SHOW,
})

/**
 * 
 */
export const setFilter = (path, value, shouldSubmit) => (dispatch) => {
  dispatch({
    type: SEARCH_FILTER_SET,
    path: path,
    value: value,
  })
  if (shouldSubmit) dispatch(submitSearch())
}