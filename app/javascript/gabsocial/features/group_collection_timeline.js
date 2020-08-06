import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import { connectGroupCollectionStream } from '../actions/streaming'
import { expandGroupCollectionTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'

const messages = defineMessages({
	empty: { id: 'empty_column.group_collection_timeline', defaultMessage: 'There are no gabs to display.' },
})

const mapStateToProps = (state) = ({
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
		const { collectionType, dispatch } = this.props

		dispatch(expandGroupCollectionTimeline(collectionType))

		if (!!me) {
			this.disconnect = dispatch(connectGroupCollectionStream(collectionType))
		}
	}

	componentWillUnmount() {
		if (this.disconnect && !!me) {
			this.disconnect()
			this.disconnect = null
		}
	}

	handleLoadMore = (maxId) => {
		const { collectionType } = this.props
		this.props.dispatch(expandGroupCollectionTimeline(collectionType, { maxId }))
	}

	render() {
		const {
			collectionType,
			intl,
		} = this.props

		return (
			<StatusList
				scrollKey={`group-collection-timeline-${collectionType}`}
				timelineId={`group:collection:${collectionType}`}
				onLoadMore={this.handleLoadMore}
				emptyMessage={intl.formatMessage(messages.empty)}
			/>
		)
	}

}
