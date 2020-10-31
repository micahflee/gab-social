import api from '../api'

export const LINK_FETCH_REQUEST = 'LINK_FETCH_REQUEST'
export const LINK_FETCH_SUCCESS = 'LINK_FETCH_SUCCESS'
export const LINK_FETCH_FAIL = 'LINK_FETCH_FAIL'

export const IMPORT_LINK_CARDS = 'IMPORT_LINK_CARDS'

export const fetchLinkCard = (cardId) => (dispatch, getState) => {
  dispatch(fetchLinkCardRequest(cardId))

  api(getState).get(`/api/v1/links/${cardId}`).then(({ data }) => {
    dispatch(fetchLinkCardSuccess(data))
  })
  .catch((err) => dispatch(fetchLinkCardFail(err)))
}

export const fetchLinkCardRequest = (cardId) => ({
  type: LINK_FETCH_REQUEST,
  cardId,
})

export const fetchLinkCardSuccess = (card) => ({
  type: LINK_FETCH_SUCCESS,
  card,
})

export const fetchLinkCardFail = (error, cardId) => ({
  type: LINK_FETCH_FAIL,
  error,
  cardId,
})

export const importLinkCards = (cards) => ({
  type: IMPORT_LINK_CARDS,
  cards,
})