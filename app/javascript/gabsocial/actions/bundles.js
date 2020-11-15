export const BUNDLE_FETCH_REQUEST = 'BUNDLE_FETCH_REQUEST'
export const BUNDLE_FETCH_SUCCESS = 'BUNDLE_FETCH_SUCCESS'
export const BUNDLE_FETCH_FAIL = 'BUNDLE_FETCH_FAIL'

export const fetchBundleRequest = (skipLoading) => ({
  type: BUNDLE_FETCH_REQUEST,
  skipLoading,
})

export const fetchBundleSuccess = (skipLoading) => ({
  type: BUNDLE_FETCH_SUCCESS,
  skipLoading,
})

export const fetchBundleFail = (error, skipLoading) => ({
  type: BUNDLE_FETCH_FAIL,
  error,
  skipLoading,
})
