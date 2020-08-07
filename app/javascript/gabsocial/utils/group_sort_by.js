import { GROUP_TIMELINE_SORTING_TYPE_TOP } from '../constants'

export default function getSortBy(sortByValue, sortByTopValue) {
  return sortByValue === GROUP_TIMELINE_SORTING_TYPE_TOP ? `${sortByValue}_${sortByTopValue}` : sortByValue
}
