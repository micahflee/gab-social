import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable'
import api, { getLinks } from '../api';
import { me } from '../initial_state';
import { importFetchedAccounts } from './importer';
import { fetchRelationships } from './accounts';
import {
  GROUP_LIST_SORTING_TYPE_ALPHABETICAL,
  GROUP_LIST_SORTING_TYPE_MOST_POPULAR,
} from '../constants'

export const GROUP_FETCH_REQUEST = 'GROUP_FETCH_REQUEST';
export const GROUP_FETCH_SUCCESS = 'GROUP_FETCH_SUCCESS';
export const GROUP_FETCH_FAIL    = 'GROUP_FETCH_FAIL';

export const GROUP_RELATIONSHIPS_FETCH_REQUEST = 'GROUP_RELATIONSHIPS_FETCH_REQUEST';
export const GROUP_RELATIONSHIPS_FETCH_SUCCESS = 'GROUP_RELATIONSHIPS_FETCH_SUCCESS';
export const GROUP_RELATIONSHIPS_FETCH_FAIL    = 'GROUP_RELATIONSHIPS_FETCH_FAIL';

export const GROUPS_FETCH_REQUEST = 'GROUPS_FETCH_REQUEST';
export const GROUPS_FETCH_SUCCESS = 'GROUPS_FETCH_SUCCESS';
export const GROUPS_FETCH_FAIL    = 'GROUPS_FETCH_FAIL';

export const GROUP_JOIN_REQUEST = 'GROUP_JOIN_REQUEST';
export const GROUP_JOIN_SUCCESS = 'GROUP_JOIN_SUCCESS';
export const GROUP_JOIN_FAIL    = 'GROUP_JOIN_FAIL';

export const GROUP_LEAVE_REQUEST = 'GROUP_LEAVE_REQUEST';
export const GROUP_LEAVE_SUCCESS = 'GROUP_LEAVE_SUCCESS';
export const GROUP_LEAVE_FAIL    = 'GROUP_LEAVE_FAIL';

export const GROUP_MEMBERS_FETCH_REQUEST = 'GROUP_MEMBERS_FETCH_REQUEST';
export const GROUP_MEMBERS_FETCH_SUCCESS = 'GROUP_MEMBERS_FETCH_SUCCESS';
export const GROUP_MEMBERS_FETCH_FAIL    = 'GROUP_MEMBERS_FETCH_FAIL';

export const GROUP_MEMBERS_EXPAND_REQUEST = 'GROUP_MEMBERS_EXPAND_REQUEST';
export const GROUP_MEMBERS_EXPAND_SUCCESS = 'GROUP_MEMBERS_EXPAND_SUCCESS';
export const GROUP_MEMBERS_EXPAND_FAIL    = 'GROUP_MEMBERS_EXPAND_FAIL';

export const GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST = 'GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST';
export const GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS';
export const GROUP_REMOVED_ACCOUNTS_FETCH_FAIL    = 'GROUP_REMOVED_ACCOUNTS_FETCH_FAIL';

export const GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST = 'GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST';
export const GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS';
export const GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL    = 'GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL';

export const GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST';
export const GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS';
export const GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL    = 'GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL';

export const GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST';
export const GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS';
export const GROUP_REMOVED_ACCOUNTS_CREATE_FAIL    = 'GROUP_REMOVED_ACCOUNTS_CREATE_FAIL';

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

export const GROUP_REMOVE_STATUS_REQUEST = 'GROUP_REMOVE_STATUS_REQUEST';
export const GROUP_REMOVE_STATUS_SUCCESS = 'GROUP_REMOVE_STATUS_SUCCESS';
export const GROUP_REMOVE_STATUS_FAIL    = 'GROUP_REMOVE_STATUS_FAIL';

export const GROUP_UPDATE_ROLE_REQUEST = 'GROUP_UPDATE_ROLE_REQUEST';
export const GROUP_UPDATE_ROLE_SUCCESS = 'GROUP_UPDATE_ROLE_SUCCESS';
export const GROUP_UPDATE_ROLE_FAIL    = 'GROUP_UPDATE_ROLE_FAIL';

