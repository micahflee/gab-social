import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { List as ImmutableList } from 'immutable'
import { me } from '../initial_state'
import {
	clearTimeline,
	expandExploreTimeline,
} from '../actions/timelines'
import {
	setGroupTimelineSort,
} from '../actions/groups'
import {
	MIN_UNAUTHENTICATED_PAGES,
	GROUP_TIMELINE_SORTING_TYPE_HOT,
	GROUP_TIMELINE_SORTING_TYPE_NEWEST,
} from '../constants'
import getSortBy from '../utils/group_sort_by'
import Text from '../components/text'
import StatusList from '../components/status_list'
import GroupSortBlock from '../components/group_sort_block'

class ExploreTimeline extends React.PureComponent {

	state = {
		//keep track of page loads for if no user, 
		//only allow MIN_UNAUTHENTICATED_PAGES page loads before showing sign up msg
		page: 1,
	}

	componentDidMount() {
		const {
			sortByValue,
			sortByTopValue,
		} = this.props

		if (sortByValue !== GROUP_TIMELINE_SORTING_TYPE_HOT) {
			this.props.setFeaturedTop()
		} else {
			const sortBy = getSortBy(sortByValue, sortByTopValue)
			this.props.onExpandExploreTimeline({ sortBy })
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.sortByValue !== this.props.sortByValue || 
				prevProps.sortByTopValue !== this.props.sortByTopValue) {
				this.props.onClearTimeline('explore')
				this.handleLoadMore()
    }
  }

	handleLoadMore = (maxId) => {
		const {
			sortByValue,
			sortByTopValue,
		} = this.props
		const { page } = this.state

		const newPage = !!maxId ? this.state.page + 1 : 1
		if (!!maxId && !me && page >= MIN_UNAUTHENTICATED_PAGES) return false
		this.setState({ page: newPage })

		const sortBy = getSortBy(sortByValue, sortByTopValue)
		const options = { sortBy, maxId, page: newPage }

		this.props.onExpandExploreTimeline(options)
	}
 
	render() {
		const { intl } = this.props
		const { page } = this.state

		const canLoadMore = page < MIN_UNAUTHENTICATED_PAGES && !me || !!me

		return (
			<React.Fragment>
				<GroupSortBlock collectionType='featured' />
				<StatusList
					scrollKey='explore-timeline'
					timelineId='explore'
					onLoadMore={canLoadMore ? this.handleLoadMore : undefined}
					emptyMessage={intl.formatMessage(messages.empty)}
				/>
			</React.Fragment>
		)
	}

}

const messages = defineMessages({
	empty: { id: 'empty_column.group_collection_timeline', defaultMessage: 'There are no gabs to display.' },
})

const mapStateToProps = (state) => ({
	sortByValue: state.getIn(['group_lists', 'sortByValue']),
	sortByTopValue: state.getIn(['group_lists', 'sortByTopValue']),
})

const mapDispatchToProps = (dispatch) => ({
	onClearTimeline(timeline) {
		dispatch(clearTimeline(timeline))
	},
	onExpandExploreTimeline(options) {
		dispatch(expandExploreTimeline(options))
	},
	setFeaturedTop() {
		dispatch(setGroupTimelineSort(GROUP_TIMELINE_SORTING_TYPE_HOT))
	},
	setMemberNewest() {
		dispatch(setGroupTimelineSort(GROUP_TIMELINE_SORTING_TYPE_NEWEST))
	},
})

ExploreTimeline.propTypes = {
	params: PropTypes.object.isRequired,
	onClearTimeline: PropTypes.func.isRequired,
	onExpandExploreTimeline: PropTypes.func.isRequired,
	setFeaturedTop: PropTypes.func.isRequired,
	setMemberNewest: PropTypes.func.isRequired,
	intl: PropTypes.object.isRequired,
	sortByValue: PropTypes.string.isRequired,
	sortByTopValue: PropTypes.string,
	hasStatuses: PropTypes.bool.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ExploreTimeline))