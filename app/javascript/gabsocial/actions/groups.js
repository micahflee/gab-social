import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable'
import debounce from 'lodash.debounce'
import api, { getLinks } from '../api'
import { me } from '../initial_state'
import { importFetchedAccounts } from './importer'
import { fetchRelationships } from './accounts'
import { updateStatusStats } from './statuses'
import {
  ACCEPTED_GROUP_TABS,
  GROUP_LIST_SORTING_TYPE_ALPHABETICAL,
  GROUP_LIST_SORTING_TYPE_MOST_POPULAR,
} from '../constants'

export const GROUP_FETCH_REQUEST = 'GROUP_FETCH_REQUEST'
export const GROUP_FETCH_SUCCESS = 'GROUP_FETCH_SUCCESS'
export const GROUP_FETCH_FAIL    = 'GROUP_FETCH_FAIL'

export const GROUP_RELATIONSHIPS_FETCH_REQUEST = 'GROUP_RELATIONSHIPS_FETCH_REQUEST'
export const GROUP_RELATIONSHIPS_FETCH_SUCCESS = 'GROUP_RELATIONSHIPS_FETCH_SUCCESS'
export const GROUP_RELATIONSHIPS_FETCH_FAIL    = 'GROUP_RELATIONSHIPS_FETCH_FAIL'

export const GROUPS_FETCH_REQUEST = 'GROUPS_FETCH_REQUEST'
export const GROUPS_FETCH_SUCCESS = 'GROUPS_FETCH_SUCCESS'
export const GROUPS_FETCH_FAIL    = 'GROUPS_FETCH_FAIL'

export const GROUP_JOIN_REQUEST = 'GROUP_JOIN_REQUEST'
export const GROUP_JOIN_SUCCESS = 'GROUP_JOIN_SUCCESS'
export const GROUP_JOIN_FAIL    = 'GROUP_JOIN_FAIL'

export const GROUP_LEAVE_REQUEST = 'GROUP_LEAVE_REQUEST'
export const GROUP_LEAVE_SUCCESS = 'GROUP_LEAVE_SUCCESS'
export const GROUP_LEAVE_FAIL    = 'GROUP_LEAVE_FAIL'

//

export const GROUP_MEMBERS_FETCH_REQUEST = 'GROUP_MEMBERS_FETCH_REQUEST'
export const GROUP_MEMBERS_FETCH_SUCCESS = 'GROUP_MEMBERS_FETCH_SUCCESS'
export const GROUP_MEMBERS_FETCH_FAIL    = 'GROUP_MEMBERS_FETCH_FAIL'

export const GROUP_MEMBERS_EXPAND_REQUEST = 'GROUP_MEMBERS_EXPAND_REQUEST'
export const GROUP_MEMBERS_EXPAND_SUCCESS = 'GROUP_MEMBERS_EXPAND_SUCCESS'
export const GROUP_MEMBERS_EXPAND_FAIL    = 'GROUP_MEMBERS_EXPAND_FAIL'

export const GROUP_MEMBERS_SEARCH_SUCCESS = 'GROUP_MEMBERS_SEARCH_SUCCESS'
export const CLEAR_GROUP_MEMBERS_SEARCH = 'CLEAR_GROUP_MEMBERS_SEARCH'

//

export const GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST = 'GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST'
export const GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS'
export const GROUP_REMOVED_ACCOUNTS_FETCH_FAIL    = 'GROUP_REMOVED_ACCOUNTS_FETCH_FAIL'

export const GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST = 'GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST'
export const GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS'
export const GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL    = 'GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL'

export const GROUP_REMOVED_ACCOUNTS_SEARCH_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_SEARCH_SUCCESS'
export const CLEAR_GROUP_REMOVED_ACCOUNTS_SEARCH = 'CLEAR_GROUP_REMOVED_ACCOUNTS_SEARCH'

//

export const GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST'
export const GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS'
export const GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL    = 'GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL'

export const GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST'
export const GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS'
export const GROUP_REMOVED_ACCOUNTS_CREATE_FAIL    = 'GROUP_REMOVED_ACCOUNTS_CREATE_FAIL'

//

export const GROUP_JOIN_REQUESTS_FETCH_REQUEST = 'GROUP_JOIN_REQUESTS_FETCH_REQUEST'
export const GROUP_JOIN_REQUESTS_FETCH_SUCCESS = 'GROUP_JOIN_REQUESTS_FETCH_SUCCESS'
export const GROUP_JOIN_REQUESTS_FETCH_FAIL = 'GROUP_JOIN_REQUESTS_FETCH_FAIL'

