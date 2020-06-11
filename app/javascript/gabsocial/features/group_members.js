import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { FormattedMessage } from 'react-intl'
import {
	fetchMembers,
	expandMembers,
} from '../actions/groups'
import { openPopover } from '../actions/popover'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'

const mapStateToProps = (state, { groupId }) => ({
	group: state.getIn(['groups', groupId]),
	relationships: state.getIn(['group_relationships', groupId]),
	accountIds: state.getIn(['user_lists', 'groups', groupId, 'items']),
	hasMore: !!state.getIn(['user_lists', 'groups', groupId, 'next']),
})

const mapDispatchToProps = (dispatch) => ({
	onFetchMembers(groupId) {
		dispatch(fetchMembers(groupId))
	},
	onExpandMembers(groupId) {
		dispatch(expandMembers(groupId))
	},
	onOpenGroupMemberOptions(targetRef, accountId, groupId) {
		dispatch(openPopover('GROUP_MEMBER_OPTIONS', {
			targetRef,
			accountId,
			groupId,
			position: 'top',
		}))
	},
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class GroupMembers extends ImmutablePureComponent {

	static propTypes = {
		groupId: PropTypes.string.isRequired,
		accountIds: ImmutablePropTypes.list,
		hasMore: PropTypes.bool,
		onExpandMembers: PropTypes.func.isRequired,
		onFetchMembers: PropTypes.func.isRequired,
		onOpenGroupMemberOptions: PropTypes.func.isRequired,
	}

	componentWillMount() {
		const { groupId } = this.props

		this.props.onFetchMembers(groupId)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.groupId !== this.props.groupId) {
			this.props.onFetchMembers(nextProps.groupId)
		}
	}

	handleOpenGroupMemberOptions = (e, accountId) => {
		this.props.onOpenGroupMemberOptions(e.currentTarget, accountId, this.props.groupId)
	}

	handleLoadMore = debounce(() => {
		this.props.onExpandMembers(this.props.groupId)
	}, 300, { leading: true })

	render() {
		const {
			accountIds,
			hasMore,
			group,
			relationships,
		} = this.props

		const isAdmin = relationships.get('admin')

		return (
			<ScrollableList
				scrollKey='group-members'
				hasMore={hasMore}
				showLoading={(!group || !accountIds || !relationships)}
				onLoadMore={this.handleLoadMore}
				emptyMessage={<FormattedMessage id='group.members.empty' defaultMessage='This group does not has any members.' />}
			>
				{
					accountIds && accountIds.map((id) => (
						<Account
							compact
							key={id}
							id={id}
							actionIcon={!isAdmin ? undefined : 'ellipsis'}
							onActionClick={(data, event) => {
								return !isAdmin ? false : this.handleOpenGroupMemberOptions(event, id)
							}}
						/>
					))
				}
			</ScrollableList>
		)
	}

}
