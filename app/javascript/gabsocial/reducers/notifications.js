import {
  NOTIFICATIONS_INITIALIZE,
  NOTIFICATIONS_UPDATE,
  NOTIFICATIONS_EXPAND_SUCCESS,
  NOTIFICATIONS_EXPAND_REQUEST,
  NOTIFICATIONS_EXPAND_FAIL,
  NOTIFICATIONS_FILTER_SET,
  NOTIFICATIONS_CLEAR,
  NOTIFICATIONS_SCROLL_TOP,
  NOTIFICATIONS_UPDATE_QUEUE,
  NOTIFICATIONS_DEQUEUE,
  MAX_QUEUED_NOTIFICATIONS,
  NOTIFICATIONS_MARK_READ,
} from '../actions/notifications';
import {
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
} from '../actions/accounts';
import { TIMELINE_DELETE, TIMELINE_DISCONNECT } from '../actions/timelines';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import compareId from '../utils/compare_id';
import { unreadCount } from '../initial_state';

const initialState = ImmutableMap({
  items: ImmutableList(),
  hasMore: true,
  top: false,
  unread: 0,
  isLoading: false,
  queuedNotifications: ImmutableList(), //max = MAX_QUEUED_NOTIFICATIONS
  totalQueuedNotificationsCount: 0, //used for queuedItems overflow for MAX_QUEUED_NOTIFICATIONS+
  lastRead: -1,
  filter: ImmutableMap({
    active: 'all',
    onlyVerified: false,
    onlyFollowing: false,
  }),
});

const notificationToMap = notification => ImmutableMap({
  id: notification.id,
  type: notification.type,
  account: notification.account.id,
  created_at: notification.created_at,
  status: notification.status ? notification.status.id : null,
});

const normalizeNotification = (state, notification) => {
  const top = state.get('top');

  if (!top) {
    state = state.update('unread', unread => unread + 1);
  }

  return state.update('items', list => {
    if (top && list.size > 40) {
      list = list.take(20);
    }

    return list.unshift(notificationToMap(notification));
  });
};

const expandNormalizedNotifications = (state, notifications, next) => {
  //Grouped items
  let follows = ImmutableList()
  let likes = {}
  let reposts = {}
  
  let items = ImmutableList()

  notifications.forEach((n) => {
    const notification = notificationToMap(n)
    const statusId = notification.get('status')
    const type = notification.get('type')

    switch (type) {
      case 'follow': {
        follows = follows.set(follows.size, notification)
        break
      }
      case 'favourite': {
        if (likes[statusId] === undefined) likes[statusId] = []
        likes[statusId].push({
          account: notification.get('account'),
        })
        break
      }
      case 'reblog': {
        if (reposts[statusId] === undefined) reposts[statusId] = []
        reposts[statusId].push({
          account: notification.get('account'),
        })
        break
      }
      default: {
        items = items.set(items.size, notification)
        break
      }
    }
  })

  if (follows.size > 0) {
    items = items.set(items.size, ImmutableMap({
      follow: follows,
    }))
  }
  if (Object.keys(likes).length > 0) {
    for (const statusId in likes) {
      if (likes.hasOwnProperty(statusId)) {
        const likeArr = likes[statusId]
        const accounts = likeArr.map((l) => l.account)
        items = items.set(items.size, ImmutableMap({
          like: ImmutableMap({
            status: statusId,
            accounts: accounts,
          })
        }))
      }
    }
  }
  if (Object.keys(reposts).length > 0) {
    for (const statusId in reposts) {
      if (reposts.hasOwnProperty(statusId)) {
        const repostArr = reposts[statusId]
        const accounts = repostArr.map((l) => l.account)
        items = items.set(items.size, ImmutableMap({
          repost: ImmutableMap({
            status: statusId,
            accounts: accounts,
          })
        }))
      }
    }
  }

  return state.withMutations(mutable => {
    if (!items.isEmpty()) {
      mutable.update('items', list => {
        const lastIndex = 1 + list.findLastIndex(
          item => item !== null && (compareId(item.get('id'), items.last().get('id')) > 0 || item.get('id') === items.last().get('id'))
        )

        const firstIndex = 1 + list.take(lastIndex).findLastIndex(
          item => item !== null && compareId(item.get('id'), items.first().get('id')) > 0
        )

        const pop = list.take(firstIndex).concat(items, list.skip(lastIndex))

        return pop
      })
    }

    if (!next) {
      mutable.set('hasMore', false);
    }

    mutable.set('isLoading', false);
  });
};

