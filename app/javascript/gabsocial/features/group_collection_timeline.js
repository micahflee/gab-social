import { Fragment } from 'react'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import { GROUP_TIMELINE_SORTING_TYPE_TOP } from '../constants'
import { connectGroupCollectionStream } from '../actions/streaming'
import { expandGroupCollectionTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'
import GroupSortBlock from '../components/group_sort_block'

const messages = defineMessages({
	empty: { id: 'empty_column.group_collection_timeline', defaultMessage: 'There are no gabs to display.' },
})

const mapStateToProps = (state) => ({
	sortByValue: state.getIn(['group_lists', 'sortByValue']),
	sortByTopValue: state.getIn(['group_lists', 'sortByTopValue']),
})

export default
@injectIntl
@connect(mapStateToProps)
class GroupCollectionTimeline extends PureComponent {

	static propTypes = {
		params: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
		intl: PropTypes.object.isRequired,
		sortByValue: PropTypes.string.isRequired,
		sortByTopValue: PropTypes.string,
	}

	componentDidMount() {
		const {
			collectionType,
			dispatch,
			sortByValue,
			sortByTopValue,
		} = this.props

		const sortBy = sortByValue === GROUP_TIMELINE_SORTING_TYPE_TOP ? `${sortByValue}_${sortByTopValue}` : sortByValue
		const options = { sortBy }
	
		dispatch(expandGroupCollectionTimeline(collectionType, options))

		if (!!me) {
			this.disconnect = dispatch(connectGroupCollectionStream(collectionType))
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.sortByValue !== this.props.sortByValue ||  prevProps.sortByTopValue !== this.props.sortByTopValue) {
      this.handleLoadMore()
    }
  }

	componentWillUnmount() {
		if (this.disconnect && !!me) {
			this.disconnect()
			this.disconnect = null
		}
	}

	handleLoadMore = (maxId) => {
		const {
			collectionType,
			sortByValue,
			sortByTopValue,
		} = this.props

		const sortBy = sortByValue === GROUP_TIMELINE_SORTING_TYPE_TOP ? `${sortByValue}_${sortByTopValue}` : sortByValue
		const options = { sortBy, maxId }

		this.props.dispatch(expandGroupCollectionTimeline(collectionType, options))
	}

	render() {
		const {
			collectionType,
			intl,
		} = this.props

		return (
			<Fragment>
				<GroupSortBlock collectionType={collectionType} />
				<StatusList
					scrollKey={`group-collection-timeline-${collectionType}`}
					timelineId={`group:collection:${collectionType}`}
					onLoadMore={this.handleLoadMore}
					emptyMessage={intl.formatMessage(messages.empty)}
				/>
			</Fragment>
		)
	}

}
