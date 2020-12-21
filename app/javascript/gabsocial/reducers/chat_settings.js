import { SETTING_CHANGE, SETTING_SAVE } from '../actions/settings'
import {
  CHAT_SETTING_CHANGE,
  CHAT_SETTING_SAVE,
} from '../actions/chat_settings'
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable'
import uuid from '../utils/uuid'

const initialState = ImmutableMap({
  saved: false,
  restrict_non_followers: true,
  show_active: false,
  read_receipts: false,
  sounds: true,
})

export default function chat_settings(state = initialState, action) {
  switch(action.type) {
  case CHAT_SETTING_CHANGE:
    return state.set(action.path, action.checked).set('saved', false)
  default:
    return state
  }
}
