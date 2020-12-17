import {
  FAVORITED_STATUSES_FETCH_REQUEST,
  FAVORITED_STATUSES_FETCH_SUCCESS,
  FAVORITED_STATUSES_FETCH_FAIL,
  FAVORITED_STATUSES_EXPAND_REQUEST,
  FAVORITED_STATUSES_EXPAND_SUCCESS,
  FAVORITED_STATUSES_EXPAND_FAIL,
} from '../actions/favorites';
import {
  BOOKMARKED_STATUSES_FETCH_REQUEST,
  BOOKMARKED_STATUSES_FETCH_SUCCESS,
  BOOKMARKED_STATUSES_FETCH_FAIL,
  BOOKMARKED_STATUSES_EXPAND_REQUEST,
  BOOKMARKED_STATUSES_EXPAND_SUCCESS,
  BOOKMARKED_STATUSES_EXPAND_FAIL,
} from '../actions/bookmarks'
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

const initialMap = ImmutableMap({
  next: null,
  loaded: false,
  isLoading: false,
  items: ImmutableList(),
})

const initialState = ImmutableMap({
  bookmarks: ImmutableMap(),
  favorites: initialMap,
});

const normalizeList = (state, listType, statuses, next) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('loaded', true);
    map.set('isLoading', false);
    map.set('items', ImmutableList(statuses.map(item => item.id)));
  }));
};

const appendToList = (state, listType, statuses, next) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('isLoading', false);
    map.set('items', map.get('items').concat(statuses.map(item => item.id)));
  }));
};

const prependOneToList = (state, listType, status) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('items', map.get('items').unshift(status.get('id')));
  }));
};

const removeOneFromList = (state, listType, status) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('items', map.get('items').filter(item => item !== status.get('id')));
  }));
};

export default function statusLists(state = initialState, action) {
  switch (action.type) {
  case BOOKMARKED_STATUSES_FETCH_REQUEST:
  case BOOKMARKED_STATUSES_EXPAND_REQUEST:
    return state.updateIn(['bookmarks', action.bookmarkCollectionId], initialMap, map => map.set('isLoading', true))
  case BOOKMARKED_STATUSES_FETCH_FAIL:
  case BOOKMARKED_STATUSES_EXPAND_FAIL:
    return state.setIn(['bookmarks', action.bookmarkCollectionId, 'isLoading'], false);
  case BOOKMARKED_STATUSES_FETCH_SUCCESS:
    console.log("BOOKMARKED_STATUSES_FETCH_SUCCESS:", action)
    try {
      return state.updateIn(['bookmarks', action.bookmarkCollectionId], listMap => listMap.withMutations(map => {
        map.set('next', action.next);
        map.set('loaded', true);
        map.set('isLoading', false);
        map.set('items', ImmutableList(action.statuses.map(item => item.id)));
      })) 
    } catch (error) {
      console.log("error:", state, error)
    }
    return state
  case BOOKMARKED_STATUSES_EXPAND_SUCCESS:
    return state.updateIn(['bookmarks', action.bookmarkCollectionId], listMap => listMap.withMutations(map => {
      map.set('next', action.next);
      map.set('isLoading', false);
      map.set('items', map.get('items').concat(action.statuses.map(item => item.id)));
    }))

  case FAVORITED_STATUSES_FETCH_REQUEST:
  case FAVORITED_STATUSES_EXPAND_REQUEST:
    return state.setIn(['favorites', 'isLoading'], true);
  case FAVORITED_STATUSES_FETCH_FAIL:
  case FAVORITED_STATUSES_EXPAND_FAIL:
    return state.setIn(['favorites', 'isLoading'], false);
  case FAVORITED_STATUSES_FETCH_SUCCESS:
    return normalizeList(state, 'favorites', action.statuses, action.next);
  case FAVORITED_STATUSES_EXPAND_SUCCESS:
    return appendToList(state, 'favorites', action.statuses, action.next);
  default:
    return state;
  }
};
