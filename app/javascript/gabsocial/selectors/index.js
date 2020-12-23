import { createSelector } from 'reselect'
import { List as ImmutableList } from 'immutable'
import { me } from '../initial_state'

const getAccountBase = (state, id) => state.getIn(['accounts', id], null)
const getAccountCounters = (state, id) => state.getIn(['accounts_counters', id], null)
const getAccountRelationship = (state, id) => state.getIn(['relationships', id], null)
const getAccountMoved = (state, id) => state.getIn(['accounts', state.getIn(['accounts', id, 'moved'])])

export const makeGetAccount = () => {
  return createSelector([getAccountBase, getAccountCounters, getAccountRelationship, getAccountMoved], (base, counters, relationship, moved) => {
    if (base === null) {
      return null
    }

    return base.merge(counters).withMutations(map => {
      map.set('relationship', relationship)
      map.set('moved', moved)
    });
  });
};

export const makeGetChatMessage = () => {
  return createSelector(
    [
      (state) => state,
      (state, { id }) => state.getIn(['chat_messages', id]),
      (state, { id }) => state.getIn(['accounts', `${state.getIn(['chat_messages', `${id}`, 'from_account_id'])}`]),
    ],
    (state, base, account) => {
      if (!base) return null
      return base.withMutations((map) => {
        map.set('account', account)
      })
    }
  )
}

export const makeGetChatConversation = () => {
  return createSelector(
    [
      (state) => state,
      (state, { id }) => state.getIn(['chat_conversations', `${id}`]),
      (state) => state.get('accounts'),
    ],
    (state, base, allAccounts) => {
      if (!base) return null
    
      let otherAccounts = ImmutableList()
      if (allAccounts) {
        base.get('other_account_ids').forEach((acctId) => {
          const acct = allAccounts.get(`${acctId}`, null)
          if (acct) {
            otherAccounts = otherAccounts.set(otherAccounts.size, acct)
          }
        })
      }

      return base.withMutations((map) => {
        map.set('other_accounts', otherAccounts)
      })
    }
  )
}

const toServerSideType = columnType => {
  switch (columnType) {
    case 'home':
    case 'notifications':
    case 'public':
    case 'thread':
      return columnType
    default:
      if (columnType.indexOf('list:') > -1) {
        return 'home'
      } else {
        return 'public' // community, account, hashtag
      }
  }
};

export const getFilters = (state, { contextType }) => state.get('filters', ImmutableList()).filter(filter => contextType && filter.get('context').includes(toServerSideType(contextType)) && (filter.get('expires_at') === null || Date.parse(filter.get('expires_at')) > (new Date())));

export const getPromotions = () => {
  return createSelector([
    (state) => state,
    (state) => state.getIn(['accounts', me, 'is_pro']),
    (state) => state.get('promotions'),
  ], (state, isPro, promotions) => {
    return !isPro ? promotions : []
  })
}

const escapeRegExp = string =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

export const regexFromFilters = filters => {
  if (filters.size === 0) {
    return null;
  }

  return new RegExp(filters.map(filter => {
    let expr = escapeRegExp(filter.get('phrase'));

    if (filter.get('whole_word')) {
      if (/^[\w]/.test(expr)) {
        expr = `\\b${expr}`;
      }

      if (/[\w]$/.test(expr)) {
        expr = `${expr}\\b`;
      }
    }

    return expr;
  }).join('|'), 'i');
};