const filterNotifications = (state, relationship) => {
  return state.update('items', list => list.filterNot(item => item !== null && item.get('account') === relationship.id));
};

const updateTop = (state, top) => {
  if (top) {
    state = state.set('unread', 0);
  }

  return state.set('top', top);
};

const deleteByStatus = (state, statusId) => {
  return state.update('items', list => list.filterNot(item => item !== null && item.get('status') === statusId));
};

const updateNotificationsQueue = (state, notification, intlMessages, intlLocale) => {
  const queuedNotifications = state.getIn(['queuedNotifications'], ImmutableList());
  const listedNotifications = state.getIn(['items'], ImmutableList());
  const totalQueuedNotificationsCount = state.getIn(['totalQueuedNotificationsCount'], 0);
  const unread = state.getIn(['unread'], 0)

  let alreadyExists = queuedNotifications.find(existingQueuedNotification => existingQueuedNotification.id === notification.id);
  if (!alreadyExists) alreadyExists = listedNotifications.find(existingListedNotification => existingListedNotification.get('id') === notification.id);

  if (alreadyExists) {
    return state;
  }

  let newQueuedNotifications = queuedNotifications;

  return state.withMutations(mutable => {
    if (totalQueuedNotificationsCount <= MAX_QUEUED_NOTIFICATIONS) {
      mutable.set('queuedNotifications', newQueuedNotifications.push({
        notification,
        intlMessages,
        intlLocale,
      }));
    }
    mutable.set('totalQueuedNotificationsCount', totalQueuedNotificationsCount + 1);
    mutable.set('unread', unread + 1);
  });
};

export default function notifications(state = initialState, action) {
  switch(action.type) {
  case NOTIFICATIONS_INITIALIZE:
    return state.set('unread', unreadCount);
  case NOTIFICATIONS_MARK_READ:
    return state.set('lastRead', action.notification);
  case NOTIFICATIONS_EXPAND_REQUEST:
    return state.set('isLoading', true);
  case NOTIFICATIONS_EXPAND_FAIL:
    return state.set('isLoading', false);
  case NOTIFICATIONS_FILTER_SET:
    return state.withMutations(mutable => {
      mutable.set('items', ImmutableList()).set('hasMore', true)
      mutable.setIn(['filter', action.path], action.value)
    })
  case NOTIFICATIONS_SCROLL_TOP:
    return updateTop(state, action.top);
  case NOTIFICATIONS_UPDATE:
    return normalizeNotification(state, action.notification);
  case NOTIFICATIONS_UPDATE_QUEUE:
    return updateNotificationsQueue(state, action.notification, action.intlMessages, action.intlLocale);
  case NOTIFICATIONS_DEQUEUE:
    return state.withMutations(mutable => {
      mutable.set('queuedNotifications', ImmutableList())
      mutable.set('totalQueuedNotificationsCount', 0)
    });
  case NOTIFICATIONS_EXPAND_SUCCESS:
    return expandNormalizedNotifications(state, action.notifications, action.next);
  case ACCOUNT_BLOCK_SUCCESS:
    return filterNotifications(state, action.relationship);
  case ACCOUNT_MUTE_SUCCESS:
    return action.relationship.muting_notifications ? filterNotifications(state, action.relationship) : state;
  case NOTIFICATIONS_CLEAR:
    return state.set('items', ImmutableList()).set('hasMore', false);
  case TIMELINE_DELETE:
    return deleteByStatus(state, action.id);
  case TIMELINE_DISCONNECT:
    return action.timeline === 'home' ?
      state.update('items', items => items.first() ? items.unshift(null) : items) :
      state;
  default:
    return state;
  }
};
