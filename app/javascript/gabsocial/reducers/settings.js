import { SETTING_CHANGE, SETTING_SAVE } from '../actions/settings'
import { STORE_HYDRATE } from '../actions/store'
import { EMOJI_USE } from '../actions/emojis'
import { LIST_DELETE_SUCCESS, LIST_FETCH_FAIL } from '../actions/lists'
import { TIMELINE_INJECTION_HIDE } from '../actions/timeline_injections'
import {
  DECK_SET_COLUMN_AT_INDEX,
  DECK_DELETE_COLUMN_AT_INDEX,
  DECK_CHANGE_COLUMN_AT_INDEX,
} from '../actions/deck'
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
  GAB_DECK_MAX_ITEMS,
} from '../constants'
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable'
import uuid from '../utils/uuid'

const initialState = ImmutableMap({
  saved: true,
  shownOnboarding: false,
  skinTone: 1,
  isCompact: false,
  commentSorting: COMMENT_SORTING_TYPE_OLDEST,
  gabDeckOrder: ImmutableList([]),

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
    theme: 'white',
  }),

  // home: ImmutableMap({
  //   shows: ImmutableMap({
  //     reply: true,
  //     repost: true,
  //   }),
  // }),
})

const defaultColumns = fromJS([
  { id: 'COMPOSE', uuid: uuid(), params: {} },
  { id: 'HOME', uuid: uuid(), params: {} },
  { id: 'NOTIFICATIONS', uuid: uuid(), params: {} },
])

const hydrate = (state, settings) => state.mergeDeep(settings).update('columns', (val = defaultColumns) => val)

const updateFrequentEmojis = (state, emoji) => state.update('frequentlyUsedEmojis', ImmutableMap(), map => map.update(emoji.id, 0, count => count + 1)).set('saved', false)

const filterDeadListColumns = (state, listId) => state.update('columns', columns => columns.filterNot(column => column.get('id') === 'LIST' && column.get('params').get('id') === listId))

export default function settings(state = initialState, action) {
  switch(action.type) {
  case STORE_HYDRATE:
    return hydrate(state, action.state.get('settings'))
  case SETTING_CHANGE:
    return state
      .setIn(action.path, action.value)
      .set('saved', false)
  case EMOJI_USE:
    return updateFrequentEmojis(state, action.emoji)
  case SETTING_SAVE:
    return state.set('saved', true)
  case LIST_FETCH_FAIL:
    return action.error.response.status === 404 ? filterDeadListColumns(state, action.id) : state
  case LIST_DELETE_SUCCESS:
    return filterDeadListColumns(state, action.id)
  case DECK_SET_COLUMN_AT_INDEX:
    const sizeOfDeck = state.get('gabDeckOrder', ImmutableList()).size
    const newIndex = Math.min(Math.max(action.index || 0, sizeOfDeck), GAB_DECK_MAX_ITEMS)
    return state.setIn(['gabDeckOrder', newIndex + 1], action.column).set('saved', false)
  case DECK_DELETE_COLUMN_AT_INDEX:
    return state.deleteIn(['gabDeckOrder', action.index])
  case DECK_CHANGE_COLUMN_AT_INDEX:
    return state.update('gabDeckOrder', idsList => idsList.withMutations((list) => {
      let soruce = list.get(action.oldIndex)
      let destination = list.get(action.newIndex)
      return list.set(action.newIndex, soruce).set(action.oldIndex, destination)
    }))
  default:
    return state
  }
}
