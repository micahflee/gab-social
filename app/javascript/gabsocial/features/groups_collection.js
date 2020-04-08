import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchGroups } from '../actions/groups'
import ColumnIndicator from '../components/column_indicator'
import ScrollableList from '../components/scrollable_list'
import GroupCollectionItem from '../components/group_collection_item'

const mapStateToProps = (state, { activeTab }) => ({
	groupIds: state.getIn(['group_lists', activeTab]),
})

export default
@connect(mapStateToProps)
class GroupsCollection extends ImmutablePureComponent {

	static propTypes = {
		activeTab: PropTypes.string.isRequired,
		dispatch: PropTypes.func.isRequired,
		groupIds: ImmutablePropTypes.list,
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
		const { groupIds } = this.props

		if (!groupIds) {
			return <ColumnIndicator type='loading' />
		}

		const halfCount = parseInt(groupIds.size / 2)

		console.log("halfCount", halfCount)

		return (
			<div className={[_s.default, _s.flexRow, _s.flexWrap].join(' ')}>
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
			</div>
		)
	}

}