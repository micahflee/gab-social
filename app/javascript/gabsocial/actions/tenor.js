import axios from 'axios'
import { me, tenorkey } from '../initial_state'

export const GIFS_CLEAR_RESULTS = 'GIFS_CLEAR_RESULTS'
export const GIF_SET_SELECTED = 'GIF_SET_SELECTED'
export const GIF_CHANGE_SEARCH_TEXT = 'GIF_CHANGE_SEARCH_TEXT'

export const GIF_RESULTS_FETCH_REQUEST = 'GIF_RESULTS_FETCH_REQUEST'
export const GIF_RESULTS_FETCH_SUCCESS = 'GIF_RESULTS_FETCH_SUCCESS'
export const GIF_RESULTS_FETCH_FAIL = 'GIF_RESULTS_FETCH_FAIL'

export const GIF_CATEGORIES_FETCH_REQUEST = 'GIF_CATEGORIES_FETCH_REQUEST'
export const GIF_CATEGORIES_FETCH_SUCCESS = 'GIF_CATEGORIES_FETCH_SUCCESS'
export const GIF_CATEGORIES_FETCH_FAIL = 'GIF_CATEGORIES_FETCH_FAIL'

export const fetchGifCategories = () => {
  return function (dispatch) {
    if (!me) return

    dispatch(fetchGifCategoriesRequest())

    axios.get(`https://api.tenor.com/v1/categories?media_filter=minimal&limit=30&key=${tenorkey}`)
    .then((response) => {
      console.log("fetchGifCategoriesSuccess:", response)
      dispatch(fetchGifCategoriesSuccess(response.data.tags))
    }).catch(function (error) {
      dispatch(fetchGifCategoriesFail(error))
    })
  }
}

export const fetchGifResults = () => {
  return function (dispatch, getState) {
    if (!me) return

    dispatch(fetchGifResultsRequest())

    const searchText = getState().getIn(['tenor', 'searchText'], '');

    axios.get(`https://api.tenor.com/v1/search?q=${searchText}&media_filter=minimal&limit=30&key=QHFJ0C5EWGBH`)
    .then((response) => {
      console.log("response:", response)
      dispatch(fetchGifResultsSuccess(response.data.results))
    }).catch(function (error) {
      dispatch(fetchGifResultsFail(error))
    })
  }
}

export const clearGifResults = () => ({
  type: GIFS_CLEAR_RESULTS,
})

export const setSelectedGif = (url) => ({
  type: GIF_SET_SELECTED,
  url,
})

export function changeGifSearchText(text) {
  return {
    type: GIF_CHANGE_SEARCH_TEXT,
    text,
  }
}

function fetchGifResultsRequest() {
  return {
    type: GIF_RESULTS_FETCH_REQUEST,
  }
}

function fetchGifResultsSuccess(results) {
  return {
    type: GIF_RESULTS_FETCH_SUCCESS,
    results,
  }
}

function fetchGifResultsFail(error) {
  return {
    type: GIF_RESULTS_FETCH_FAIL,
    error,
  }
}

function fetchGifCategoriesRequest() {
  return {
    type: GIF_CATEGORIES_FETCH_REQUEST,
  }
}

function fetchGifCategoriesSuccess(categories) {
  return {
    type: GIF_CATEGORIES_FETCH_SUCCESS,
    categories,
  }
}

function fetchGifCategoriesFail(error) {
  return {
    type: GIF_CATEGORIES_FETCH_FAIL,
    error,
  }
}
