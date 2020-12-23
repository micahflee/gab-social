import api from '../api'
import { me } from '../initial_state'

export const GROUP_CREATE_REQUEST = 'GROUP_CREATE_REQUEST'
export const GROUP_CREATE_SUCCESS = 'GROUP_CREATE_SUCCESS'
export const GROUP_CREATE_FAIL = 'GROUP_CREATE_FAIL'

export const GROUP_UPDATE_REQUEST = 'GROUP_UPDATE_REQUEST'
export const GROUP_UPDATE_SUCCESS = 'GROUP_UPDATE_SUCCESS'
export const GROUP_UPDATE_FAIL = 'GROUP_UPDATE_FAIL'

export const GROUP_EDITOR_TITLE_CHANGE = 'GROUP_EDITOR_TITLE_CHANGE'
export const GROUP_EDITOR_PASSWORD_CHANGE = 'GROUP_EDITOR_PASSWORD_CHANGE'
export const GROUP_EDITOR_DESCRIPTION_CHANGE = 'GROUP_EDITOR_DESCRIPTION_CHANGE'
export const GROUP_EDITOR_COVER_IMAGE_CHANGE = 'GROUP_EDITOR_COVER_IMAGE_CHANGE'
export const GROUP_EDITOR_ID_CHANGE = 'GROUP_EDITOR_ID_CHANGE'
export const GROUP_EDITOR_TAGS_CHANGE = 'GROUP_EDITOR_TAGS_CHANGE'
export const GROUP_EDITOR_CATEGORY_CHANGE = 'GROUP_EDITOR_CATEGORY_CHANGE'
export const GROUP_EDITOR_IS_PRIVATE_CHANGE = 'GROUP_EDITOR_IS_PRIVATE_CHANGE'
export const GROUP_EDITOR_IS_VISIBLE_CHANGE = 'GROUP_EDITOR_IS_VISIBLE_CHANGE'

export const GROUP_EDITOR_RESET = 'GROUP_EDITOR_RESET'
export const GROUP_EDITOR_SETUP = 'GROUP_EDITOR_SETUP'

/**
 * 
 */
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
	const slug = getState().getIn(['group_editor', 'id'], null)
	const password = getState().getIn(['group_editor', 'password'], null)

	const options = {
		title,
		password,
		description,
		coverImage,
		tags,
		category,
		isPrivate,
		isVisible,
		slug,
	}

	if (groupId === null) {
		dispatch(createGroup(options, routerHistory))
	} else {
		dispatch(updateGroup(groupId, options, routerHistory))
	}
}

/**
 * 
 */
const createGroup = (options, routerHistory) => (dispatch, getState) => {
	if (!me) return

	dispatch(createGroupRequest())

	const formData = new FormData()
	formData.append('title', options.title)
	formData.append('description', options.description)
	formData.append('tags', options.tags)
	formData.append('is_private', options.isPrivate)
	formData.append('is_visible', options.isVisible)
	formData.append('password', options.password)

	if (options.coverImage !== null) {
		formData.append('cover_image', options.coverImage)
	}
	if (options.category !== null) {
		formData.append('group_category_id', options.category)
	}

	api(getState).post('/api/v1/groups', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	}).then(({ data }) => {
		dispatch(createGroupSuccess(data))
		console.log("pushing routerHistory:", routerHistory)
		routerHistory.push(`/groups/${data.id}`)
	}).catch((err) => dispatch(createGroupFail(err)))
}


const createGroupRequest = (id) => ({
	type: GROUP_CREATE_REQUEST,
	id,
})

const createGroupSuccess = (group) => ({
	type: GROUP_CREATE_SUCCESS,
	showToast: true,
	group,
})

const createGroupFail = (error) => ({
	type: GROUP_CREATE_FAIL,
	showToast: true,
	error,
})

/**
 * 
 */
const updateGroup = (groupId, options, routerHistory) => (dispatch, getState) => {
	if (!me) return

	dispatch(updateGroupRequest())

	const formData = new FormData()
	formData.append('title', options.title)
	formData.append('description', options.description)
	formData.append('tags', options.tags)
	formData.append('is_private', options.isPrivate)
	formData.append('is_visible', options.isVisible)
	formData.append('password', options.password)

	if (!!options.slug) {
		formData.append('slug', options.slug)
	}
	if (options.coverImage !== null) {
		formData.append('cover_image', options.coverImage)
	}
	if (options.category !== null) {
		formData.append('group_category_id', options.category)
	}

	api(getState).put(`/api/v1/groups/${groupId}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		}
	}).then(({ data }) => {
		dispatch(updateGroupSuccess(data))
		routerHistory.push(`/groups/${data.id}`)
	}).catch((err) => dispatch(updateGroupFail(err)))
}

const updateGroupRequest = (id) => ({
	type: GROUP_UPDATE_REQUEST,
	id,
})

const updateGroupSuccess = (group) => ({
	type: GROUP_UPDATE_SUCCESS,
	showToast: true,
	group,
})

const updateGroupFail = (error) => ({
	type: GROUP_UPDATE_FAIL,
	showToast: true,
	error,
})

/**
 * 
 */
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

export const changeGroupPassword = (password) => ({
	type: GROUP_EDITOR_PASSWORD_CHANGE,
	password,
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