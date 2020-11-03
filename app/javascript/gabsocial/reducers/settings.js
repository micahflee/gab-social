import { SETTING_CHANGE, SETTING_SAVE } from '../actions/settings'
import { STORE_HYDRATE } from '../actions/store'
import { EMOJI_USE } from '../actions/emojis'
import { LIST_DELETE_SUCCESS, LIST_FETCH_FAIL } from '../actions/lists'
import { TIMELINE_INJECTION_HIDE } from '../actions/timeline_injections'
import {
  COMMENT_SORTING_TYPE_OLDEST,
  TIMELINE_INJECTION_WEIGHT_DEFAULT,
  TIMELINE_INJECTION_FEATURED_GROUPS,
  TIMELINE_INJECTION_GROUP_CATEGORIES,
  TIMELINE_INJECTION_PROGRESS,
  TIMELINE_INJECTION_PRO_UPGRADE,
  TIMELINE_INJECTION_PWA,
  TIMELINE_INJECTION_SHOP,
  TIMELINE_INJECTION_USER_SUGGESTIONS,
} from '../constants'
import { Map as ImmutableMap, fromJS } from 'immutable'
import uuid from '../utils/uuid'

const initialState = ImmutableMap({
  saved: true,
  shownOnboarding: false,
  skinTone: 1,
  commentSorting: COMMENT_SORTING_TYPE_OLDEST,

  // every dismiss reduces by half or set to zero for pwa, shop, pro
  injections: ImmutableMap({
    [TIMELINE_INJECTION_FEATURED_GROUPS]: TIMELINE_INJECTION_WEIGHT_DEFAULT,
    [TIMELINE_INJECTION_GROUP_CATEGORIES]: TIMELINE_INJECTION_WEIGHT_DEFAULT,
    [TIMELINE_INJECTION_PROGRESS]: TIMELINE_INJECTION_WEIGHT_DEFAULT,
    [TIMELINE_INJECTION_PRO_UPGRADE]: TIMELINE_INJECTION_WEIGHT_DEFAULT,
    [TIMELINE_INJECTION_PWA]: TIMELINE_INJECTION_WEIGHT_DEFAULT,
    [TIMELINE_INJECTION_SHOP]: TIMELINE_INJECTION_WEIGHT_DEFAULT,
    [TIMELINE_INJECTION_USER_SUGGESTIONS]: TIMELINE_INJECTION_WEIGHT_DEFAULT,
  }),

  displayOptions: ImmutableMap({
    fontSize: 'normal',
    radiusSmallDisabled: false,
    radiusCircleDisabled: false,
    logoDisabled: false,
    theme: 'light',
  }),

  home: ImmutableMap({
    shows: ImmutableMap({
      reply: true,
      repost: true,
    }),
  }),

  community: ImmutableMap({
    shows: ImmutableMap({
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
