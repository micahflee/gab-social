import { me } from '../initial_state'

export const DECK_CONNECT = 'DECK_CONNECT'
export const DECK_DISCONNECT = 'DECK_DISCONNECT'

export const DECK_SET_COLUMN_AT_INDEX = 'DECK_SET_COLUMN_AT_INDEX'

export const deckConnect = () => ({
  type: DECK_CONNECT,
})

export const deckDisconnect = () => ({
  type: DECK_DISCONNECT,
})

export const setDeckColumnAtIndex = (column, index) => ({
  type: DECK_SET_COLUMN_AT_INDEX,
  column,
  index,
})
