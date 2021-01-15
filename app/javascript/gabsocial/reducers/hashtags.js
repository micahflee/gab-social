import {
  HASHTAG_FETCH_REQUEST,
  HASHTAG_FETCH_SUCCESS,
  HASHTAG_FETCH_FAIL,
} from '../actions/hashtags'
import { Map as ImmutableMap, fromJS } from 'immutable'

const importHashtag = (state, hashtag) => state.set(`${hashtag.name}`.toLowerCase(), fromJS(hashtag))

const initialState = ImmutableMap()

export default function hashtags(state = initialState, action) {
  switch (action.type) {
  case HASHTAG_FETCH_SUCCESS:
    return importHashtag(state, action.hashtag)
  default:
    return state
  }
}
