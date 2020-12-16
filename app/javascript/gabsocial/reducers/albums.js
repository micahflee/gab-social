import {
  BOOKMARK_COLLECTIONS_FETCH_REQUEST,
  BOOKMARK_COLLECTIONS_FETCH_SUCCESS,
  BOOKMARK_COLLECTIONS_FETCH_FAIL,
} from '../actions/bookmarks'
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable'

const initialState = ImmutableMap({
  items: ImmutableList(),
  isLoading: false,
  isFetched: false,
  isError: false,
})

const normalizeBookmarkCollection = (bookmarkCollection) => {
  return {
    id: shortcut.id,
    shortcut_type: 'account',
    shortcut_id: shortcut.shortcut_id,
    title: shortcut.shortcut.acct,
    image: shortcut.shortcut.avatar_static,
    to: `/${shortcut.shortcut.acct}`,
  }
}

const normalizeBookmarkCollections = (shortcuts) => {
  return fromJS(shortcuts.map((shortcut) => {
    return normalizeShortcut(shortcut)
  }))
}

export default function albums(state = initialState, action) {
  switch(action.type) {
    case SHORTCUTS_FETCH_REQUEST:
      return state.withMutations((map) => {
        map.set('isLoading', true)
        map.set('isFetched', false)
        map.set('isError', false)
      })
    case SHORTCUTS_FETCH_SUCCESS:
      return state.withMutations((map) => {
        map.set('items', normalizeShortcuts(action.shortcuts))
        map.set('isLoading', false)
        map.set('isFetched', true)
        map.set('isError', false)
      })
    case SHORTCUTS_FETCH_FAIL:
      return state.withMutations((map) => {
        map.set('isLoading', false)
        map.set('isFetched', true)
        map.set('isError', true)
      })
    case BOOKMARK_COLLECTIONS_CREATE_REQUEST:
      return state.update('items', list => list.push(fromJS(normalizeShortcut(action.shortcut))))
    case BOOKMARK_COLLECTIONS_REMOVE_REQUEST:
      return state.update('items', list => list.filterNot((item) => {
        return `${item.get('id')}` === `${action.shortcutId}`
      }))
    default:
      return state
  }
}
