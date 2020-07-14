import moment from 'moment-mini'
import { changeSetting, saveSettings } from './settings'

export const MIN_ACCOUNT_CREATED_AT_ONBOARDING = moment('2020-07-14').valueOf()

export const saveShownOnboarding = () => (dispatch) => {
  dispatch(changeSetting(['shownOnboarding'], true))
  dispatch(saveSettings())
}