export const GROUP_CHECK_PASSWORD_RESET = 'GROUP_CHECK_PASSWORD_RESET';
export const GROUP_CHECK_PASSWORD_REQUEST = 'GROUP_CHECK_PASSWORD_REQUEST';
export const GROUP_CHECK_PASSWORD_SUCCESS = 'GROUP_CHECK_PASSWORD_SUCCESS';
export const GROUP_CHECK_PASSWORD_FAIL = 'GROUP_CHECK_PASSWORD_FAIL';

export const GROUP_PIN_STATUS_REQUEST = 'GROUP_PIN_STATUS_REQUEST'
export const GROUP_PIN_STATUS_SUCCESS = 'GROUP_PIN_STATUS_SUCCESS'
export const GROUP_PIN_STATUS_FAIL = 'GROUP_PIN_STATUS_FAIL'

export const GROUP_UNPIN_STATUS_REQUEST = 'GROUP_UNPIN_STATUS_REQUEST'
export const GROUP_UNPIN_STATUS_SUCCESS = 'GROUP_UNPIN_STATUS_SUCCESS'
export const GROUP_UNPIN_STATUS_FAIL = 'GROUP_UNPIN_STATUS_FAIL'

export const GROUPS_BY_CATEGORY_FETCH_REQUEST = 'GROUPS_BY_CATEGORY_FETCH_REQUEST'
export const GROUPS_BY_CATEGORY_FETCH_SUCCESS = 'GROUPS_BY_CATEGORY_FETCH_SUCCESS'
export const GROUPS_BY_CATEGORY_FETCH_FAIL = 'GROUPS_BY_CATEGORY_FETCH_FAIL'

export const GROUPS_BY_TAG_FETCH_REQUEST = 'GROUPS_BY_TAG_FETCH_REQUEST'
export const GROUPS_BY_TAG_FETCH_SUCCESS = 'GROUPS_BY_TAG_FETCH_SUCCESS'
export const GROUPS_BY_TAG_FETCH_FAIL = 'GROUPS_BY_TAG_FETCH_FAIL'

export const GROUP_TIMELINE_SORT = 'GROUP_TIMELINE_SORT'
export const GROUP_TIMELINE_TOP_SORT = 'GROUP_TIMELINE_TOP_SORT'

export const GROUP_SORT = 'GROUP_SORT'

export const importGroup = (group) => (dispatch) => {
  dispatch(fetchGroupSuccess(group))
}

export const fetchGroup = (id) => (dispatch, getState) => {
  dispatch(fetchGroupRelationships([id]));

  if (getState().getIn(['groups', id])) {
    return;
  }

  dispatch(fetchGroupRequest(id));

  api(getState).get(`/api/v1/groups/${id}`)
    .then(({ data }) => dispatch(fetchGroupSuccess(data)))
    .catch(err => dispatch(fetchGroupFail(id, err)));
};

export const fetchGroupRequest = id => ({
  type: GROUP_FETCH_REQUEST,
  id,
});

export const fetchGroupSuccess = group => ({
  type: GROUP_FETCH_SUCCESS,
  group,
});

export const fetchGroupFail = (id, error) => ({
  type: GROUP_FETCH_FAIL,
  id,
  error,
});

export function fetchGroupRelationships(groupIds) {
  return (dispatch, getState) => {
    if (!me) return;

    const loadedRelationships = getState().get('group_relationships');
    const newGroupIds = groupIds.filter(id => loadedRelationships.get(id, null) === null);

    if (newGroupIds.length === 0) {
      return;
    }

    dispatch(fetchGroupRelationshipsRequest(newGroupIds));

    api(getState).get(`/api/v1/groups/${newGroupIds[0]}/relationships?${newGroupIds.map(id => `id[]=${id}`).join('&')}`).then(response => {
      dispatch(fetchGroupRelationshipsSuccess(response.data));
    }).catch(error => {
      dispatch(fetchGroupRelationshipsFail(error));
    });
  };
};

export function fetchGroupRelationshipsRequest(ids) {
  return {
    type: GROUP_RELATIONSHIPS_FETCH_REQUEST,
    ids,
    skipLoading: true,
  };
};

export function fetchGroupRelationshipsSuccess(relationships) {
  return {
    type: GROUP_RELATIONSHIPS_FETCH_SUCCESS,
    relationships,
    skipLoading: true,
  };
};

