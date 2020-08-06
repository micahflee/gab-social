import api from '../api'
import { me } from '../initial_state'

export const GROUP_CREATE_REQUEST = 'GROUP_CREATE_REQUEST'
export const GROUP_CREATE_SUCCESS = 'GROUP_CREATE_SUCCESS'
export const GROUP_CREATE_FAIL = 'GROUP_CREATE_FAIL'

export const GROUP_UPDATE_REQUEST = 'GROUP_UPDATE_REQUEST'
export const GROUP_UPDATE_SUCCESS = 'GROUP_UPDATE_SUCCESS'
export const GROUP_UPDATE_FAIL = 'GROUP_UPDATE_FAIL'

export const GROUP_EDITOR_TITLE_CHANGE = 'GROUP_EDITOR_TITLE_CHANGE'
export const GROUP_EDITOR_DESCRIPTION_CHANGE = 'GROUP_EDITOR_DESCRIPTION_CHANGE'
export const GROUP_EDITOR_COVER_IMAGE_CHANGE = 'GROUP_EDITOR_COVER_IMAGE_CHANGE'
export const GROUP_EDITOR_ID_CHANGE = 'GROUP_EDITOR_ID_CHANGE'
export const GROUP_EDITOR_TAGS_CHANGE = 'GROUP_EDITOR_TAGS_CHANGE'
export const GROUP_EDITOR_CATEGORY_CHANGE = 'GROUP_EDITOR_CATEGORY_CHANGE'
export const GROUP_EDITOR_IS_PRIVATE_CHANGE = 'GROUP_EDITOR_IS_PRIVATE_CHANGE'
export const GROUP_EDITOR_IS_VISIBLE_CHANGE = 'GROUP_EDITOR_IS_VISIBLE_CHANGE'

export const GROUP_EDITOR_RESET = 'GROUP_EDITOR_RESET'
export const GROUP_EDITOR_SETUP = 'GROUP_EDITOR_SETUP'

export const submit = (routerHistory) => (dispatch, getState) => {
	if (!me) return

	const groupId = getState().getIn(['group_editor', 'groupId'])
	const title = getState().getIn(['group_editor', 'title'])
	const description = getState().getIn(['group_editor', 'description'])
	const coverImage = getState().getIn(['group_editor', 'coverImage'])
	let tags = getState().getIn(['group_editor', 'tags'], '')
	tags = `${tags}`.split(',').map((t) => t.trim())
	const category = getState().getIn(['group_editor', 'category'])
	const isPrivate = getState().getIn(['group_editor', 'isPrivate'])
	const isVisible = getState().getIn(['group_editor', 'isVisible'])
	const slug = getState().getIn(['group_editor', 'id'])

	const options = {
		title,
		description,
		coverImage,
		tags,
		category,
		isPrivate,
		isVisible,
		slug,
	}

	if (groupId === null) {
		dispatch(create(options, routerHistory))
	} else {
		dispatch(update(groupId, options, routerHistory))
	}
}

const create = (options, routerHistory) => (dispatch, getState) => {
	if (!me) return

	dispatch(createRequest())

	const formData = new FormData()
	formData.append('title', options.title)
	formData.append('description', options.description)
	formData.append('tags', options.tags)
	formData.append('group_categories_id', options.category)
	formData.append('is_private', options.isPrivate)
	formData.append('is_visible', options.isVisible)

	if (options.coverImage !== null) {
		formData.append('cover_image', options.coverImage)
	}

	api(getState).post('/api/v1/groups', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	}).then(({ data }) => {
		dispatch(createSuccess(data))
		routerHistory.push(`/groups/${data.id}`)
	}).catch(err => dispatch(createFail(err)))
}


export const createRequest = (id) => ({
	type: GROUP_CREATE_REQUEST,
	id,
})

export const createSuccess = (group) => ({
	type: GROUP_CREATE_SUCCESS,
	group,
})

export const createFail = (error) => ({
	type: GROUP_CREATE_FAIL,
	error,
})

const update = (groupId, options, routerHistory) => (dispatch, getState) => {
	if (!me) return

	dispatch(updateRequest())

	const formData = new FormData()
	formData.append('title', options.title)
	formData.append('description', options.description)
	formData.append('tags', options.tags)
	formData.append('group_categories_id', options.category)
	formData.append('is_private', options.isPrivate)
	formData.append('is_visible', options.isVisible)
	formData.append('slug', options.slug)

	if (options.coverImage !== null) {
		formData.append('cover_image', options.coverImage)
	}

	api(getState).put(`/api/v1/groups/${groupId}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	}).then(({ data }) => {
		dispatch(updateSuccess(data))
		routerHistory.push(`/groups/${data.id}`)
	}).catch(err => dispatch(updateFail(err)))
}

export const updateRequest = (id) => ({
	type: GROUP_UPDATE_REQUEST,
	id,
})

export const updateSuccess = (group) => ({
	type: GROUP_UPDATE_SUCCESS,
	group,
})

export const updateFail = (error) => ({
	type: GROUP_UPDATE_FAIL,
	error,
})

export const resetEditor = () => ({
	type: GROUP_EDITOR_RESET
})

export const setGroup = (group) => ({
	type: GROUP_EDITOR_SETUP,
	group,
})

export const changeGroupTitle = (title) => ({
	type: GROUP_EDITOR_TITLE_CHANGE,
	title,
})

export const changeGroupDescription = (description) => ({
	type: GROUP_EDITOR_DESCRIPTION_CHANGE,
	description,
})

export const changeGroupId = (idValue) => ({
	type: GROUP_EDITOR_ID_CHANGE,
	idValue,
})

export const changeGroupTags = (tags) => ({
	type: GROUP_EDITOR_TAGS_CHANGE,
	tags,
})

export const changeGroupCategory = (category) => ({
	type: GROUP_EDITOR_CATEGORY_CHANGE,
	category,
})

export const changeGroupIsPrivate = (isPrivate) => ({
	type: GROUP_EDITOR_IS_PRIVATE_CHANGE,
	isPrivate,
})

export const changeGroupIsVisible = (isVisible) => ({
	type: GROUP_EDITOR_IS_VISIBLE_CHANGE,
	isVisible,
})

export const changeGroupCoverImage = (imageData) => ({
	type: GROUP_EDITOR_COVER_IMAGE_CHANGE,
	value: imageData,
})