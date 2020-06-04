import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { FormattedMessage } from 'react-intl'
import { fetchGroups } from '../actions/groups'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Responsive from './ui/util/responsive_component'
import ColumnIndicator from '../components/column_indicator'
import ScrollableList from '../components/scrollable_list'
import GroupCollectionItem from '../components/group_collection_item'

const mapStateToProps = (state, { activeTab }) => ({
	groupIds: state.getIn(['group_lists', activeTab, 'items']),
	isFetched: state.getIn(['group_lists', activeTab, 'isFetched']),
	isLoading: state.getIn(['group_lists', activeTab, 'isLoading']),
})

export default
@connect(mapStateToProps)
class GroupsCollection extends ImmutablePureComponent {

	static propTypes = {
		activeTab: PropTypes.string.isRequired,
		dispatch: PropTypes.func.isRequired,
		groupIds: ImmutablePropTypes.list,
		isFetched: PropTypes.bool.isRequired,
		isLoading: PropTypes.bool.isRequired,
	}

	componentWillMount() {
		this.props.dispatch(fetchGroups(this.props.activeTab))
	}

	componentDidUpdate(oldProps) {
		if (this.props.activeTab && this.props.activeTab !== oldProps.activeTab) {
			this.props.dispatch(fetchGroups(this.props.activeTab))
		}
	}

	render() {
		const {
			groupIds,
			isLoading,
			isFetched,
		} = this.props

		if (isLoading && groupIds.size === 0) {
			return <ColumnIndicator type='loading' />
		} else if (isFetched && groupIds.size === 0) {
			return <ColumnIndicator type='error' message={<FormattedMessage id='groups.empty' defaultMessage='There are no groups to display' />} />
		}

		const halfCount = parseInt(groupIds.size / 2)

		return (
			<div className={[_s.default, _s.flexRow, _s.flexWrap].join(' ')}>
				<Responsive max={BREAKPOINT_EXTRA_SMALL}>
					<div className={[_s.default, _s.width100PC, _s.px5].join(' ')}>
						<ScrollableList scrollKey='group-collection-column-1'>
							{
								groupIds.map((groupId, i) => (
									<GroupCollectionItem key={`group-collection-item-${i}`} id={groupId} />
								))
							}
						</ScrollableList>
					</div>
				</Responsive>
				<Responsive min={BREAKPOINT_EXTRA_SMALL}>
					<div className={[_s.default, _s.flexNormal].join(' ')}>
						<ScrollableList scrollKey='group-collection-column-1'>
							{
								groupIds.slice(0, halfCount).map((groupId, i) => (
									<GroupCollectionItem key={`group-collection-item-${i}`} id={groupId} />
								))
							}
						</ScrollableList>
					</div>
					<div className={[_s.default, _s.flexNormal].join(' ')}>
						<ScrollableList scrollKey='group-collection-column-2'>
							{
								groupIds.slice(halfCount, groupIds.size).map((groupId, i) => (
									<GroupCollectionItem key={`group-collection-item-${i}`} id={groupId} />
								))
							}
						</ScrollableList>
					</div>
				</Responsive>
			</div>
		)
	}

}