export function fetchGroupRelationshipsFail(error) {
  return {
    type: GROUP_RELATIONSHIPS_FETCH_FAIL,
    error,
    skipLoading: true,
  };
};

export const fetchGroups = (tab) => (dispatch, getState) => {
  if (!me && tab !== 'featured') return

  // Don't refetch or fetch when loading
  const isLoading = getState().getIn(['group_lists', tab, 'isLoading'])
  const isFetched = getState().getIn(['group_lists', tab, 'isFetched'])

  if (isLoading || isFetched) return

  dispatch(fetchGroupsRequest(tab))

  api(getState).get('/api/v1/groups?tab=' + tab)
    .then(({ data }) => {
      dispatch(fetchGroupsSuccess(data, tab))
      dispatch(fetchGroupRelationships(data.map(item => item.id)))
    })
    .catch((err) => dispatch(fetchGroupsFail(err, tab)))
}

export const fetchGroupsRequest = (tab) => ({
  type: GROUPS_FETCH_REQUEST,
  tab,
});

export const fetchGroupsSuccess = (groups, tab) => ({
  type: GROUPS_FETCH_SUCCESS,
  groups,
  tab,
});

export const fetchGroupsFail = (error, tab) => ({
  type: GROUPS_FETCH_FAIL,
  error,
  tab,
});

export const fetchGroupsByCategory = (category) => (dispatch, getState) => {
  // Don't refetch or fetch when loading
  const isLoading = getState().getIn(['group_lists', 'by_category', category, 'isLoading'], false)

  if (isLoading) return

  dispatch(fetchGroupsByCategoryRequest(category))

  api(getState).get(`/api/v1/groups/_/category/${category}`)
    .then(({ data }) => {
      dispatch(fetchGroupsByCategorySuccess(data, category))
      dispatch(fetchGroupRelationships(data.map(item => item.id)))
    })
    .catch((err) => dispatch(fetchGroupsByCategoryFail(err, category)))
}

export const fetchGroupsByCategoryRequest = (category) => ({
  type: GROUPS_BY_CATEGORY_FETCH_REQUEST,
  category,
})

export const fetchGroupsByCategorySuccess = (groups, category) => ({
  type: GROUPS_BY_CATEGORY_FETCH_SUCCESS,
  groups,
  category,
})

export const fetchGroupsByCategoryFail = (error, category) => ({
  type: GROUPS_BY_CATEGORY_FETCH_FAIL,
  error,
  category,
})

export const fetchGroupsByTag = (tag) => (dispatch, getState) => {
  // Don't refetch or fetch when loading
  const isLoading = getState().getIn(['group_lists', 'by_tag', tag, 'isLoading'], false)

  if (isLoading) return

  dispatch(fetchGroupsByTagRequest(tag))

  api(getState).get(`/api/v1/groups/_/tag/${tag}`)
    .then(({ data }) => {
      dispatch(fetchGroupsByTagSuccess(data, tag))
      dispatch(fetchGroupRelationships(data.map(item => item.id)))
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
  error,
  tag,
})

export function joinGroup(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(joinGroupRequest(id));

    api(getState).post(`/api/v1/groups/${id}/accounts`).then(response => {
      dispatch(joinGroupSuccess(response.data));
    }).catch(error => {
      dispatch(joinGroupFail(id, error));
    });
  };
};

export function leaveGroup(id) {
  return (dispatch, getState) => {
    if (!me) return;
    
    dispatch(leaveGroupRequest(id));

    api(getState).delete(`/api/v1/groups/${id}/accounts`).then(response => {
      dispatch(leaveGroupSuccess(response.data));
    }).catch(error => {
      dispatch(leaveGroupFail(id, error));
    });
  };
};

export function joinGroupRequest(id) {
  return {
    type: GROUP_JOIN_REQUEST,
    id,
  };
};

export function joinGroupSuccess(relationship) {
  return {
    type: GROUP_JOIN_SUCCESS,
    relationship
  };
};

export function joinGroupFail(error) {
  return {
    type: GROUP_JOIN_FAIL,
    error,
  };
};

export function leaveGroupRequest(id) {
  return {
    type: GROUP_LEAVE_REQUEST,
    id,
  };
};

export function leaveGroupSuccess(relationship) {
  return {
    type: GROUP_LEAVE_SUCCESS,
    relationship,
  };
};

