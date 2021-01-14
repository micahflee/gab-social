import { Map as ImmutableMap, List as ImmutableList, toJS } from 'immutable'
import noop from 'lodash.noop'
import { importFetchedStatus, importFetchedStatuses } from './importer'
import api, { getLinks } from '../api'
import { me } from '../initial_state'
import { fetchRelationships } from './accounts'

export const TIMELINE_UPDATE = 'TIMELINE_UPDATE'
export const TIMELINE_DELETE = 'TIMELINE_DELETE'
export const TIMELINE_CLEAR = 'TIMELINE_CLEAR'
export const TIMELINE_UPDATE_QUEUE = 'TIMELINE_UPDATE_QUEUE'
export const TIMELINE_DEQUEUE = 'TIMELINE_DEQUEUE'
export const TIMELINE_SCROLL_TOP = 'TIMELINE_SCROLL_TOP'

export const TIMELINE_EXPAND_REQUEST = 'TIMELINE_EXPAND_REQUEST'
export const TIMELINE_EXPAND_SUCCESS = 'TIMELINE_EXPAND_SUCCESS'
export const TIMELINE_EXPAND_FAIL = 'TIMELINE_EXPAND_FAIL'

export const TIMELINE_CONNECT = 'TIMELINE_CONNECT'
export const TIMELINE_DISCONNECT = 'TIMELINE_DISCONNECT'

export const MAX_QUEUED_ITEMS = 40

const parseTags = (tags = {}, mode) => {
  return (tags[mode] || []).map((tag) => tag.value)
}

/**
 * 
 */
export const updateTimeline = (timeline, status, accept) => (dispatch) => {
  if (typeof accept === 'function' && !accept(status)) return

  dispatch(importFetchedStatus(status))

  dispatch({
    type: TIMELINE_UPDATE,
    timeline,
    status,
  })
}

/**
 * 
 */
export const updateTimelineQueue = (timeline, status, accept) => (dispatch) => {
  if (typeof accept === 'function' && !accept(status)) return

  dispatch({
    type: TIMELINE_UPDATE_QUEUE,
    timeline,
    status,
  })
}

/**
 * 
 */
export const forceDequeueTimeline = (timeline) => (dispatch) => {
  dispatch({
    type: TIMELINE_DEQUEUE,
    timeline,
  })
}

/**
 * 
 */
export const dequeueTimeline = (timeline, expandFunc, optionalExpandArgs) => (dispatch, getState) => {
  const queuedItems = getState().getIn(['timelines', timeline, 'queuedItems'], ImmutableList())
  const totalQueuedItemsCount = getState().getIn(['timelines', timeline, 'totalQueuedItemsCount'], 0)

  let shouldDispatchDequeue = true

  if (totalQueuedItemsCount === 0) return
    
    
  if (totalQueuedItemsCount > 0 && totalQueuedItemsCount <= MAX_QUEUED_ITEMS) {
    queuedItems.forEach((status) => {
      dispatch(updateTimeline(timeline, status.toJS(), null))
    })
  } else {
    if (typeof expandFunc === 'function') {
      dispatch(clearTimeline(timeline))
      expandFunc()
    } else {
      if (timeline === 'home') {
        dispatch(clearTimeline(timeline))
        dispatch(expandHomeTimeline(optionalExpandArgs))
      } else {
        shouldDispatchDequeue = false
      }
    }
  }

  if (!shouldDispatchDequeue) return

  dispatch({
    type: TIMELINE_DEQUEUE,
    timeline,
  })
}

/**
 * 
 */
export const deleteFromTimelines = (id) => (dispatch, getState) => {
  const accountId = getState().getIn(['statuses', id, 'account'])
  const references = getState().get('statuses').filter(status => status.get('reblog') === id).map(status => [status.get('id'), status.get('account')])
  const reblogOf = getState().getIn(['statuses', id, 'reblog'], null)

  dispatch({
    type: TIMELINE_DELETE,
    id,
    accountId,
    references,
    reblogOf,
  })
}

/**
 * 
 */
export const clearTimeline = (timeline) => (dispatch) => {
  dispatch({
    type: TIMELINE_CLEAR,
    timeline
  })
}

/**
 * 
 */
export const expandTimeline = (timelineId, path, params = {}, done = noop, requiresAuth) => (dispatch, getState) => {
  const timeline = getState().getIn(['timelines', timelineId], ImmutableMap())
  const isLoadingMore = !!params.max_id

  if (!!timeline && (timeline.get('isLoading') || timeline.get('isError'))) {
    done()
    return
  }

  if (!params.max_id && !params.pinned && timeline.get('items', ImmutableList()).size > 0) {
    params.since_id = timeline.getIn(['items', 0])
  }

  const isLoadingRecent = !!params.since_id

  dispatch(expandTimelineRequest(timelineId, isLoadingMore))
  if (requiresAuth && !me) {
    return dispatch(expandTimelineFail(timelineId, true, false))    
  }

  api(getState).get(path, { params }).then((response) => {
    const next = getLinks(response).refs.find(link => link.rel === 'next')
    dispatch(importFetchedStatuses(response.data))
    dispatch(expandTimelineSuccess(timelineId, response.data, next ? next.uri : null, response.code === 206, isLoadingRecent, isLoadingMore))
    done()
  }).catch((error) => {
    dispatch(expandTimelineFail(timelineId, error, isLoadingMore))
    done()
  })
}

