import {
  REPOST_REQUEST,
  UNREPOST_REQUEST,
  REPOST_FAIL,
  FAVORITE_REQUEST,
  FAVORITE_FAIL,
  UNFAVORITE_REQUEST,
} from '../actions/interactions';
import {
  STATUS_REVEAL,
  STATUS_HIDE,
  UPDATE_STATUS_STATS,
} from '../actions/statuses';
import { TIMELINE_DELETE } from '../actions/timelines';
import { STATUS_IMPORT, STATUSES_IMPORT } from '../actions/importer';
import { Map as ImmutableMap, fromJS } from 'immutable';

const importStatus = (state, status) => state.set(status.id, fromJS(status));

const importStatuses = (state, statuses) =>
  state.withMutations(mutable => statuses.forEach(status => importStatus(mutable, status)));

const deleteStatus = (state, id, references) => {
  references.forEach(ref => {
    state = deleteStatus(state, ref[0], []);
  });

  return state.delete(id);
};

const initialState = ImmutableMap();

export default function statuses(state = initialState, action) {
  switch(action.type) {
  case STATUS_IMPORT:
    return importStatus(state, action.status);
  case STATUSES_IMPORT:
    return importStatuses(state, action.statuses);
  case FAVORITE_REQUEST:
    return state.setIn([action.status.get('id'), 'favourited'], true);
  case FAVORITE_FAIL:
    return state.get(action.status.get('id')) === undefined ? state : state.setIn([action.status.get('id'), 'favourited'], false);
  case UNFAVORITE_REQUEST:
    return state.setIn([action.status.get('id'), 'favourited'], false);
  case REPOST_REQUEST:
    return state.setIn([action.status.get('id'), 'reblogged'], true);
  case UNREPOST_REQUEST:
    return state.setIn([action.status.get('id'), 'reblogged'], false);
  case REPOST_FAIL:
    return state.get(action.status.get('id')) === undefined ? state : state.setIn([action.status.get('id'), 'reblogged'], false);
  case STATUS_REVEAL:
    return state.withMutations((map) => {
      action.ids.forEach(id => {
        if (!(state.get(id) === undefined)) {
          map.setIn([id, 'hidden'], false);
        }
      });
    });
  case STATUS_HIDE:
    return state.withMutations((map) => {
      action.ids.forEach(id => {
        if (!(state.get(id) === undefined)) {
          map.setIn([id, 'hidden'], true);
        }
      });
    });
  case TIMELINE_DELETE:
    return deleteStatus(state, action.id, action.references);
  case UPDATE_STATUS_STATS:
    const { status_id } = action.data
    return state.withMutations((map) => {
      if (action.data.favourited !== undefined) map.setIn([status_id, 'favourited'], action.data.favourited)
      if (action.data.favourites_count !== undefined) map.setIn([status_id, 'favourites_count'], action.data.favourites_count)
      if (action.data.reblogged !== undefined) map.setIn([status_id, 'reblogged'], action.data.reblogged)
      if (action.data.reblogs_count !== undefined) map.setIn([status_id, 'reblogs_count'], action.data.reblogs_count)
      if (action.data.replies_count !== undefined) map.setIn([status_id, 'replies_count'], action.data.replies_count)
      if (action.data.pinned !== undefined) map.setIn([status_id, 'pinned'], action.data.pinned)
      if (action.data.pinned_by_group !== undefined) map.setIn([status_id, 'pinned_by_group'], action.data.pinned_by_group)
      if (action.data.bookmarked !== undefined) map.setIn([status_id, 'bookmarked'], action.data.bookmarked)
    })
  default:
    return state;
  }
};