export function leaveGroupFail(error) {
  return {
    type: GROUP_LEAVE_FAIL,
    error,
  };
};

export function fetchMembers(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(fetchMembersRequest(id));

    api(getState).get(`/api/v1/groups/${id}/accounts`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchMembersSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchMembersFail(id, error));
    });
  };
};

export function fetchMembersRequest(id) {
  return {
    type: GROUP_MEMBERS_FETCH_REQUEST,
    id,
  };
};

export function fetchMembersSuccess(id, accounts, next) {
  return {
    type: GROUP_MEMBERS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function fetchMembersFail(id, error) {
  return {
    type: GROUP_MEMBERS_FETCH_FAIL,
    id,
    error,
  };
};

export function expandMembers(id) {
  return (dispatch, getState) => {
    if (!me) return;

    const url = getState().getIn(['user_lists', 'groups', id, 'next'])
    const isLoading = getState().getIn(['user_lists', 'groups', id, 'isLoading'])

    if (url === null || isLoading) return

    dispatch(expandMembersRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandMembersSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(expandMembersFail(id, error));
    });
  };
};

export function expandMembersRequest(id) {
  return {
    type: GROUP_MEMBERS_EXPAND_REQUEST,
    id,
  };
};

export function expandMembersSuccess(id, accounts, next) {
  return {
    type: GROUP_MEMBERS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function expandMembersFail(id, error) {
  return {
    type: GROUP_MEMBERS_EXPAND_FAIL,
    id,
    error,
  };
};

export function fetchRemovedAccounts(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(fetchRemovedAccountsRequest(id));

    api(getState).get(`/api/v1/groups/${id}/removed_accounts`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchRemovedAccountsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchRemovedAccountsFail(id, error));
    });
  };
};

export function fetchRemovedAccountsRequest(id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST,
    id,
  };
};

export function fetchRemovedAccountsSuccess(id, accounts, next) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function fetchRemovedAccountsFail(id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_FETCH_FAIL,
    id,
    error,
  };
};

export function expandRemovedAccounts(id) {
  return (dispatch, getState) => {
    if (!me) return;

    const url = getState().getIn(['user_lists', 'group_removed_accounts', id, 'next']);
    const isLoading = getState().getIn(['user_lists', 'group_removed_accounts', id, 'isLoading'])

    if (url === null || isLoading) return

    dispatch(expandRemovedAccountsRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandRemovedAccountsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(expandRemovedAccountsFail(id, error));
    });
  };
};

export function expandRemovedAccountsRequest(id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST,
    id,
  };
};

export function expandRemovedAccountsSuccess(id, accounts, next) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function expandRemovedAccountsFail(id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL,
    id,
    error,
  };
};

export function removeRemovedAccount(groupId, id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(removeRemovedAccountRequest(groupId, id));

    api(getState).delete(`/api/v1/groups/${groupId}/removed_accounts?account_id=${id}`).then(response => {
      dispatch(removeRemovedAccountSuccess(groupId, id));
    }).catch(error => {
      dispatch(removeRemovedAccountFail(groupId, id, error));
    });
  };
};

export function removeRemovedAccountRequest(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST,
    groupId,
    id,
  };
};

export function removeRemovedAccountSuccess(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
    groupId,
    id,
  };
};

export function removeRemovedAccountFail(groupId, id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL,
    groupId,
    id,
    error,
  };
};

export function createRemovedAccount(groupId, id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(createRemovedAccountRequest(groupId, id));

    api(getState).post(`/api/v1/groups/${groupId}/removed_accounts?account_id=${id}`).then(response => {
      dispatch(createRemovedAccountSuccess(groupId, id));
    }).catch(error => {
      dispatch(createRemovedAccountFail(groupId, id, error));
    });
  };
};

export function createRemovedAccountRequest(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST,
    groupId,
    id,
  };
};

export function createRemovedAccountSuccess(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS,
    groupId,
    id,
  };
};

export function createRemovedAccountFail(groupId, id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_FAIL,
    groupId,
    id,
    error,
  };
};