export const GROUP_JOIN_REQUESTS_EXPAND_REQUEST = 'GROUP_JOIN_REQUESTS_EXPAND_REQUEST'
export const GROUP_JOIN_REQUESTS_EXPAND_SUCCESS = 'GROUP_JOIN_REQUESTS_EXPAND_SUCCESS'
export const GROUP_JOIN_REQUESTS_EXPAND_FAIL = 'GROUP_JOIN_REQUESTS_EXPAND_FAIL'

export const GROUP_JOIN_REQUESTS_APPROVE_SUCCESS = 'GROUP_JOIN_REQUESTS_APPROVE_SUCCESS'
export const GROUP_JOIN_REQUESTS_APPROVE_FAIL = 'GROUP_JOIN_REQUESTS_APPROVE_FAIL'

export const GROUP_JOIN_REQUESTS_REJECT_SUCCESS = 'GROUP_JOIN_REQUESTS_REJECT_SUCCESS'
export const GROUP_JOIN_REQUESTS_REJECT_FAIL = 'GROUP_JOIN_REQUESTS_REJECT_FAIL'

export const GROUP_REMOVE_STATUS_REQUEST = 'GROUP_REMOVE_STATUS_REQUEST'
export const GROUP_REMOVE_STATUS_SUCCESS = 'GROUP_REMOVE_STATUS_SUCCESS'
export const GROUP_REMOVE_STATUS_FAIL    = 'GROUP_REMOVE_STATUS_FAIL'

export const GROUP_UPDATE_ROLE_REQUEST = 'GROUP_UPDATE_ROLE_REQUEST'
export const GROUP_UPDATE_ROLE_SUCCESS = 'GROUP_UPDATE_ROLE_SUCCESS'
export const GROUP_UPDATE_ROLE_FAIL    = 'GROUP_UPDATE_ROLE_FAIL'

export const GROUP_CHECK_PASSWORD_RESET = 'GROUP_CHECK_PASSWORD_RESET'
export const GROUP_CHECK_PASSWORD_REQUEST = 'GROUP_CHECK_PASSWORD_REQUEST'
export const GROUP_CHECK_PASSWORD_SUCCESS = 'GROUP_CHECK_PASSWORD_SUCCESS'
export const GROUP_CHECK_PASSWORD_FAIL = 'GROUP_CHECK_PASSWORD_FAIL'

export const GROUP_PIN_STATUS_REQUEST = 'GROUP_PIN_STATUS_REQUEST'
export const GROUP_PIN_STATUS_SUCCESS = 'GROUP_PIN_STATUS_SUCCESS'
export const GROUP_PIN_STATUS_FAIL = 'GROUP_PIN_STATUS_FAIL'

export const GROUP_UNPIN_STATUS_REQUEST = 'GROUP_UNPIN_STATUS_REQUEST'
export const GROUP_UNPIN_STATUS_SUCCESS = 'GROUP_UNPIN_STATUS_SUCCESS'
export const GROUP_UNPIN_STATUS_FAIL = 'GROUP_UNPIN_STATUS_FAIL'

export const IS_PINNED_GROUP_STATUS_REQUEST = 'IS_PINNED_GROUP_STATUS_REQUEST'
export const IS_PINNED_GROUP_STATUS_SUCCESS = 'IS_PINNED_GROUP_STATUS_SUCCESS'
export const IS_PINNED_GROUP_STATUS_FAIL = 'IS_PINNED_GROUP_STATUS_FAIL'

export const GROUPS_BY_CATEGORY_FETCH_REQUEST = 'GROUPS_BY_CATEGORY_FETCH_REQUEST'
export const GROUPS_BY_CATEGORY_FETCH_SUCCESS = 'GROUPS_BY_CATEGORY_FETCH_SUCCESS'
export const GROUPS_BY_CATEGORY_FETCH_FAIL = 'GROUPS_BY_CATEGORY_FETCH_FAIL'

export const GROUPS_BY_TAG_FETCH_REQUEST = 'GROUPS_BY_TAG_FETCH_REQUEST'
export const GROUPS_BY_TAG_FETCH_SUCCESS = 'GROUPS_BY_TAG_FETCH_SUCCESS'
export const GROUPS_BY_TAG_FETCH_FAIL = 'GROUPS_BY_TAG_FETCH_FAIL'

export const GROUP_TIMELINE_SORT = 'GROUP_TIMELINE_SORT'
export const GROUP_TIMELINE_TOP_SORT = 'GROUP_TIMELINE_TOP_SORT'

export const GROUP_SORT = 'GROUP_SORT'

/**
 * @description Import a group into redux
 * @param {ImmutableMap} group
 */
export const importGroup = (group) => (dispatch) => {
  dispatch(fetchGroupSuccess(group))
}

export const importGroups = (groups) => (dispatch) => {
  if (!Array.isArray(groups)) return
  groups.map((group) => dispatch(fetchGroupSuccess(group)))
}

