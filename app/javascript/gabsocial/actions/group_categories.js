import api from '../api'

export const GROUP_CATEGORIES_FETCH_REQUEST = 'GROUP_CATEGORIES_FETCH_REQUEST'
export const GROUP_CATEGORIES_FETCH_SUCCESS = 'GROUP_CATEGORIES_FETCH_SUCCESS'
export const GROUP_CATEGORIES_FETCH_FAIL = 'GROUP_CATEGORIES_FETCH_FAIL'

/**
 * 
 */
export const fetchGroupCategories = () => (dispatch, getState) => {
  dispatch(fetchGroupCategoriesRequest())

  api(getState).get('/api/v1/group_categories')
    .then(({ data }) => dispatch(fetchGroupCategoriesSuccess(data)))
    .catch(err => dispatch(fetchGroupCategoriesFail(err)))
}

const fetchGroupCategoriesRequest = () => ({
  type: GROUP_CATEGORIES_FETCH_REQUEST,
})

const fetchGroupCategoriesSuccess = (categories) => ({
  type: GROUP_CATEGORIES_FETCH_SUCCESS,
  categories,
})

const fetchGroupCategoriesFail = (error) => ({
  type: GROUP_CATEGORIES_FETCH_FAIL,
  showToast: true,
  error,
})