export const makeGetStatus = () => {
  return createSelector(
    [
      (state) => state,
      (state, { id }) => state.getIn(['statuses', id]),
      (state, { id }) => state.getIn(['groups', state.getIn(['statuses', id, 'group'])]),
      (state, { id }) => state.getIn(['groups', state.getIn(['statuses', state.getIn(['statuses', id, 'reblog']), 'group'])]),
      (state, { id }) => state.getIn(['statuses', state.getIn(['statuses', id, 'quote_of_id'])]),
      (state, { id }) => state.getIn(['groups', state.getIn(['statuses', state.getIn(['statuses', id, 'quote_of_id']), 'group'])]),
      (state, { id }) => state.getIn(['statuses', state.getIn(['statuses', id, 'reblog'])]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['statuses', id, 'account'])]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['statuses', state.getIn(['statuses', id, 'quote_of_id']), 'account'])]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['statuses', state.getIn(['statuses', id, 'reblog']), 'account'])]),
      (state, { username }) => username,
      getFilters,
    ],

    (state, statusBase, group, groupRepost, quotedStatus, quotedStatusGroup, statusRepost, accountBase, accountQuoted, accountRepost, username, filters) => {
      if (!statusBase) {
        return null
      }

      const accountUsername = accountBase.get('acct');
      //Must be owner of status if username exists
      if (accountUsername !== username && username !== undefined) {
        return null
      }

      if (statusRepost) {
        statusRepost = statusRepost.set('account', accountRepost)
        if (groupRepost) statusRepost = statusRepost.set('group', groupRepost)

        //Check if theres a quoted post that
        const statusRepostQuoteId = statusRepost.get('quote_of_id')
        if (!!statusRepostQuoteId) {
          //Get repost's quoted post
          let repostedQuotedStatus = state.getIn(['statuses', statusRepostQuoteId])
          if (repostedQuotedStatus) {
            //Get/set account and set quoted_status
            const repostedQuotedStatusAccount = state.getIn(['accounts', repostedQuotedStatus.get('account')])
            repostedQuotedStatus = repostedQuotedStatus.set('account', repostedQuotedStatusAccount)

            statusRepost = statusRepost.set('quoted_status', repostedQuotedStatus)
          }
        }
      } else {
        statusRepost = null;
      }

      if (quotedStatus) {
        quotedStatus = quotedStatus.set('account', accountQuoted);
        if (quotedStatusGroup) quotedStatus = quotedStatus.set('group', quotedStatusGroup)
      }

      //Find ancestor status

      const regex = (accountRepost || accountBase).get('id') !== me && regexFromFilters(filters);
      const filtered = regex && regex.test(statusBase.get('reblog') ? statusRepost.get('search_index') : statusBase.get('search_index'));

      return statusBase.withMutations((map) => {
        map.set('quoted_status', quotedStatus);
        map.set('reblog', statusRepost);
        map.set('account', accountBase);
        map.set('filtered', filtered);
        map.set('group', group);
      });
    }
  );
};

export const makeGetNotification = () => {
  return createSelector([
    (_, base) => base,
    (state, _, accountId) => state.getIn(['accounts', accountId]),
  ], (base, account) => {
    return base.set('account', account);
  });
};

export const getAccountGallery = createSelector([
  (state, id) => state.getIn(['timelines', `account:${id}:media`, 'items'], ImmutableList()),
  state => state.get('statuses'),
  (state, id, mediaType) => mediaType,
], (statusIds, statuses, mediaType) => {
  let medias = ImmutableList()

  statusIds.forEach((statusId) => {
    const status = statuses.get(statusId)
    medias = medias.concat(
      status.get('media_attachments')
        .filter((media) => {
          if (mediaType === 'video') {
            return media.get('type') === 'video'
          }
          
          return media.get('type') !== 'video'
        })
        .map((media) => media.set('status', status))
    )
  })

  return medias
})

export const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) return lists

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title')))
})

export const getToasts = createSelector([
  (state) => state.get('toasts'),
], (base) => {
  if (!base) return null

  let arr = []

  base.forEach((item) => {
    arr.push({
      message: item.get('message'),
      type: item.get('type'),
      key: item.get('key'),
    })
  })

  return arr
})

export const getListOfGroups = createSelector([
  (state) => state.get('groups'),
  (state, { type }) => state.getIn(['group_lists', type, 'items']),
], (groups, groupIds) => {
  let list = ImmutableList()
  groupIds.forEach((id, i) => {
    const group = groups.get(`${id}`)
    list = list.set(i, group)
  })

  return list
})