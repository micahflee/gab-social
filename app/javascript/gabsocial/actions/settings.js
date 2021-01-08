import api from '../api'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'
import { getWindowDimension } from '../utils/is_mobile'

export const SETTING_CHANGE = 'SETTING_CHANGE'
export const SETTING_SAVE   = 'SETTING_SAVE'

export const WINDOW_DIMENSION_CHANGE = 'WINDOW_DIMENSION_CHANGE'

export const saveWindowDimensions = () => (dispatch) => {
  const { width, height } = getWindowDimension()

  dispatch({
    type: WINDOW_DIMENSION_CHANGE,
    width,
    height,
  })
}

export const saveShownOnboarding = () => (dispatch) => {
  dispatch(changeSetting(['shownOnboarding'], true))
  dispatch(saveSettings())
}

export const changeSetting = (path, value) => (dispatch) => {
  dispatch({
    type: SETTING_CHANGE,
    path,
    value,
  })

  dispatch(saveSettings())
}

/**
 * 
 */
export const saveSettings = () => (dispatch, getState) => {
  debouncedSave(dispatch, getState)
}

const debouncedSave = debounce((dispatch, getState) => {
  if (!me) return

  if (getState().getIn(['settings', 'saved'])) return

  const data = getState().get('settings').filter((_, path) => path !== 'saved').toJS()

  api().put('/api/web/settings', { data })
    .then(() => dispatch({ type: SETTING_SAVE }))
    .catch(() => { /* */ })
}, 350, { trailing: true })