export function groupRemoveStatus(groupId, id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(groupRemoveStatusRequest(groupId, id));

    api(getState).delete(`/api/v1/groups/${groupId}/statuses/${id}`).then(response => {
      dispatch(groupRemoveStatusSuccess(groupId, id));
    }).catch(error => {
      dispatch(groupRemoveStatusFail(groupId, id, error));
    });
  };
};

export function groupRemoveStatusRequest(groupId, id) {
  return {
    type: GROUP_REMOVE_STATUS_REQUEST,
    groupId,
    id,
  };
};

export function groupRemoveStatusSuccess(groupId, id) {
  return {
    type: GROUP_REMOVE_STATUS_SUCCESS,
    groupId,
    id,
  };
};

export function groupRemoveStatusFail(groupId, id, error) {
  return {
    type: GROUP_REMOVE_STATUS_FAIL,
    groupId,
    id,
    error,
  };
};

export function updateRole(groupId, id, role) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(updateRoleRequest(groupId, id));

    api(getState).patch(`/api/v1/groups/${groupId}/accounts?account_id=${id}`, { role }).then(response => {
      dispatch(updateRoleSuccess(groupId, id));
    }).catch(error => {
      dispatch(updateRoleFail(groupId, id, error));
    });
  };
};

export function updateRoleRequest(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST,
    groupId,
    id,
  };
};

export function updateRoleSuccess(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS,
    groupId,
    id,
  };
};

export function updateRoleFail(groupId, id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_FAIL,
    groupId,
    id,
    error,
  };
};

export function checkGroupPassword(groupId, password) {
  return (dispatch, getState) => {
    if (!me) return

    dispatch(checkGroupPasswordRequest())

    api(getState).post(`/api/v1/groups/${groupId}/password`, { password }).then((response) => {
      dispatch(joinGroupSuccess(response.data))
      dispatch(checkGroupPasswordSuccess())
    }).catch(error => {
      dispatch(checkGroupPasswordFail(error))
    })
  }
}

export function checkGroupPasswordReset() {
  return {
    type: GROUP_CHECK_PASSWORD_RESET,
  }
}

export function checkGroupPasswordRequest() {
  return {
    type: GROUP_CHECK_PASSWORD_REQUEST,
  }
}

export function checkGroupPasswordSuccess() {
  return {
    type: GROUP_CHECK_PASSWORD_SUCCESS,
  }
}

export function checkGroupPasswordFail(error) {
  return {
    type: GROUP_CHECK_PASSWORD_FAIL,
    error,
  }
}

export function fetchJoinRequests(id) {
  return (dispatch, getState) => {
    if (!me) return

    dispatch(fetchJoinRequestsRequest(id))

    api(getState).get(`/api/v1/groups/${id}/join_requests`).then((response) => {
      const next = getLinks(response).refs.find(link => link.rel === 'next')

      dispatch(importFetchedAccounts(response.data))
      dispatch(fetchJoinRequestsSuccess(id, response.data, next ? next.uri : null))
      dispatch(fetchRelationships(response.data.map(item => item.id)))
    }).catch((error) => {
      dispatch(fetchJoinRequestsFail(id, error))
    })
  }
}

export function fetchJoinRequestsRequest(id) {
  return {
    type: GROUP_JOIN_REQUESTS_FETCH_REQUEST,
    id,
  }
}

export function fetchJoinRequestsSuccess(id, accounts, next) {
  return {
    type: GROUP_JOIN_REQUESTS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  }
}

export function fetchJoinRequestsFail(id, error) {
  return {
    type: GROUP_JOIN_REQUESTS_FETCH_FAIL,
    id,
    error,
  }
}

export function expandJoinRequests(id) {
  return (dispatch, getState) => {
    if (!me) return

    const url = getState().getIn(['user_lists', 'group_join_requests', id, 'next'])
    const isLoading = getState().getIn(['user_lists', 'group_join_requests', id, 'isLoading'])

    if (url === null || isLoading) return

    dispatch(expandJoinRequestsRequest(id))

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next')

      dispatch(importFetchedAccounts(response.data))
      dispatch(expandJoinRequestsSuccess(id, response.data, next ? next.uri : null))
      dispatch(fetchRelationships(response.data.map(item => item.id)))
    }).catch(error => {
      dispatch(expandJoinRequestsFail(id, error))
    })
  }
}

