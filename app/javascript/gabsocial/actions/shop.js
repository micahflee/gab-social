
import axios from 'axios'
import api from '../api'
import { me } from '../initial_state'

export const SHOP_FEATURED_PRODUCTS_FETCH_REQUEST = 'SHOP_FEATURED_PRODUCTS_FETCH_REQUEST'
export const SHOP_FEATURED_PRODUCTS_FETCH_SUCCESS = 'SHOP_FEATURED_PRODUCTS_FETCH_SUCCESS'
export const SHOP_FEATURED_PRODUCTS_FETCH_FAIL = 'SHOP_FEATURED_PRODUCTS_FETCH_FAIL'

/**
 * 
 */
export const fetchFeaturedProducts = () => (dispatch, getState) => {
  if (!me) return

  dispatch(fetchFeaturedProductsRequest('featured'))

  axios.get('https://dissenter-shop.gab.com/product/group/json').then((response) => {
    try {
      dispatch(fetchFeaturedProductsSuccess(response.data.data, 'featured'))        
    } catch (error) {
      //
    }
  }).catch((error) => {
    dispatch(fetchFeaturedProductsFail(error, 'featured'))
  })
}

const fetchFeaturedProductsRequest = (listType) => ({
  type: SHOP_FEATURED_PRODUCTS_FETCH_REQUEST,
  listType,
})

const fetchFeaturedProductsSuccess = (items, listType) => ({
  type: SHOP_FEATURED_PRODUCTS_FETCH_SUCCESS,
  items,
  listType,
})

const fetchFeaturedProductsFail = (error, listType) => ({
  type: SHOP_FEATURED_PRODUCTS_FETCH_FAIL,
  error,
  listType,
})