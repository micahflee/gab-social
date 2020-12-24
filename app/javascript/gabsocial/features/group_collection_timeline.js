import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { List as ImmutableList } from 'immutable'
import { me } from '../initial_state'
import {
	clearTimeline,
	expandGroupCollectionTimeline,
} from '../actions/timelines'
import {
	setGroupTimelineSort,
} from '../actions/groups'
import {
	GROUP_TIMELINE_SORTING_TYPE_HOT,
	GROUP_TIMELINE_SORTING_TYPE_NEWEST,
} from '../constants'
import getSortBy from '../utils/group_sort_by'
import Text from '../components/text'
import StatusList from '../components/status_list'
import GroupSortBlock from '../components/group_sort_block'
import GroupsCollection from './groups_collection'

class GroupCollectionTimeline extends React.PureComponent {

	state = {
		//keep track of page loads for if no user, 
		//only allow 2 page loads before showing sign up msg
		page: 1,
	}

	componentDidMount() {
		const {
			collectionType,
			sortByValue,
			sortByTopValue,
		} = this.props

		if (this.props.collectionType === 'featured' && sortByValue !== GROUP_TIMELINE_SORTING_TYPE_HOT) {
			this.props.setFeaturedTop()
		} else if (!!me && this.props.collectionType === 'member' && sortByValue !== GROUP_TIMELINE_SORTING_TYPE_NEWEST) {
			this.props.setMemberNewest()
		} else {
			const sortBy = getSortBy(sortByValue, sortByTopValue)
			this.props.onExpandGroupCollectionTimeline(collectionType, { sortBy })
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.sortByValue !== this.props.sortByValue || 
				prevProps.sortByTopValue !== this.props.sortByTopValue ||
				prevProps.collectionType !== this.props.collectionType) {
				this.props.onClearTimeline(`group_collection:${prevProps.collectionType}`)
				this.handleLoadMore()
    }
  }

	handleLoadMore = (maxId) => {
		const {
			collectionType,
			sortByValue,
			sortByTopValue,
		} = this.props
		const { page } = this.state
		
		const newPage = !!maxId ? this.state.page + 1 : 1
		if (!!maxId && !me && page >= 2) return false
		this.setState({ page: newPage })

		const sortBy = getSortBy(sortByValue, sortByTopValue)
		const options = { sortBy, maxId, page: newPage }

		this.props.onExpandGroupCollectionTimeline(collectionType, options)
	}
 
	render() {
		const {
			collectionType,
			intl,
			hasNoGroupMembers,
		} = this.props
		const { page } = this.state

		const emptyMessage = !!me && collectionType === 'member' && hasNoGroupMembers ? (
			<div className={[_s.d, _s.w100PC]}>
				<Text className={[_s.d, _s.mb10].join(' ')}>
					Join some groups then come back here to view your group timeline
				</Text>
				<GroupsCollection activeTab='featured' />
			</div>
		) : intl.formatMessage(messages.empty)

		const canLoadMore = page < 2 && !me || !!me

		return (
			<React.Fragment>
				<GroupSortBlock collectionType={collectionType} />
				<StatusList
					scrollKey={`group-collection-timeline-${collectionType}`}
					timelineId={`group_collection:${collectionType}`}
					onLoadMore={canLoadMore ? this.handleLoadMore : undefined}
					emptyMessage={emptyMessage}
				/>
			</React.Fragment>
		)
	}

}

const messages = defineMessages({
	empty: { id: 'empty_column.group_collection_timeline', defaultMessage: 'There are no gabs to display.' },
})

const mapStateToProps = (state) => {

	let hasNoGroupMembers = true
	try {
		hasNoGroupMembers = state.getIn(['group_lists', 'member', 'items'], ImmutableList()).count() === 0
	} catch (error) {
		//
	}

	return {
		hasNoGroupMembers,
		sortByValue: state.getIn(['group_lists', 'sortByValue']),
		sortByTopValue: state.getIn(['group_lists', 'sortByTopValue']),
	}
}

const mapDispatchToProps = (dispatch) => ({
	onClearTimeline(timeline) {
		dispatch(clearTimeline(timeline))
	},
	onExpandGroupCollectionTimeline(collectionType, options) {
		dispatch(expandGroupCollectionTimeline(collectionType, options))
	},
	setFeaturedTop() {
		dispatch(setGroupTimelineSort(GROUP_TIMELINE_SORTING_TYPE_HOT))
	},
	setMemberNewest() {
		dispatch(setGroupTimelineSort(GROUP_TIMELINE_SORTING_TYPE_NEWEST))
	},
})

GroupCollectionTimeline.propTypes = {
	params: PropTypes.object.isRequired,
	onClearTimeline: PropTypes.func.isRequired,
	onExpandGroupCollectionTimeline: PropTypes.func.isRequired,
	setFeaturedTop: PropTypes.func.isRequired,
	setMemberNewest: PropTypes.func.isRequired,
	intl: PropTypes.object.isRequired,
	collectionType: PropTypes.string.isRequired,
	sortByValue: PropTypes.string.isRequired,
	sortByTopValue: PropTypes.string,
	hasStatuses: PropTypes.bool.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GroupCollectionTimeline))