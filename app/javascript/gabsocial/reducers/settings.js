import { SETTING_CHANGE, SETTING_SAVE } from '../actions/settings';
import { NOTIFICATIONS_FILTER_SET } from '../actions/notifications';
import { STORE_HYDRATE } from '../actions/store';
import { EMOJI_USE } from '../actions/emojis';
import { LIST_DELETE_SUCCESS, LIST_FETCH_FAIL } from '../actions/lists';
import { Map as ImmutableMap, fromJS } from 'immutable';
import uuid from '../utils/uuid';

const initialState = ImmutableMap({
  saved: true,

  onboarded: false,

  skinTone: 1,

  home: ImmutableMap({
    shows: ImmutableMap({
      photos: true,
      polls: true,
      reply: true,
      repost: true,
      videos: true,
    }),
  }),

  lists: ImmutableMap({
    shows: ImmutableMap({
      photos: true,
      polls: true,
      reply: true,
      repost: true,
      videos: true,
    }),
  }),

  groups: ImmutableMap({
    shows: ImmutableMap({
      photos: true,
      polls: true,
      reply: true,
      repost: true,
      videos: true,
    }),
  }),

  notifications: ImmutableMap({
    // : todo : put all notification settings actually IN settings
    quickFilter: ImmutableMap({
      active: 'all',
    }),
  }),

  community: ImmutableMap({
    shows: ImmutableMap({
      inSidebar: false,
      onlyMedia: false,
    }),
  }),
});

const defaultColumns = fromJS([
  { id: 'COMPOSE', uuid: uuid(), params: {} },
  { id: 'HOME', uuid: uuid(), params: {} },
  { id: 'NOTIFICATIONS', uuid: uuid(), params: {} },
]);

const hydrate = (state, settings) => state.mergeDeep(settings).update('columns', (val = defaultColumns) => val);

const updateFrequentEmojis = (state, emoji) => state.update('frequentlyUsedEmojis', ImmutableMap(), map => map.update(emoji.id, 0, count => count + 1)).set('saved', false);

const filterDeadListColumns = (state, listId) => state.update('columns', columns => columns.filterNot(column => column.get('id') === 'LIST' && column.get('params').get('id') === listId));

export default function settings(state = initialState, action) {
  switch(action.type) {
  case STORE_HYDRATE:
    return hydrate(state, action.state.get('settings'));
  case NOTIFICATIONS_FILTER_SET:
  case SETTING_CHANGE:
    return state
      .setIn(action.path, action.value)
      .set('saved', false);
  case EMOJI_USE:
    return updateFrequentEmojis(state, action.emoji);
  case SETTING_SAVE:
    return state.set('saved', true);
  case LIST_FETCH_FAIL:
    return action.error.response.status === 404 ? filterDeadListColumns(state, action.id) : state;
  case LIST_DELETE_SUCCESS:
    return filterDeadListColumns(state, action.id);
  default:
    return state;
  }
};
