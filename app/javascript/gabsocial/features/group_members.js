import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import {
	fetchMembers,
	expandMembers,
	updateRole,
	createRemovedAccount,
} from '../actions/groups'
import { FormattedMessage } from 'react-intl'
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

	handleLoadMore = debounce(() => {
		this.props.onExpandMembers(this.props.groupId)
	}, 300, { leading: true })

	render() {
		const {
			accountIds,
			hasMore,
			group,
			relationships,
			dispatch,
		} = this.props

		return (
			<ScrollableList
				scrollKey='group-members'
				hasMore={hasMore}
				showLoading={(!group || !accountIds || !relationships)}
				onLoadMore={this.handleLoadMore}
				emptyMessage={<FormattedMessage id='group.members.empty' defaultMessage='This group does not has any members.' />}
			>
				{
					accountIds && accountIds.map((id) => {
						let menu = []

						if (relationships.get('admin')) {
							menu = [
								{ text: 'Remove from group', action: () => dispatch(createRemovedAccount(group.get('id'), id)) },
								{ text: 'Make administrator', action: () => dispatch(updateRole(group.get('id'), id, 'admin')) },
							]
						}

						return (
							<Account
								compact
								key={id}
								id={id}
								actionIcon='ellipsis'
								onActionClick={() => true}
							/>
						)
					})
				}
			</ScrollableList>
		)
	}

}
