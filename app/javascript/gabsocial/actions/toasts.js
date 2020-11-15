import {
  TOAST_TYPE_ERROR,
  TOAST_TYPE_SUCCESS,
} from '../constants'

export const TOAST_SHOW = 'TOAST_SHOW'
export const TOAST_DISMISS = 'TOAST_DISMISS'
export const TOAST_CLEAR = 'TOAST_CLEAR'

/**
 * 
 */
export const dismissToast = (alert) => ({
  type: TOAST_DISMISS,
  alert,
})

/**
 * 
 */
export const clearToast = () => ({
  type: TOAST_CLEAR,
})

/**
 * 
 */
export const showToast = (type, message) => ({
  type: TOAST_SHOW,
  toastType: type,
  message,
})

export const showToastError = (message) => {
  return showToast(TOAST_TYPE_ERROR, message)
}

export const showToastSucess = (message) => {
  console.log("showToastSucess:", message)
  return showToast(TOAST_TYPE_SUCCESS, message)
}