/**
 * @description Fetch a group with the given groupId
 * @param {string} groupId
 */
export const fetchGroup = (groupId) => (dispatch, getState) => {
  if (!groupId) return

  dispatch(fetchGroupRelationships([groupId]))

  // Check if exists already
  if (getState().getIn(['groups', groupId])) return

  dispatch(fetchGroupRequest(groupId))

  api(getState).get(`/api/v1/groups/${groupId}`)
    .then((response) => dispatch(fetchGroupSuccess(response.data)))
    .catch((err) => dispatch(fetchGroupFail(groupId, err)))
}

const fetchGroupRequest = (groupId) => ({
  type: GROUP_FETCH_REQUEST,
  groupId,
})

const fetchGroupSuccess = (group) => ({
  type: GROUP_FETCH_SUCCESS,
  group,
})

const fetchGroupFail = (groupId, error) => ({
  type: GROUP_FETCH_FAIL,
  showToast: true,
  groupId,
  error,
})

/**
 * @description Fetch relationships for the given groupIds and current user. For example
 *              if the current user is a member, admin, mod or not.
 * @param {Array} groupIds
 */
export const fetchGroupRelationships = (groupIds) => (dispatch, getState) => {
  if (!me || !Array.isArray(groupIds)) return

  const loadedRelationships = getState().get('group_relationships')
  const newGroupIds = groupIds.filter((id) => loadedRelationships.get(id, null) === null)

  if (newGroupIds.length === 0) return

  dispatch(fetchGroupRelationshipsRequest(newGroupIds))

  api(getState).get(`/api/v1/groups/${newGroupIds[0]}/relationships?${newGroupIds.map(id => `id[]=${id}`).join('&')}`).then((response) => {
    dispatch(fetchGroupRelationshipsSuccess(response.data))
  }).catch((error) => {
    dispatch(fetchGroupRelationshipsFail(error))
  })
}

const fetchGroupRelationshipsRequest = (groupIds) => ({
  type: GROUP_RELATIONSHIPS_FETCH_REQUEST,
  groupIds,
})

const fetchGroupRelationshipsSuccess = (relationships) => ({
  type: GROUP_RELATIONSHIPS_FETCH_SUCCESS,
  relationships,
})

const fetchGroupRelationshipsFail = (error) => ({
  type: GROUP_RELATIONSHIPS_FETCH_FAIL,
  error,
})

/**
 * @description Fetch all groups (limited uniquely per tab, non paginated) by tab. Import
 *              groups and fetch relationships for each if tab !== member.
 * @param {String} tab
 */
export const fetchGroupsByTab = (tab) => (dispatch, getState) => {
  if (!me && tab !== 'featured' || ACCEPTED_GROUP_TABS.indexOf(tab) === -1) return

  // Don't refetch or fetch when loading
  const isLoading = getState().getIn(['group_lists', tab, 'isLoading'])
  const isFetched = getState().getIn(['group_lists', tab, 'isFetched'])

  if (isLoading || isFetched) return

  dispatch(fetchGroupsRequest(tab))

  api(getState).get(`/api/v1/groups?tab=${tab}`)
    .then((response) => {
      dispatch(fetchGroupsSuccess(response.data, tab))
      if (tab !== 'member') {
        dispatch(fetchGroupRelationships(response.data.map(item => item.id)))
      }
    })
    .catch((err) => dispatch(fetchGroupsFail(err, tab)))
}

const fetchGroupsRequest = (tab) => ({
  type: GROUPS_FETCH_REQUEST,
  tab,
})

export const fetchGroupsSuccess = (groups, tab) => ({
  type: GROUPS_FETCH_SUCCESS,
  groups,
  tab,
})

const fetchGroupsFail = (error, tab) => ({
  type: GROUPS_FETCH_FAIL,
  showToast: true,
  error,
  tab,
})

/**
 * @description Fetch all groups (limited to 100, non paginated) by category. Import groups
 *              and fetch relationships for each.
 * @param {String} category
 */
export const fetchGroupsByCategory = (category) => (dispatch, getState) => {
  if (!category) return

  // Don't refetch or fetch when loading
  const isLoading = getState().getIn(['group_lists', 'by_category', category, 'isLoading'], false)

  if (isLoading) return

  dispatch(fetchGroupsByCategoryRequest(category))

  api(getState).get(`/api/v1/groups/_/category/${category}`)
    .then((response) => {
      dispatch(fetchGroupsByCategorySuccess(response.data, category))
      dispatch(fetchGroupRelationships(response.data.map(item => item.id)))
    })
    .catch((err) => dispatch(fetchGroupsByCategoryFail(err, category)))
}

const fetchGroupsByCategoryRequest = (category) => ({
  type: GROUPS_BY_CATEGORY_FETCH_REQUEST,
  category,
})

