import { me } from '../initial_state'
import { saveSettings } from './settings'

export const DECK_CONNECT = 'DECK_CONNECT'
export const DECK_DISCONNECT = 'DECK_DISCONNECT'

export const DECK_SET_COLUMN_AT_INDEX = 'DECK_SET_COLUMN_AT_INDEX'
export const DECK_DELETE_COLUMN_AT_INDEX = 'DECK_DELETE_COLUMN_AT_INDEX'
export const DECK_CHANGE_COLUMN_AT_INDEX = 'DECK_CHANGE_COLUMN_AT_INDEX'

export const deckConnect = () => ({
  type: DECK_CONNECT,
})

export const deckDisconnect = () => ({
  type: DECK_DISCONNECT,
})

export const setDeckColumnAtIndex = (column, index) => (dispatch) => {
  dispatch({
    type: DECK_SET_COLUMN_AT_INDEX,
    column,
    index,
  })
  dispatch(saveSettings())
}

export const deleteDeckColumnAtIndex = (index) => (dispatch) => {
  dispatch({
    type: DECK_DELETE_COLUMN_AT_INDEX,
    index,
  })
  dispatch(saveSettings())
}

export const updateDeckColumnAtIndex = (oldIndex, newIndex) => (dispatch) => {
  dispatch({
    type: DECK_CHANGE_COLUMN_AT_INDEX,
    oldIndex,
    newIndex,
  })
  dispatch(saveSettings())
}
