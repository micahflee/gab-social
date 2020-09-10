import {
  GAB_TRENDS_RESULTS_FETCH_REQUEST,
  GAB_TRENDS_RESULTS_FETCH_SUCCESS,
  GAB_TRENDS_RESULTS_FETCH_FAIL,
  GAB_NEWS_RESULTS_FETCH_REQUEST,
  GAB_NEWS_RESULTS_FETCH_SUCCESS,
  GAB_NEWS_RESULTS_FETCH_FAIL,
} from '../actions/gab'
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable'

const initialState = ImmutableMap({
  feed: ImmutableMap({
    items: ImmutableList(),
    isLoading: false,
    isError: false,
  }),
  partner: ImmutableMap({
    items: {},
    isLoading: false,
    isError: false,
  }),
  news: ImmutableMap({
    items: {},
    isLoading: false,
    isError: false,
  }),
})

const normalizeList = (state, type, items) => {
  return state.set(type, ImmutableMap({
    items: fromJS(items),
    isLoading: false,
    isError: false,
  }))
}

const setListFailed = (state, type) => {
  return state.set(type, ImmutableMap({
    items: ImmutableList(),
    isLoading: false,
    isError: true,
  }))
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GAB_TRENDS_RESULTS_FETCH_REQUEST:
      return state.setIn([action.feedType, 'isLoading'], true);
    case GAB_TRENDS_RESULTS_FETCH_SUCCESS:
      if (action.feedType === 'feed') {
        return normalizeList(state, action.feedType, action.items.items)
      } else if (action.feedType === 'partner') {
        return state.set('partner', ImmutableMap({
          items: action.items['trends'] || {},
          isLoading: false,
          isError: false,
        }))
      }

      return state
    case GAB_TRENDS_RESULTS_FETCH_FAIL:
      return setListFailed(state, action.feedType)
    case GAB_NEWS_RESULTS_FETCH_REQUEST:
      return state.setIn(['news', 'isLoading'], true);
    case GAB_NEWS_RESULTS_FETCH_SUCCESS:
      return normalizeList(state, 'news', action.items)
    case GAB_NEWS_RESULTS_FETCH_FAIL:
      return setListFailed(state, 'news')
    default:
      return state
  }
}