const fetchGroupsByCategorySuccess = (groups, category) => ({
  type: GROUPS_BY_CATEGORY_FETCH_SUCCESS,
  groups,
  category,
})

const fetchGroupsByCategoryFail = (error, category) => ({
  type: GROUPS_BY_CATEGORY_FETCH_FAIL,
  showToast: true,
  error,
  category,
})

/**
 * @description Fetch all groups (limited to 100, non paginated) by tag. Import groups
 *              and fetch relationships for each.
 * @param {String} tag
 */
export const fetchGroupsByTag = (tag) => (dispatch, getState) => {
  if (!tag) return

  // Don't refetch or fetch when loading
  const isLoading = getState().getIn(['group_lists', 'by_tag', tag, 'isLoading'], false)

  if (isLoading) return

  dispatch(fetchGroupsByTagRequest(tag))

  api(getState).get(`/api/v1/groups/_/tag/${tag}`)
    .then((response) => {
      dispatch(fetchGroupsByTagSuccess(response.data, tag))
      dispatch(fetchGroupRelationships(response.data.map(item => item.id)))
    })
    .catch((err) => dispatch(fetchGroupsByTagFail(err, tag)))
}

export const fetchGroupsByTagRequest = (tag) => ({
  type: GROUPS_BY_TAG_FETCH_REQUEST,
  tag,
})

export const fetchGroupsByTagSuccess = (groups, tag) => ({
  type: GROUPS_BY_TAG_FETCH_SUCCESS,
  groups,
  tag,
})

export const fetchGroupsByTagFail = (error, tag) => ({
  type: GROUPS_BY_TAG_FETCH_FAIL,
  showToast: true,
  error,
  tag,
})

/**
 * @description Join group with the given groupId and return group relationships
 * @param {String} groupId
 */
export const joinGroup = (groupId) => (dispatch, getState) => {
  if (!me || !groupId) return

  dispatch(joinGroupRequest(groupId))

  api(getState).post(`/api/v1/groups/${groupId}/accounts`).then((response) => {
    dispatch(joinGroupSuccess(response.data))
  }).catch((error) => {
    dispatch(joinGroupFail(groupId, error))
  })
}

const joinGroupRequest = (groupId) => ({
  type: GROUP_JOIN_REQUEST,
  groupId,
})

const joinGroupSuccess = (relationship) => ({
  type: GROUP_JOIN_SUCCESS,
  showToast: true,
  relationship
})

const joinGroupFail = (error) => ({
  type: GROUP_JOIN_FAIL,
  showToast: true,
  error,
})

/**
 * @description Leave group with the given groupId and return group relationships
 * @param {String} groupId
 */
export const leaveGroup = (groupId) => (dispatch, getState) => {
  if (!me || !groupId) return
  
  dispatch(leaveGroupRequest(groupId))

  api(getState).delete(`/api/v1/groups/${groupId}/accounts`).then((response) => {
    dispatch(leaveGroupSuccess(response.data))
  }).catch((error) => {
    dispatch(leaveGroupFail(groupId, error))
  })
}

const leaveGroupRequest = (groupId) => ({
  type: GROUP_LEAVE_REQUEST,
  groupId,
})

const leaveGroupSuccess = (relationship) => ({
  type: GROUP_LEAVE_SUCCESS,
  showToast: true,
  relationship,
})

const leaveGroupFail = (error) => ({
  type: GROUP_LEAVE_FAIL,
  showToast: true,
  error,
})

/**
 * @description Fetch members for the given groupId and imports paginated accounts
 *              and sets in user_lists reducer.
 * @param {String} groupId
 */
export const fetchMembers = (groupId) => (dispatch, getState) => {
  if (!me || !groupId) return

  dispatch(fetchMembersRequest(groupId))

  api(getState).get(`/api/v1/groups/${groupId}/accounts`).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchMembersSuccess(groupId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(fetchMembersFail(groupId, error))
  })
}

const fetchMembersRequest = (groupId) => ({
  type: GROUP_MEMBERS_FETCH_REQUEST,
  groupId,
})

const fetchMembersSuccess = (groupId, accounts, next) => ({
  type: GROUP_MEMBERS_FETCH_SUCCESS,
  groupId,
  accounts,
  next,
})

const fetchMembersFail = (groupId, error) => ({
  type: GROUP_MEMBERS_FETCH_FAIL,
  showToast: true,
  groupId,
  error,
})

/**
 * @description Expand members for the given groupId and imports paginated accounts
 *              and sets in user_lists reducer.
 * @param {String} groupId
 */
