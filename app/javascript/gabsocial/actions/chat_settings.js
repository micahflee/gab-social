import api from '../api'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'

export const CHAT_SETTING_CHANGE = 'CHAT_SETTING_CHANGE'
export const CHAT_SETTING_SAVE = 'CHAT_SETTING_SAVE'

export const changeChatSetting = (path, checked) => (dispatch) => {
  dispatch({
    type: CHAT_SETTING_CHANGE,
    path,
    checked,
  })

  dispatch(saveChatSettings())
}

/**
 * 
 */
export const saveChatSettings = () => (dispatch, getState) => {
  debouncedChatSettingsSave(dispatch, getState)
}

const debouncedChatSettingsSave = debounce((dispatch, getState) => {
  if (!me) return

  if (getState().getIn(['chat_settings', 'saved'])) return

  const data = getState().get('chat_settings').filter((_, path) => path !== 'saved').toJS()

  api().put('/api/web/chat_settings', { data })
    .then(() => dispatch({ type: CHAT_SETTING_SAVE }))
    .catch(() => { /* */ })
}, 350, { trailing: true })
