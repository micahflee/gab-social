import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { List as ImmutableList } from 'immutable'
import { me } from '../initial_state'
import { connectGroupCollectionStream } from '../actions/streaming'
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
		//keep track of loads for if no user, 
		//only allow 2 loads before showing sign up msg
		loadCount: 0,
	}

	_unsubscribe() {
		if (this.disconnect && !!me) {
			this.disconnect()
			this.disconnect = null
		}
	}

	_subscribe = () => {
		if (!!me) {
			const {
				collectionType,
				sortByValue,
				sortByTopValue,
			} = this.props

			if (collectionType === 'member' && sortByValue === 'new') {
				const sortBy = getSortBy(sortByValue, sortByTopValue)
				this.disconnect = this.props.onConnectGroupCollectionStream(collectionType, sortBy)
			}
		}
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

			this._subscribe()
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.sortByValue !== this.props.sortByValue || 
				prevProps.sortByTopValue !== this.props.sortByTopValue ||
				prevProps.collectionType !== this.props.collectionType) {
				this._unsubscribe()
				this._subscribe()
				this.props.onClearTimeline(`group_collection:${prevProps.collectionType}`)
				this.handleLoadMore()
    }
  }

	componentWillUnmount() {
		this._unsubscribe()
	}

	handleLoadMore = (maxId) => {
		const {
			collectionType,
			sortByValue,
			sortByTopValue,
		} = this.props
		const { loadCount } = this.state

		if (!!maxId && !me) {
			this.setState({ loadCount: this.state.loadCount + 1 })
			if (loadCount >= 2) return false
		} else if (!maxId && loadCount !== 0) {
			this.setState({ loadCount: 0 })
		}

		const sortBy = getSortBy(sortByValue, sortByTopValue)
		const options = { sortBy, maxId }

		this.props.onExpandGroupCollectionTimeline(collectionType, options)
	}
 
	render() {
		const {
			collectionType,
			intl,
			hasNoGroupMembers,
		} = this.props
		const { loadCount } = this.state

		const emptyMessage = !!me && collectionType === 'member' && hasNoGroupMembers ? (
			<div className={[_s.d, _s.w100PC]}>
				<Text className={[_s.d, _s.mb10].join(' ')}>
					Join some groups then come back here to view your group timeline
				</Text>
				<GroupsCollection activeTab='featured' />
			</div>
		) : intl.formatMessage(messages.empty)

		const canLoadMore = loadCount < 2 && !me || !!me

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
	onConnectGroupCollectionStream(collectionType, sortBy) {
		dispatch(connectGroupCollectionStream(collectionType, sortBy))
	},
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
	onConnectGroupCollectionStream: PropTypes.func.isRequired,
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