export const expandMembers = (groupId) => (dispatch, getState) => {
  if (!me || !groupId) return

  const url = getState().getIn(['user_lists', 'groups', groupId, 'next'])
  const isLoading = getState().getIn(['user_lists', 'groups', groupId, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandMembersRequest(groupId))

  api(getState).get(url).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(expandMembersSuccess(groupId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(expandMembersFail(groupId, error))
  })
}

const expandMembersRequest = (groupId) => ({
  type: GROUP_MEMBERS_EXPAND_REQUEST,
  groupId,
})

const expandMembersSuccess = (groupId, accounts, next) => ({
  type: GROUP_MEMBERS_EXPAND_SUCCESS,
  groupId,
  accounts,
  next,
})

const expandMembersFail = (groupId, error) => ({
  type: GROUP_MEMBERS_EXPAND_FAIL,
  showToast: true,
  groupId,
  error,
})

/**
 * 
 */
export const fetchGroupMembersAdminSearch = (groupId, query) => (dispatch, getState) => {
  if (!groupId || !query) return
  debouncedFetchGroupMembersAdminSearch(groupId, query, dispatch, getState) 
}

export const debouncedFetchGroupMembersAdminSearch = debounce((groupId, query, dispatch, getState) => {
  if (!groupId || !query) return

  api(getState).get(`/api/v1/groups/${groupId}/member_search`, {
    params: { q: query },
  }).then((response) => {
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchGroupMembersAdminSearchSuccess(response.data))
  }).catch((error) => {
    //
  })
}, 650, { leading: true })

const fetchGroupMembersAdminSearchSuccess = (accounts) => ({
  type: GROUP_MEMBERS_SEARCH_SUCCESS,
  accounts,
})

/**
 * 
 */
export const clearGroupMembersAdminSearch = () => (dispatch) => {
  dispatch({ type: CLEAR_GROUP_MEMBERS_SEARCH })
}

/**
 * @description Fetch removed accounts for the given groupId and imports paginated
 *              accounts and sets in user_lists reducer.
 * @param {String} groupId
 */
export const fetchRemovedAccounts = (groupId) => (dispatch, getState) => {
  if (!me || !groupId) return

  dispatch(fetchRemovedAccountsRequest(groupId))

  api(getState).get(`/api/v1/groups/${groupId}/removed_accounts`).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchRemovedAccountsSuccess(groupId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(fetchRemovedAccountsFail(groupId, error))
  })
}

const fetchRemovedAccountsRequest = (groupId) => ({
  type: GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST,
  groupId,
})

const fetchRemovedAccountsSuccess = (groupId, accounts, next) => ({
  type: GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
  groupId,
  accounts,
  next,
})

const fetchRemovedAccountsFail = (groupId, error) => ({
  type: GROUP_REMOVED_ACCOUNTS_FETCH_FAIL,
  showToast: true,
  groupId,
  error,
})

/**
 * @description Expand likes for the given statusId and imports paginated accounts
 *              and sets in user_lists reducer.
 * @param {String} statusId
 */
export const expandRemovedAccounts = (groupId) => (dispatch, getState) => {
  if (!me || !groupId) return

  const url = getState().getIn(['user_lists', 'group_removed_accounts', groupId, 'next'])
  const isLoading = getState().getIn(['user_lists', 'group_removed_accounts', groupId, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandRemovedAccountsRequest(groupId))

  api(getState).get(url).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(expandRemovedAccountsSuccess(groupId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(expandRemovedAccountsFail(groupId, error))
  })
}

const expandRemovedAccountsRequest = (groupId) => ({
  type: GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST,
  groupId,
})

const expandRemovedAccountsSuccess = (groupId, accounts, next) => ({
  type: GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
  groupId,
  accounts,
  next,
})

const expandRemovedAccountsFail = (groupId, error) => ({
  type: GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL,
  showToast: true,
  groupId,
  error,
})

/**
 * 
 */
export const fetchGroupRemovedAccountsAdminSearch = (groupId, query) => (dispatch, getState) => {
  if (!groupId || !query) return
  debouncedFetchGroupRemovedAccountsAdminSearch(groupId, query, dispatch, getState) 
}

export const debouncedFetchGroupRemovedAccountsAdminSearch = debounce((groupId, query, dispatch, getState) => {
  if (!groupId || !query) return
  
  api(getState).get(`/api/v1/groups/${groupId}/removed_accounts_search`, {
    params: { q: query },
  }).then((response) => {
    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchGroupRemovedAccountsAdminSearchSuccess(response.data))
  }).catch((error) => {
    //
  })
}, 650, { leading: true })

const fetchGroupRemovedAccountsAdminSearchSuccess = (accounts) => ({
  type: GROUP_REMOVED_ACCOUNTS_SEARCH_SUCCESS,
  accounts,
})

/**
 * 
 */
