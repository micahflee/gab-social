export const TOAST_SHOW = 'TOAST_SHOW'
export const TOAST_DISMISS = 'TOAST_DISMISS'
export const TOAST_CLEAR = 'TOAST_CLEAR'

/**
 * 
 */
export const dismissToast = (toastKey) => ({
  type: TOAST_DISMISS,
  toastKey,
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
export const showToast = (toastType, toastData) => ({
  type: TOAST_SHOW,
  toastType,
  toastData,
})
