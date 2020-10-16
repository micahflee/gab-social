import {
  SAVE_USER_PROFILE_INFORMATION_FETCH_REQUEST,
  SAVE_USER_PROFILE_INFORMATION_FETCH_SUCCESS,
  SAVE_USER_PROFILE_INFORMATION_FETCH_FAIL,
  RESEND_USER_CONFIRMATION_EMAIL_SUCCESS,
} from '../actions/user'
import { Map as ImmutableMap } from 'immutable'

const initialState = ImmutableMap({
  isLoading: false,
  isError: false,
  emailConfirmationResends: 0,
})

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_USER_PROFILE_INFORMATION_FETCH_REQUEST:
      return state.set('isLoading', true)
    case SAVE_USER_PROFILE_INFORMATION_FETCH_SUCCESS:
      return state
    case SAVE_USER_PROFILE_INFORMATION_FETCH_FAIL:
      return state.set('isError', true)
    case RESEND_USER_CONFIRMATION_EMAIL_SUCCESS:
      return state.set('emailConfirmationResends', state.get('emailConfirmationResends') + 1)
    default:
      return state
  }
}