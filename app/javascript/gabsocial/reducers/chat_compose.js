import {
  MESSAGE_INPUT_CHANGE,
  MESSAGE_INPUT_RESET,
  MESSAGE_SEND_REQUEST,
  MESSAGE_SEND_SUCCESS,
  MESSAGE_SEND_FAIL,
  MESSAGE_DELETE_REQUEST,
  MESSAGE_DELETE_SUCCESS,
  MESSAGE_DELETE_FAIL,
} from '../actions/lists'
import { Map as ImmutableMap, fromJS } from 'immutable'

const initialState = ImmutableMap({
  text: '',
  conversationId: null,
  idempotencyKey: null,
})

const normalizeList = (state, list) => state.set(list.id, fromJS(list))

const normalizeLists = (state, lists) => {
  lists.forEach(list => {
    state = normalizeList(state, list)
  })

  return state
}

export default function lists(state = initialState, action) {
  switch(action.type) {
  case LIST_FETCH_SUCCESS:
  case LIST_CREATE_SUCCESS:
  case LIST_UPDATE_SUCCESS:
    return normalizeList(state, action.list);
  case LISTS_FETCH_SUCCESS:
    return normalizeLists(state, action.lists);
  case LIST_DELETE_SUCCESS:
  case LIST_FETCH_FAIL:
    return state.set(action.id, false);
  default:
    return state;
  }
}
