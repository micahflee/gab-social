import isObject from 'lodash.isobject'
import api from '../api'
import {
  me,
  emailConfirmed,
} from '../initial_state'
import { importFetchedAccount } from './importer'

export const SAVE_USER_PROFILE_INFORMATION_FETCH_REQUEST = 'SAVE_USER_PROFILE_INFORMATION_FETCH_REQUEST'
export const SAVE_USER_PROFILE_INFORMATION_FETCH_SUCCESS = 'SAVE_USER_PROFILE_INFORMATION_FETCH_SUCCESS'
export const SAVE_USER_PROFILE_INFORMATION_FETCH_FAIL = 'SAVE_USER_PROFILE_INFORMATION_FETCH_FAIL'
export const RESEND_USER_CONFIRMATION_EMAIL_SUCCESS = 'RESEND_USER_CONFIRMATION_EMAIL_SUCCESS'

/**
 * 
 */
export const saveUserProfileInformation = (data) => (dispatch, getState) => {
  if (!isObject(data) || !me) return

  dispatch(saveUserProfileInformationRequest())

  const formData = new FormData()
  if (!!data.displayName) formData.append('display_name', data.displayName)
  if (data.note !== undefined) formData.append('note', data.note)
  if (data.avatar !== undefined) formData.append('avatar', data.avatar)
  if (data.header !== undefined) formData.append('header', data.header)
  if (data.locked !== undefined) formData.append('locked', data.locked)

  api(getState).patch('/api/v1/accounts/update_credentials', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((response) => {
    dispatch(importFetchedAccount(response.data))
    dispatch(saveUserProfileInformationSuccess(response.data))
  }).catch((error) => {
    dispatch(saveUserProfileInformationFail(error))
  })
}

const saveUserProfileInformationRequest = () => ({
  type: SAVE_USER_PROFILE_INFORMATION_FETCH_REQUEST,
})

const saveUserProfileInformationSuccess = (userProfileData) => ({
  type: SAVE_USER_PROFILE_INFORMATION_FETCH_SUCCESS,
  showToast: true,
  userProfileData,
})

const saveUserProfileInformationFail = (error) => ({
  type: SAVE_USER_PROFILE_INFORMATION_FETCH_FAIL,
  showToast: true,
  error,
})

/**
 * 
 */
export const resendUserConfirmationEmail = () => (dispatch, getState) => {
  if (!me || emailConfirmed) return

  api(getState).post('/api/v1/accounts/resend_email_confirmation').then((response) => {
    dispatch({ type: RESEND_USER_CONFIRMATION_EMAIL_SUCCESS })
  })

}