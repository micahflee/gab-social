import isObject from 'lodash.isobject'
import {
  normalizeAccount,
  normalizeStatus,
  normalizePoll,
} from './normalizer'
import { fetchContext } from '../statuses'
import { importGroups } from '../groups'

export const ACCOUNT_IMPORT  = 'ACCOUNT_IMPORT'
export const ACCOUNTS_IMPORT = 'ACCOUNTS_IMPORT'
export const STATUS_IMPORT   = 'STATUS_IMPORT'
export const STATUSES_IMPORT = 'STATUSES_IMPORT'
export const POLLS_IMPORT    = 'POLLS_IMPORT'
export const CHAT_MESSAGES_IMPORT = 'CHAT_MESSAGES_IMPORT'
export const ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP = 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP'

/**
 * 
 */
const pushUnique = (array, object) => {
  if (array.every(element => element.id !== object.id)) {
    array.push(object);
  }
}

export const importAccount = (account) => ({
  type: ACCOUNT_IMPORT,
  account,
})

export const importAccounts = (accounts) => ({
  type: ACCOUNTS_IMPORT,
  accounts,
})

export const importStatus = (status) => ({
  type: STATUS_IMPORT,
  status,
})

export const importStatuses = (statuses) => ({
  type: STATUSES_IMPORT,
  statuses,
})

export const importPolls = (polls) => ({
  type: POLLS_IMPORT,
  polls,
})

export const importChatMessages = (chatMessages) => ({
  type: CHAT_MESSAGES_IMPORT,
  chatMessages,
})

export const importFetchedAccount = (account) => {
  return importFetchedAccounts([account]);
}

export const importFetchedAccounts = (accounts) => {
  const normalAccounts = [];

  const processAccount = (account) => {
    pushUnique(normalAccounts, normalizeAccount(account));

    if (account.moved) {
      processAccount(account.moved);
    }
  }

  accounts.forEach(processAccount);

  return importAccounts(normalAccounts);
}

export const importFetchedStatus = (status) => {
  return importFetchedStatuses([status]);
}

export const importFetchedStatuses = (statuses) => (dispatch, getState) => {
  const accounts = []
  const normalStatuses = []
  const polls = []
  const groups = []

  const processStatus = (status) => {
    pushUnique(normalStatuses, normalizeStatus(status, getState().getIn(['statuses', status.id])))

    if (isObject(status.account)) pushUnique(accounts, status.account)
    if (isObject(status.group)) pushUnique(groups, status.group)
    
    if (status.reblog && status.reblog.id) {
      processStatus(status.reblog)
    }

    if (status.quote && status.quote.id) {
      processStatus(status.quote)
    }

    if (status.poll && status.poll.id) {
      pushUnique(polls, normalizePoll(status.poll))
    }
  }

  statuses.forEach(processStatus)

  dispatch(importPolls(polls))
  dispatch(importFetchedAccounts(accounts))
  dispatch(importStatuses(normalStatuses))
  dispatch(importGroups(groups))
}

export const importFetchedPoll = (poll) => (dispatch) => {
  dispatch(importPolls([normalizePoll(poll)]))
}

export const importErrorWhileFetchingAccountByUsername = (username) => ({
  type: ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP,
  username
})

export const importFetchedChatMessages = (chatMessages) => (dispatch, getState) => {
  dispatch(importChatMessages(chatMessages))
}