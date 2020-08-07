import { Fragment } from 'react'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import { GROUP_TIMELINE_SORTING_TYPE_TOP } from '../constants'
import { connectGroupStream } from '../actions/streaming'
import { expandGroupTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'
import ColumnIndicator from '../components/column_indicator'
import GroupSortBlock from '../components/group_sort_block'

const messages = defineMessages({
	empty: { id: 'empty_column.group', defaultMessage: 'There is nothing in this group yet.\nWhen members of this group post new statuses, they will appear here.' },
})

const mapStateToProps = (state, props) => ({
	group: state.getIn(['groups', props.params.id]),
	sortByValue: state.getIn(['group_lists', 'sortByValue']),
	sortByTopValue: state.getIn(['group_lists', 'sortByTopValue']),
})

export default
@connect(mapStateToProps)
@injectIntl
class GroupTimeline extends ImmutablePureComponent {

	static propTypes = {
		params: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
		group: PropTypes.oneOfType([
			ImmutablePropTypes.map,
			PropTypes.bool,
		]),
		intl: PropTypes.object.isRequired,
		sortByValue: PropTypes.string.isRequired,
		sortByTopValue: PropTypes.string,
	}

	componentDidMount() {
		const {
			dispatch,
			sortByValue,
			sortByTopValue,
		} = this.props
		const { id } = this.props.params

		const sortBy = sortByValue === GROUP_TIMELINE_SORTING_TYPE_TOP ? `${sortByValue}_${sortByTopValue}` : sortByValue
		const options = { sortBy }

		dispatch(expandGroupTimeline(id, options))

		if (!!me) {
			this.disconnect = dispatch(connectGroupStream(id))
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.sortByValue !== this.props.sortByValue || prevProps.sortByTopValue !== this.props.sortByTopValue) {
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
			dispatch,
			sortByValue,
			sortByTopValue,
		} = this.props
		const { id } = this.props.params

		const sortBy = sortByValue === GROUP_TIMELINE_SORTING_TYPE_TOP ? `${sortByValue}_${sortByTopValue}` : sortByValue
		const options = { sortBy, maxId }

		dispatch(expandGroupTimeline(id, options))
	}

	render() {
		const { group, intl } = this.props
		const { id } = this.props.params

		if (typeof group === 'undefined') {
			return <ColumnIndicator type='loading' />
		} else if (group === false) {
			return <ColumnIndicator type='missing' />
		}

		return (
			<Fragment>
				<GroupSortBlock groupId={id} />
				<StatusList
					scrollKey={`group-timeline-${id}`}
					timelineId={`group:${id}`}
					onLoadMore={this.handleLoadMore}
					emptyMessage={intl.formatMessage(messages.empty)}
				/>
			</Fragment>
		)
	}

}
