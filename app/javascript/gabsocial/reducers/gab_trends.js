import {
  GAB_TRENDS_RESULTS_FETCH_REQUEST,
  GAB_TRENDS_RESULTS_FETCH_SUCCESS,
  GAB_TRENDS_RESULTS_FETCH_FAIL
} from '../actions/gab_trends'
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS
} from 'immutable'

const initialState = ImmutableMap({
  items: ImmutableList(),
  loading: false,
  error: false,
})

export default function (state = initialState, action) {
  switch (action.type) {
    case GAB_TRENDS_RESULTS_FETCH_REQUEST:
      return state.set('loading', true)
    case GAB_TRENDS_RESULTS_FETCH_SUCCESS:
      return state.withMutations(map => {
        map.set('items', fromJS(action.items));
        map.set('error', false);
        map.set('loading', false);
      });
    case GAB_TRENDS_RESULTS_FETCH_FAIL:
      return state.withMutations(map => {
        map.set('error', !!action.error);
        map.set('loading', false);
      });
    default:
      return state
  }
}