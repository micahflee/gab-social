import { Map as ImmutableMap } from 'immutable'
import {
  GROUP_CREATE_REQUEST,
  GROUP_CREATE_FAIL,
  GROUP_CREATE_SUCCESS,
  GROUP_UPDATE_REQUEST,
  GROUP_UPDATE_FAIL,
  GROUP_UPDATE_SUCCESS,
  GROUP_EDITOR_RESET,
  GROUP_EDITOR_SETUP,
  GROUP_EDITOR_TITLE_CHANGE,
  GROUP_EDITOR_PASSWORD_CHANGE,
  GROUP_EDITOR_DESCRIPTION_CHANGE,
  GROUP_EDITOR_COVER_IMAGE_CHANGE,
  GROUP_EDITOR_ID_CHANGE,
  GROUP_EDITOR_TAGS_CHANGE,
  GROUP_EDITOR_CATEGORY_CHANGE,
  GROUP_EDITOR_IS_PRIVATE_CHANGE,
  GROUP_EDITOR_IS_VISIBLE_CHANGE,
} from '../actions/group_editor'
import slugify from '../utils/slugify'

const initialState = ImmutableMap({
  groupId: null,
  isSubmitting: false,
  isChanged: false,
  title: '',
  password: '',
  description: '',
  id: '',
  tags: '',
  category: '',
  coverImage: null,
  isPrivate: false,
  isVisible: true,
})

export default function groupEditorReducer(state = initialState, action) {
  switch(action.type) {
  case GROUP_EDITOR_RESET:
    return initialState
  case GROUP_EDITOR_SETUP:
    let tags
    try {
      tags = action.group.get('tags').toJS().join(', ')
    } catch (error) {
      // 
    }

    return state.withMutations((map) => {
      map.set('groupId', action.group.get('id'))
      map.set('title', action.group.get('title'))
      map.set('password', action.group.get('password'))
      map.set('description', action.group.get('description'))
      map.set('tags', tags)
      map.set('isPrivate', action.group.get('is_private'))
      map.set('isVisible', action.group.get('is_visible'))
      map.set('id', action.group.get('slug'))
      map.set('category', action.group.getIn(['group_category', 'id'], null))
      map.set('isSubmitting', false)
    })
  case GROUP_EDITOR_TITLE_CHANGE:
    return state.withMutations((map) => {
      map.set('title', action.title)
      map.set('isChanged', true)
    })
  case GROUP_EDITOR_DESCRIPTION_CHANGE:
    return state.withMutations((map) => {
      map.set('description', action.description)
      map.set('isChanged', true)
    })
  case GROUP_EDITOR_PASSWORD_CHANGE:
    return state.withMutations((map) => {
      map.set('password', action.password)
      map.set('isChanged', true)
    })
  case GROUP_EDITOR_COVER_IMAGE_CHANGE:
    return state.withMutations((map) => {
      map.set('coverImage', action.value)
      map.set('isChanged', true)
    })
  case GROUP_EDITOR_ID_CHANGE:
    return state.withMutations((map) => {
      map.set('id', slugify(action.idValue || ''))
      map.set('isChanged', true)
    })
  case GROUP_EDITOR_TAGS_CHANGE:
    return state.withMutations((map) => {
      map.set('tags', action.tags)
      map.set('isChanged', true)
    })
  case GROUP_EDITOR_CATEGORY_CHANGE:
    return state.withMutations((map) => {
      map.set('category', action.category)
      map.set('isChanged', true)
    })
  case GROUP_EDITOR_IS_PRIVATE_CHANGE:
    return state.withMutations((map) => {
      map.set('isPrivate', action.isPrivate)
      map.set('isChanged', true)
    })
  case GROUP_EDITOR_IS_VISIBLE_CHANGE:
    return state.withMutations((map) => {
      map.set('isVisible', action.isVisible)
      map.set('isChanged', true)
    })
  case GROUP_CREATE_REQUEST:
  case GROUP_UPDATE_REQUEST:
    return state.withMutations((map) => {
      map.set('isSubmitting', true)
      map.set('isChanged', false)
    })
  case GROUP_CREATE_FAIL:
  case GROUP_UPDATE_FAIL:
    return state.set('isSubmitting', false)
  case GROUP_CREATE_SUCCESS:
  case GROUP_UPDATE_SUCCESS:
    return state.withMutations((map) => {
      map.set('isSubmitting', false)
      map.set('groupId', action.group.id)
    })
  default:
    return state
  }
}
