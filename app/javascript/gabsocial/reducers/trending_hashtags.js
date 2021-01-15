import { Map as ImmutableMap } from 'immutable'
import {
  TRENDING_HASHTAGS_FETCH_REQUEST,
  TRENDING_HASHTAGS_FETCH_SUCCESS,
  TRENDING_HASHTAGS_FETCH_FAIL,
} from '../actions/trending_hashtags'

const initialState = ImmutableMap({
  fetched: false,
  items: []
})

export default function trending_hashtags(state = initialState, action) {
  switch (action.type) {
  case TRENDING_HASHTAGS_FETCH_FAIL:
    return state.set('fetched', true).set('items', [])
  case TRENDING_HASHTAGS_FETCH_SUCCESS:
    return state.set('fetched', true).set('items', action.hashtags)
  default:
    return state
  }
}