export const clearGroupRemovedAccountsAdminSearch = () => (dispatch) => {
  dispatch({ type: CLEAR_GROUP_REMOVED_ACCOUNTS_SEARCH })
}

/**
 * @description Remove a "removed account" from a group with the given groupId and accountId.
 * @param {String} groupId
 * @param {String} accountId
 */
export const removeRemovedAccount = (groupId, accountId) => (dispatch, getState) => {
  if (!me || !groupId || !accountId) return

  dispatch(removeRemovedAccountRequest(groupId, accountId))

  api(getState).delete(`/api/v1/groups/${groupId}/removed_accounts?account_id=${accountId}`).then((response) => {
    dispatch(removeRemovedAccountSuccess(groupId, accountId))
  }).catch((error) => {
    dispatch(removeRemovedAccountFail(groupId, accountId, error))
  })
}

const removeRemovedAccountRequest = (groupId, accountId) => ({
  type: GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST,
  groupId,
  accountId,
})

const removeRemovedAccountSuccess = (groupId, accountId) => ({
  type: GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
  showToast: true,
  groupId,
  accountId,
})

const removeRemovedAccountFail = (groupId, accountId, error) => ({
  type: GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL,
  showToast: true,
  groupId,
  accountId,
  error,
})

/**
 * @description Remove an account with given accountId from group with given groupId
 * @param {String} groupId
 * @param {String} accountId
 */
export const createRemovedAccount = (groupId, accountId) => (dispatch, getState) => {
  if (!me) return

  dispatch(createRemovedAccountRequest(groupId, accountId))

  api(getState).post(`/api/v1/groups/${groupId}/removed_accounts?account_id=${accountId}`).then((response) => {
    dispatch(createRemovedAccountSuccess(groupId, accountId))
  }).catch((error) => {
    dispatch(createRemovedAccountFail(groupId, accountId, error))
  })
}

const createRemovedAccountRequest = (groupId, accountId) => ({
  type: GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST,
  groupId,
  accountId,
})

const createRemovedAccountSuccess = (groupId, accountId) => ({
  type: GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS,
  showToast: true,
  groupId,
  accountId,
})

const createRemovedAccountFail = (groupId, accountId, error) => ({
  type: GROUP_REMOVED_ACCOUNTS_CREATE_FAIL,
  showToast: true,
  groupId,
  accountId,
  error,
})

/**
 * @description Remove a status from a group with given groupId and statusId. Then
 *              remove the status from the group timeline on success.
 * @param {String} groupId
 * @param {String} statusId
 */
export const groupRemoveStatus = (groupId, statusId) => (dispatch, getState) => {
  if (!me || !groupId || !statusId) return

  dispatch(groupRemoveStatusRequest(groupId, statusId))

  api(getState).delete(`/api/v1/groups/${groupId}/statuses/${statusId}`).then((response) => {
    dispatch(groupRemoveStatusSuccess(groupId, statusId))
  }).catch((error) => {
    dispatch(groupRemoveStatusFail(groupId, statusId, error))
  })
}

const groupRemoveStatusRequest = (groupId, statusId) => ({
  type: GROUP_REMOVE_STATUS_REQUEST,
  groupId,
  statusId,
})

const groupRemoveStatusSuccess = (groupId, statusId) => ({
  type: GROUP_REMOVE_STATUS_SUCCESS,
  showToast: true,
  groupId,
  statusId,
})

const groupRemoveStatusFail = (groupId, statusId, error) => ({
  type: GROUP_REMOVE_STATUS_FAIL,
  showToast: true,
  groupId,
  statusId,
  error,
})

/**
 * @description Update role to admin, moderator for given accountId in given groupId
 * @param {String} groupId
 * @param {String} accountId
 * @param {String} role
 */
export const updateRole = (groupId, accountId, role) => (dispatch, getState) => {
  if (!me || !groupId || !accountId || !role) return

  dispatch(updateRoleRequest(groupId, accountId))

  api(getState).patch(`/api/v1/groups/${groupId}/accounts?account_id=${accountId}`, { role }).then((response) => {
    dispatch(updateRoleSuccess(groupId, accountId))
  }).catch((error) => {
    dispatch(updateRoleFail(groupId, accountId, error))
  })
}

const updateRoleRequest = (groupId, accountId) => ({
  type: GROUP_UPDATE_ROLE_REQUEST,
  groupId,
  accountId,
})

const updateRoleSuccess = (groupId, accountId) => ({
  type: GROUP_UPDATE_ROLE_SUCCESS,
  showToast: true,
  groupId,
  accountId,
})

const updateRoleFail = (groupId, accountId, error) => ({
  type: GROUP_UPDATE_ROLE_FAIL,
  showToast: true,
  groupId,
  accountId,
  error,
})

/**
 * @description Reset the group password check map when group password model opens
 */
