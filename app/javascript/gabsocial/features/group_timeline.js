import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import { connectGroupStream } from '../actions/streaming'
import { expandGroupTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'
import ColumnIndicator from '../components/column_indicator'

const messages = defineMessages({
	empty: { id: 'empty_column.group', defaultMessage: 'There is nothing in this group yet.\nWhen members of this group post new statuses, they will appear here.' },
})

const mapStateToProps = (state, props) => ({
	group: state.getIn(['groups', props.params.id]),
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
	}

	componentDidMount() {
		const { dispatch } = this.props
		const { id } = this.props.params

		dispatch(expandGroupTimeline(id))

		if (!!me) {
			this.disconnect = dispatch(connectGroupStream(id))
		}
	}

	componentWillUnmount() {
		if (this.disconnect && !!me) {
			this.disconnect()
			this.disconnect = null
		}
	}

	handleLoadMore = maxId => {
		const { id } = this.props.params
		this.props.dispatch(expandGroupTimeline(id, { maxId }))
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
			<StatusList
				scrollKey={`group-timeline-${id}`}
				timelineId={`group:${id}`}
				onLoadMore={this.handleLoadMore}
				emptyMessage={intl.formatMessage(messages.empty)}
			/>
		)
	}

}
