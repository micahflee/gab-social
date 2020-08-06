import {
  TOAST_TYPE_ERROR,
  TOAST_TYPE_SUCCESS,
} from '../constants'

export const TOAST_SHOW = 'TOAST_SHOW'
export const TOAST_DISMISS = 'TOAST_DISMISS'
export const TOAST_CLEAR = 'TOAST_CLEAR'

export function dismissToast(alert) {
  return {
    type: TOAST_DISMISS,
    alert,
  }
}

export function clearToast() {
  return {
    type: TOAST_CLEAR,
  }
}

function showToast(type, message) {
  return {
    type: TOAST_SHOW,
    toastType: type,
    message,
  }
}

export const showToastError = (message) => {
  return showToast(TOAST_TYPE_ERROR, message)
}

export const showToastSucess = (message) => {
  console.log("showToastSucess:", message)
  return showToast(TOAST_TYPE_SUCCESS, message)
}