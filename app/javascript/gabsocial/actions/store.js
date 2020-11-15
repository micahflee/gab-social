import { Iterable, fromJS } from 'immutable'
import { hydrateCompose } from './compose'
import { importFetchedAccounts } from './importer'

export const STORE_HYDRATE = 'STORE_HYDRATE'
export const STORE_HYDRATE_LAZY = 'STORE_HYDRATE_LAZY'

const convertState = (rawState) => {
  return fromJS(rawState, (k, v) => Iterable.isIndexed(v) ? v.toList() : v.toMap())
}

export const hydrateStore = (rawState) => (dispatch) => {
  const state = convertState(rawState)

  dispatch({
    type: STORE_HYDRATE,
    state,
  })

  dispatch(hydrateCompose())
  if (rawState.accounts) dispatch(importFetchedAccounts(Object.values(rawState.accounts)))
}