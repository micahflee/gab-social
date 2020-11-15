export const HEIGHT_CACHE_SET = 'HEIGHT_CACHE_SET'
export const HEIGHT_CACHE_CLEAR = 'HEIGHT_CACHE_CLEAR'

export const setHeight = (key, id, height) => ({
  type: HEIGHT_CACHE_SET,
  key,
  id,
  height,
})

export const clearHeight = () => ({
  type: HEIGHT_CACHE_CLEAR,
})