export const checkGroupPasswordReset = () => ({
  type: GROUP_CHECK_PASSWORD_RESET,
})

/**
 * 
 */
export const checkGroupPassword = (groupId, password) => (dispatch, getState) => {
  if (!me || !groupId) return

  dispatch(checkGroupPasswordRequest())

  api(getState).post(`/api/v1/groups/${groupId}/password`, { password }).then((response) => {
    dispatch(joinGroupSuccess(response.data))
    dispatch(checkGroupPasswordSuccess())
  }).catch((error) => {
    dispatch(checkGroupPasswordFail(error))
  })
}

const checkGroupPasswordRequest = () => ({
  type: GROUP_CHECK_PASSWORD_REQUEST,
})

const checkGroupPasswordSuccess = () => ({
  type: GROUP_CHECK_PASSWORD_SUCCESS,
})

export const checkGroupPasswordFail = (error) => ({
  type: GROUP_CHECK_PASSWORD_FAIL,
  error,
})

/**
 * 
 */
export const fetchJoinRequests = (groupId) => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchJoinRequestsRequest(groupId))

  api(getState).get(`/api/v1/groups/${groupId}/join_requests`).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(fetchJoinRequestsSuccess(groupId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(fetchJoinRequestsFail(groupId, error))
  })
}

const fetchJoinRequestsRequest = (groupId) => ({
  type: GROUP_JOIN_REQUESTS_FETCH_REQUEST,
  groupId,
})

const fetchJoinRequestsSuccess = (groupId, accounts, next) => ({
  type: GROUP_JOIN_REQUESTS_FETCH_SUCCESS,
  groupId,
  accounts,
  next,
})

const fetchJoinRequestsFail = (groupId, error) => ({
  type: GROUP_JOIN_REQUESTS_FETCH_FAIL,
  showToast: true,
  groupId,
  error,
})

/**
 * 
 */
export const expandJoinRequests = (groupId) => (dispatch, getState) => {
  if (!me) return

  const url = getState().getIn(['user_lists', 'group_join_requests', groupId, 'next'])
  const isLoading = getState().getIn(['user_lists', 'group_join_requests', groupId, 'isLoading'])

  if (url === null || isLoading) return

  dispatch(expandJoinRequestsRequest(groupId))

  api(getState).get(url).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')

    dispatch(importFetchedAccounts(response.data))
    dispatch(expandJoinRequestsSuccess(groupId, response.data, next ? next.uri : null))
    dispatch(fetchRelationships(response.data.map(item => item.id)))
  }).catch((error) => {
    dispatch(expandJoinRequestsFail(groupId, error))
  })
}

const expandJoinRequestsRequest = (groupId) => ({
  type: GROUP_JOIN_REQUESTS_EXPAND_REQUEST,
  groupId,
})

const expandJoinRequestsSuccess = (id, accounts, next) => ({
  type: GROUP_JOIN_REQUESTS_EXPAND_SUCCESS,
  groupId,
  accounts,
  next,
})

const expandJoinRequestsFail = (groupId, error) => ({
  type: GROUP_JOIN_REQUESTS_EXPAND_FAIL,
  showToast: true,
  groupId,
  error,
})

/**
 * 
 */
export const approveJoinRequest = (accountId, groupId) => (dispatch, getState) => {
  if (!me) return

  api(getState).post(`/api/v1/groups/${groupId}/join_requests/respond`, { accountId, type: 'approve' }).then((response) => {
    dispatch(approveJoinRequestSuccess(response.data.accountId, groupId))
  }).catch((error) => {
    dispatch(approveJoinRequestFail(accountId, groupId, error))
  })
}

const approveJoinRequestSuccess = (accountId, groupId) => ({
  type: GROUP_JOIN_REQUESTS_APPROVE_SUCCESS,
  showToast: true,
  accountId,
  groupId,
})

const approveJoinRequestFail = (accountId, groupId, error) => ({
  type: GROUP_JOIN_REQUESTS_APPROVE_FAIL,
  showToast: true,
  accountId,
  groupId,
  error,
})

/**
 * 
 */
export const rejectJoinRequest = (accountId, groupId) => (dispatch, getState) => {
  if (!me) return

  api(getState).post(`/api/v1/groups/${groupId}/join_requests/respond`, { accountId, type: 'reject' }).then((response) => {
    dispatch(rejectJoinRequestSuccess(response.data.accountId, groupId))
  }).catch((error) => {
    dispatch(rejectJoinRequestFail(accountId, groupId, error))
  })
}

const rejectJoinRequestSuccess = (accountId, groupId) => ({
  type: GROUP_JOIN_REQUESTS_REJECT_SUCCESS,
  showToast: true,
  accountId,
  groupId,
})