export function expandJoinRequestsRequest(id) {
  return {
    type: GROUP_JOIN_REQUESTS_EXPAND_REQUEST,
    id,
  }
}

export function expandJoinRequestsSuccess(id, accounts, next) {
  return {
    type: GROUP_JOIN_REQUESTS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  }
}

export function expandJoinRequestsFail(id, error) {
  return {
    type: GROUP_JOIN_REQUESTS_EXPAND_FAIL,
    id,
    error,
  }
}

export const approveJoinRequest = (accountId, groupId) => (dispatch, getState) => {
  if (!me) return

  api(getState).post(`/api/v1/groups/${groupId}/join_requests/respond`, { accountId, type: 'approve' }).then((response) => {
    dispatch(approveJoinRequestSuccess(response.data.accountId, groupId))
  }).catch((error) => {
    dispatch(approveJoinRequestFail(accountId, groupId, error))
  })
}

export function approveJoinRequestSuccess(accountId, groupId) {
  return {
    type: GROUP_JOIN_REQUESTS_APPROVE_SUCCESS,
    accountId,
    groupId,
  }
}

export function approveJoinRequestFail(accountId, groupId, error) {
  return {
    type: GROUP_JOIN_REQUESTS_APPROVE_FAIL,
    accountId,
    groupId,
    error,
  }
}

export const rejectJoinRequest = (accountId, groupId) => (dispatch, getState) => {
  if (!me) return

  api(getState).post(`/api/v1/groups/${groupId}/join_requests/respond`, { accountId, type: 'reject' }).then((response) => {
    console.log("response:", response)
    dispatch(rejectJoinRequestSuccess(response.data.accountId, groupId))
  }).catch((error) => {
    dispatch(rejectJoinRequestFail(accountId, groupId, error))
  })
}

export function rejectJoinRequestSuccess(accountId, groupId) {
  return {
    type: GROUP_JOIN_REQUESTS_REJECT_SUCCESS,
    accountId,
    groupId,
  }
}

export function rejectJoinRequestFail(accountId, groupId, error) {
  return {
    type: GROUP_JOIN_REQUESTS_REJECT_FAIL,
    accountId,
    groupId,
    error,
  }
}

export function pinGroupStatus(groupId, statusId) {
  return (dispatch, getState) => {
    if (!me) return

    dispatch(pinGroupStatusRequest(groupId))

    api(getState).post(`/api/v1/groups/${groupId}/pin`, { statusId }).then((response) => {
      dispatch(pinGroupStatusSuccess(groupId, statusId))
    }).catch((error) => {
      dispatch(pinGroupStatusFail(groupId, statusId, error))
    })
  }
}

export function pinGroupStatusRequest(groupId) {
  return {
    type: GROUP_PIN_STATUS_REQUEST,
    groupId,
  }
}

export function pinGroupStatusSuccess(groupId, statusId) {
  return {
    type: GROUP_PIN_STATUS_SUCCESS,
    groupId,
    statusId,
  }
}

export function pinGroupStatusFail(groupId, statusId, error) {
  return {
    type: GROUP_PIN_STATUS_FAIL,
    groupId,
    statusId,
    error,
  }
}

export function unpinGroupStatus(groupId, statusId) {
  return (dispatch, getState) => {
    if (!me) return

    dispatch(unpinGroupStatusRequest(groupId))

    api(getState).post(`/api/v1/groups/${groupId}/unpin`, { statusId }).then((response) => {
      dispatch(unpinGroupStatusSuccess(groupId, statusId))
    }).catch((error) => {
      dispatch(unpinGroupStatusFail(groupId, statusId, error))
    })
  }
}

export function unpinGroupStatusRequest(groupId) {
  return {
    type: GROUP_UNPIN_STATUS_REQUEST,
    groupId,
  }
}

export function unpinGroupStatusSuccess(groupId, statusId) {
  return {
    type: GROUP_UNPIN_STATUS_SUCCESS,
    groupId,
    statusId,
  }
}

export function unpinGroupStatusFail(groupId, statusId, error) {
  return {
    type: GROUP_UNPIN_STATUS_FAIL,
    groupId,
    statusId,
    error,
  }
}

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
};

export function groupsSort(tab, groupIds) {
  return {
    type: GROUP_SORT,
    tab,
    groupIds,
  }
}

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
