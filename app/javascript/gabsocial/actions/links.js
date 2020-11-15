import api from '../api'

export const LINK_FETCH_REQUEST = 'LINK_FETCH_REQUEST'
export const LINK_FETCH_SUCCESS = 'LINK_FETCH_SUCCESS'
export const LINK_FETCH_FAIL = 'LINK_FETCH_FAIL'

export const POPULAR_LINKS_FETCH_REQUEST = 'POPULAR_LINKS_FETCH_REQUEST'
export const POPULAR_LINKS_FETCH_SUCCESS = 'POPULAR_LINKS_FETCH_SUCCESS'
export const POPULAR_LINKS_FETCH_FAIL = 'POPULAR_LINKS_FETCH_FAIL'

export const IMPORT_LINK_CARDS = 'IMPORT_LINK_CARDS'

/**
 * 
 */
export const importLinkCards = (cards) => ({
  type: IMPORT_LINK_CARDS,
  cards,
})

/**
 * 
 */
export const fetchLinkCard = (cardId) => (dispatch, getState) => {
  //If card exists, don't refetch
  const card = getState().getIn(['links', 'items', `${cardId}`])
  if (!!card) return

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

/**
 * 
 */
export const fetchPopularLinks = () => (dispatch, getState) => {
  const isFetched = getState().getIn(['links', 'popular', 'isFetched'], false)
  if (isFetched) return

  dispatch(fetchPopularLinksRequest())

  api(getState).get(`/api/v1/popular_links?type=links`).then(({ data }) => {
    dispatch(fetchPopularLinksSuccess(data))
  })
  .catch((err) => dispatch(fetchPopularLinksFail(err)))
}

const fetchPopularLinksRequest = () => ({
  type: POPULAR_LINKS_FETCH_REQUEST,
})

const fetchPopularLinksSuccess = (cards) => ({
  type: POPULAR_LINKS_FETCH_SUCCESS,
  cards,
})

const fetchPopularLinksFail = (error) => ({
  type: POPULAR_LINKS_FETCH_FAIL,
  error,
})
