import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import isObject from 'lodash.isobject'
import { FormattedMessage } from 'react-intl'
import { me } from '../initial_state'
import {
	fetchJoinRequests,
	expandJoinRequests,
	rejectJoinRequest,
	approveJoinRequest,
} from '../actions/groups'
import Account from '../components/account'
import ColumnIndicator from '../components/column_indicator'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import ScrollableList from '../components/scrollable_list'

class GroupJoinRequests extends ImmutablePureComponent {

	componentWillMount() {
		const { groupId } = this.props

		this.props.onFetchJoinRequests(groupId)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.groupId !== this.props.groupId) {
			this.props.onFetchJoinRequests(nextProps.groupId)
		}
	}

	handleLoadMore = debounce(() => {
		this.props.onExpandJoinRequests(this.props.groupId)
	}, 300, { leading: true })

	render() {
		const {
			accountIds,
			hasMore,
			group,
			groupId,
			relationships,
		} = this.props

		if (!group || !relationships) return <ColumnIndicator type='loading' />

		const isAdminOrMod = relationships ? (relationships.get('admin') || relationships.get('moderator')) : false

		if (!isAdminOrMod) return <ColumnIndicator type='missing' />
			
		return (
			<Block>
				<BlockHeading title='Group Member Requests' />
				<div className={_s.d}>
					<ScrollableList
						scrollKey='group-members'
						hasMore={hasMore}
						showLoading={(!group || !accountIds || !relationships)}
						onLoadMore={this.handleLoadMore}
						emptyMessage={<FormattedMessage id='group.requests.empty' defaultMessage='This group does not have any member requests.' />}
					>
						{
							accountIds && accountIds.map((id) => (
								<Account
									compact
									key={id}
									id={id}
									showDismiss
									dismissAction={() => {
										this.props.onRejectJoinRequest(id, groupId)
									}}
									actionIcon={(!isAdminOrMod || id === me) ? undefined : 'check'}
									onActionClick={(data, event) => {
										this.props.onApproveJoinRequest(id, groupId)
									}}
								/>
							))
						}
					</ScrollableList>
				</div>
			</Block>
		)
	}

}

const mapStateToProps = (state, { params }) => {
	const groupId = isObject(params) ? params['id'] : -1
	const group = groupId === -1 ? null : state.getIn(['groups', groupId])

	return {
		group,
		groupId,
		relationships: state.getIn(['group_relationships', groupId]),
		accountIds: state.getIn(['user_lists', 'group_join_requests', groupId, 'items']),
		hasMore: !!state.getIn(['user_lists', 'group_join_requests', groupId, 'next']),
	}
}

const mapDispatchToProps = (dispatch) => ({
	onFetchJoinRequests(groupId) {
		dispatch(fetchJoinRequests(groupId))
	},
	onExpandJoinRequests(groupId) {
		dispatch(expandJoinRequests(groupId))
	},
	onRejectJoinRequest(accountId, groupId) {
		dispatch(rejectJoinRequest(accountId, groupId))
	},
	onApproveJoinRequest(accountId, groupId) {
		dispatch(approveJoinRequest(accountId, groupId))
	},
})

GroupJoinRequests.propTypes = {
	group: ImmutablePropTypes.map,
	groupId: PropTypes.string.isRequired,
	accountIds: ImmutablePropTypes.list,
	hasMore: PropTypes.bool,
	onExpandJoinRequests: PropTypes.func.isRequired,
	onFetchJoinRequests: PropTypes.func.isRequired,
	onRejectJoinRequest: PropTypes.func.isRequired,
	onApproveJoinRequest: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupJoinRequests)