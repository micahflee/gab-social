import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable'
import { me } from '../initial_state'
import {
  ALBUMS_FETCH_REQUEST,
  ALBUMS_FETCH_SUCCESS,
  ALBUMS_FETCH_FAIL,
  ALBUMS_EXPAND_REQUEST,
  ALBUMS_EXPAND_SUCCESS,
  ALBUMS_EXPAND_FAIL,
} from '../actions/albums'

const initialState = ImmutableMap({})

const setListFailed = (state, id) => {
  return state.setIn([id], ImmutableMap({
    next: null,
    items: ImmutableList(),
    isLoading: false,
  }))
}

const normalizeList = (state, id, albums, next) => {
  return state.setIn([id], ImmutableMap({
    next,
    items: ImmutableList(albums.map(item => item.id)),
    isLoading: false,
  }))
}

const appendToList = (state, id, albums, next) => {
  return state.updateIn([id], (map) => {
    return map
      .set('next', next)
      .set('isLoading', false)
      .update('items', (list) => {
        return list.concat(albums.map(item => item.id))
      })
  })
}

export default function album_lists(state = initialState, action) {
  switch(action.type) {
  case ALBUMS_FETCH_REQUEST:
  case ALBUMS_EXPAND_REQUEST:
    return state.setIn([action.accountId, 'isLoading'], true)
  case ALBUMS_FETCH_SUCCESS:
    console.log("ALBUMS_FETCH_SUCCESS:", action)
    return normalizeList(state, action.accountId, action.albums, action.next)
  case ALBUMS_EXPAND_SUCCESS:
    return appendToList(state, action.accountId, action.albums, action.next)
  case ALBUMS_FETCH_FAIL:
  case ALBUMS_EXPAND_FAIL:
    return setListFailed(state, action.accountId)
  default:
    return state;
  }
};
