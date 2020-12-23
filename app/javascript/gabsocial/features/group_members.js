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
	fetchMembers,
	expandMembers,
	fetchGroupMembersAdminSearch,
} from '../actions/groups'
import { openPopover } from '../actions/popover'
import Account from '../components/account'
import ColumnIndicator from '../components/column_indicator'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import Input from '../components/input'
import Text from '../components/text'
import ScrollableList from '../components/scrollable_list'

class GroupMembers extends ImmutablePureComponent {

	state = {
		query: '',
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
		const { relationships, groupId } = this.props

		const isMod = relationships ? relationships.get('moderator') : true
		this.props.onOpenGroupMemberOptions(e.currentTarget, accountId, groupId, isMod)
	}

	handleLoadMore = debounce(() => {
		this.props.onExpandMembers(this.props.groupId)
	}, 300, { leading: true })

	handleOnChange = (query) => {
		this.setState({ query })
		this.props.onChange(this.props.groupId, query)
	}

	render() {
		const {
			listAccountIds,
			searchAcountIds,
			hasMore,
			group,
			relationships,
		} = this.props
		const { query } = this.state

		if (!group || !relationships) return <ColumnIndicator type='loading' />

		const isAdminOrMod = relationships ? (relationships.get('admin') || relationships.get('moderator')) : false

		if (!isAdminOrMod) return <ColumnIndicator type='missing' />
		
		const accountIds = !!query ? searchAcountIds : listAccountIds
		const accountIdsSize = !!accountIds ? accountIds.size : 0
		const memberCount = group.get('member_count')

		const blockHeadingTitle = (
			<React.Fragment>
				Group Members
				<Text className={[_s.d, _s.ml10]} size='medium' color='secondary'>
					({accountIdsSize} of {memberCount})
				</Text>
			</React.Fragment>
		)

		return (
			<Block>
				<BlockHeading title={blockHeadingTitle} />

				<div className={[_s.d, _s.jcCenter, _s.px15, _s.my5, _s.borderBottom1PX, _s.borderColorSecondary, _s.pt5, _s.pb15].join(' ')}>
					<Input
						id='group-member-search'
						placeholder='Search group members'
						prependIcon='search'
						value={query}
						onChange={this.handleOnChange}
						autoComplete='off'
					/>
				</div>

				<div className={[_s.d].join(' ')}>
					<ScrollableList
						scrollKey='group-members'
						hasMore={hasMore}
						showLoading={(!group || !accountIds || !relationships)}
						onLoadMore={this.handleLoadMore}
						emptyMessage={<FormattedMessage id='group.members.empty' defaultMessage='This group does not have any members.' />}
					>
						{
							accountIds && accountIds.map((id) => (
								// : todo : add badges for isAdmin, isModerator
								<Account
									compact
									key={id}
									id={id}
									actionIcon={(!isAdminOrMod || id === me) ? undefined : 'ellipsis'}
									onActionClick={(data, event) => {
										return !isAdminOrMod ? false : this.handleOpenGroupMemberOptions(event, id)
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
		listAccountIds: state.getIn(['user_lists', 'groups', groupId, 'items']),
		searchAcountIds: state.getIn(['group_lists', 'member_search_accounts']),
		relationships: state.getIn(['group_relationships', groupId]),
		hasMore: !!state.getIn(['user_lists', 'groups', groupId, 'next']),
	}
}

const mapDispatchToProps = (dispatch) => ({
	onChange(groupId, query) {
		dispatch(fetchGroupMembersAdminSearch(groupId, query))
	},
	onFetchMembers(groupId) {
		dispatch(fetchMembers(groupId))
	},
	onExpandMembers(groupId) {
		dispatch(expandMembers(groupId))
	},
	onOpenGroupMemberOptions(targetRef, accountId, groupId, isModerator) {
		dispatch(openPopover('GROUP_MEMBER_OPTIONS', {
			targetRef,
			accountId,
			groupId,
			isModerator,
			position: 'top',
		}))
	},
})

GroupMembers.propTypes = {
	group: ImmutablePropTypes.map,
	groupId: PropTypes.string.isRequired,
	accountIds: ImmutablePropTypes.list,
	hasMore: PropTypes.bool,
	onExpandMembers: PropTypes.func.isRequired,
	onFetchMembers: PropTypes.func.isRequired,
	onOpenGroupMemberOptions: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupMembers)