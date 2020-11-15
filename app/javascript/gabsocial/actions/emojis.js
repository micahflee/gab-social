import { saveSettings } from './settings'

export const EMOJI_USE = 'EMOJI_USE'

export const useEmoji = (emoji) => (dispatch) => {
  dispatch({
    type: EMOJI_USE,
    emoji,
  });

  dispatch(saveSettings())
}