const expandTimelineRequest = (timeline, isLoadingMore) => ({
  type: TIMELINE_EXPAND_REQUEST,
  timeline,
  skipLoading: !isLoadingMore,
})

const expandTimelineSuccess = (timeline, statuses, next, partial, isLoadingRecent, isLoadingMore) => ({
  type: TIMELINE_EXPAND_SUCCESS,
  timeline,
  statuses,
  next,
  partial,
  isLoadingRecent,
  skipLoading: !isLoadingMore,
})

const expandTimelineFail = (timeline, error, isLoadingMore) => ({
  type: TIMELINE_EXPAND_FAIL,
  timeline,
  error,
  skipLoading: !isLoadingMore,
})

/**
 * 
 */
export const scrollTopTimeline = (timeline, top) => ({
  type: TIMELINE_SCROLL_TOP,
  timeline,
  top,
})

/**
 * 
 */
export const connectTimeline = (timeline) => ({
  type: TIMELINE_CONNECT,
  timeline,
})

/**
 * 
 */
export const disconnectTimeline = (timeline) => ({
  type: TIMELINE_DISCONNECT,
  timeline,
})

/**
 * 
 */
export const expandHomeTimeline = ({ maxId } = {}, done = noop) => {
  return expandTimeline('home', '/api/v1/timelines/home', {
    max_id: maxId,
  }, done, true)
}

/**
 * 
 */
export const expandExploreTimeline = ({ maxId, sortBy, page } = {}, done = noop) => {
  return expandTimeline('explore', '/api/v1/timelines/explore', {
    page,
    max_id: maxId,
    sort_by: sortBy,
  }, done)
}

/**
 * 
 */
export const expandProTimeline = ({ maxId } = {}, done = noop) => {
  return expandTimeline('pro', '/api/v1/timelines/pro', {
    max_id: maxId,
 }, done, true)
}

/**
 * 
 */
export const expandAccountTimeline = (accountId, { maxId, withReplies, commentsOnly } = {}) => {
  if (!accountId) return noop
  
  let key = `account:${accountId}${withReplies ? ':with_replies' : ''}${commentsOnly ? ':comments_only' : ''}`
  return expandTimeline(key, `/api/v1/accounts/${accountId}/statuses`, {
    only_comments: commentsOnly,
    exclude_replies: (!withReplies && !commentsOnly),
    max_id: maxId,
  })
}

/**
 * 
 */
export const expandAccountFeaturedTimeline = (accountId) => {
  if (!accountId) return noop

  return expandTimeline(`account:${accountId}:pinned`, `/api/v1/accounts/${accountId}/statuses`, {
    pinned: true,
  })
}

/**
 * 
 */
export const expandAccountMediaTimeline = (accountId, { maxId, limit, mediaType } = {}) => {
  if (!accountId) return noop

  return expandTimeline(`account:${accountId}:media`, `/api/v1/accounts/${accountId}/statuses`, {
    max_id: maxId,
    only_media: true,
    limit: limit || 20,
    media_type: mediaType
  }, noop, true)
}

/**
 * 
 */
export const expandListTimeline = (id, { maxId } = {}, done = noop) => {
  if (!id) return noop

  return expandTimeline(`list:${id}`, `/api/v1/timelines/list/${id}`, {
    max_id: maxId,
  }, done, true)
}

/**
 * 
 */
export const expandGroupTimeline = (id, { sortBy, maxId, onlyMedia, page } = {}, done = noop) => {
  if (!id) return noop

  return expandTimeline(`group:${id}`, `/api/v1/timelines/group/${id}`, {
    page,
    sort_by: sortBy,
    max_id: maxId,
    only_media: onlyMedia
  }, done, true)
}

/**
 * 
 */
export const expandGroupFeaturedTimeline = (groupId, done = noop) => {
  if (!groupId) return noop

  return expandTimeline(`group:${groupId}:pinned`, `/api/v1/timelines/group_pins/${groupId}`, {}, done, true)
}

/**
 * 
 */
export const expandGroupCollectionTimeline = (collectionType, { sortBy, maxId, page } = {}, done = noop) => {
  if (!collectionType) return noop

  return expandTimeline(`group_collection:${collectionType}`, `/api/v1/timelines/group_collection/${collectionType}`, {
    page,
    sort_by: sortBy,
    max_id: maxId,
  }, done, true)
}

/**
 * 
 */
export const expandLinkTimeline = (linkId, { maxId } = {}, done = noop) => {
  if (!linkId) return noop

  return expandTimeline(`link:${linkId}`, `/api/v1/timelines/preview_card/${linkId}`, {
    max_id: maxId,
  }, done, true)
}

/**
 * 
 */
export const expandHashtagTimeline = (hashtag, { maxId } = {}, done = noop) => {
  if (!hashtag) return noop

  return expandTimeline(`hashtag:${hashtag}`, `/api/v1/timelines/tag/${hashtag}`, {
    max_id: maxId,
  }, done, true)
}