const rejectJoinRequestFail = (accountId, groupId, error) => ({
  type: GROUP_JOIN_REQUESTS_REJECT_FAIL,
  showToast: true,
  accountId,
  groupId,
  error,
})

/**
 * 
 */
export const pinGroupStatus = (groupId, statusId) => (dispatch, getState) => {
  if (!me || !groupId || !statusId) return

  dispatch(pinGroupStatusRequest(groupId))

  api(getState).post(`/api/v1/groups/${groupId}/pin`, { statusId }).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(pinGroupStatusSuccess(groupId, statusId))
  }).catch((error) => {
    dispatch(pinGroupStatusFail(groupId, statusId, error))
  })
}

const pinGroupStatusRequest = (groupId) => ({
  type: GROUP_PIN_STATUS_REQUEST,
  groupId,
})

const pinGroupStatusSuccess = (groupId, statusId) => ({
  type: GROUP_PIN_STATUS_SUCCESS,
  showToast: true,
  groupId,
  statusId,
})

const pinGroupStatusFail = (groupId, statusId, error) => ({
  type: GROUP_PIN_STATUS_FAIL,
  showToast: true,
  groupId,
  statusId,
  error,
})

/**
 * 
 */
export const unpinGroupStatus = (groupId, statusId) =>(dispatch, getState) => {
  if (!me || !groupId || !statusId) return

  dispatch(unpinGroupStatusRequest(groupId))

  api(getState).post(`/api/v1/groups/${groupId}/unpin`, { statusId }).then((response) => {
    dispatch(updateStatusStats(response.data))
    dispatch(unpinGroupStatusSuccess(groupId, statusId))
  }).catch((error) => {
    dispatch(unpinGroupStatusFail(groupId, statusId, error))
  })
}

const unpinGroupStatusRequest = (groupId) => ({
  type: GROUP_UNPIN_STATUS_REQUEST,
  groupId,
})

const unpinGroupStatusSuccess = (groupId, statusId) => ({
  type: GROUP_UNPIN_STATUS_SUCCESS,
  showToast: true,
  groupId,
  statusId,
})

const unpinGroupStatusFail = (groupId, statusId, error) => ({
  type: GROUP_UNPIN_STATUS_FAIL,
  showToast: true,
  groupId,
  statusId,
  error,
})


/**
 * 
 */
export const isPinnedGroupStatus = (groupId, statusId) => (dispatch, getState) => {
  if (!me || !groupId || !statusId) return

  dispatch(isPinnedGroupStatusRequest(groupId, statusId))

  api(getState).get(`/api/v1/groups/${groupId}/pin?statusId=${statusId}`).then((response) => {
    dispatch(updateStatusStats(response.data))
  }).catch((error) => {
    dispatch(isPinnedGroupStatusFail(groupId, statusId, error))
  })
}

const isPinnedGroupStatusRequest = (groupId, statusId) => ({
  type: IS_PINNED_GROUP_STATUS_REQUEST,
  groupId,
  statusId,
})

const isPinnedGroupStatusSuccess = (groupId, statusId) => ({
  type: IS_PINNED_GROUP_STATUS_SUCCESS,
  groupId,
  statusId,
})

const isPinnedGroupStatusFail = (groupId, statusId, error) => ({
  type: IS_PINNED_GROUP_STATUS_FAIL,
  groupId,
  statusId,
  error,
})

/**
 * 
 */
export const sortGroups = (tab, sortType) => (dispatch, getState) => {
  const groupIdsByTab = getState().getIn(['group_lists', tab, 'items'], ImmutableList()).toJS()
  const allGroups = getState().get('groups', ImmutableMap()).toJS()

  let groupsByTab = []
  
  for (const key in allGroups) {
    const block = allGroups[key]
    if (groupIdsByTab.indexOf(block.id > -1)) {
      groupsByTab.push(block)
    }
  }

  if (sortType === GROUP_LIST_SORTING_TYPE_ALPHABETICAL) {
    groupsByTab.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortType === GROUP_LIST_SORTING_TYPE_MOST_POPULAR) {
    groupsByTab.sort((a, b) => (a.member_count < b.member_count) ? 1 : -1)
  }

  const sortedGroupsIdsByTab = groupsByTab.map((group) => group.id)

  dispatch(groupsSort(tab, sortedGroupsIdsByTab))
}

export const groupsSort = (tab, groupIds) =>({
  type: GROUP_SORT,
  tab,
  groupIds,
})

export const setGroupTimelineSort = (sortValue) => (dispatch) => {
  dispatch({
    type: GROUP_TIMELINE_SORT,
    sortValue,
  })
}

export const setGroupTimelineTopSort = (sortValue) => (dispatch) => {
  dispatch({
    type: GROUP_TIMELINE_TOP_SORT,
    sortValue,
  })
}
