import isObject from 'lodash.isobject'
import { showToast } from '../actions/toasts'
import {
  TOAST_TYPE_ERROR,
  TOAST_TYPE_SUCCESS,
} from '../constants'

const defaultSuccessSuffix = 'SUCCESS'
const defaultFailSuffix = 'FAIL'

export default function errorsMiddleware() {
  return ({ dispatch }) => (next) => (action) => {
    if (isObject(action) && action.type && action.showToast) {
      const isFail = new RegExp(`${defaultFailSuffix}$`, 'g')
      const isSuccess = new RegExp(`${defaultSuccessSuffix}$`, 'g')


      if (action.type.match(isFail)) {
        dispatch(showToast(TOAST_TYPE_ERROR, action))
      } else if (action.type.match(isSuccess)) {
        dispatch(showToast(TOAST_TYPE_SUCCESS, action))
      } 
    }

    return next(action)
  }
}
