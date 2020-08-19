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
} from '../actions/groups'
import { openPopover } from '../actions/popover'
import Account from '../components/account'
import ColumnIndicator from '../components/column_indicator'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import Input from '../components/input'
import ScrollableList from '../components/scrollable_list'

class GroupMembers extends ImmutablePureComponent {

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

		if (!group || !relationships) return <ColumnIndicator type='loading' />

		const isAdmin = relationships ? relationships.get('admin') : false

		if (!isAdmin) return <ColumnIndicator type='missing' />
			
		return (
			<Block>
				<BlockHeading title='Group Members' />

				{
					/* : todo :
					<div className={[_s.d, _s.jcCenter, _s.px15, _s.my5, _s.borderBottom1PX, _s.borderColorSecondary, _s.pt5, _s.pb15].join(' ')}>
						<Input
							id='group-member-search'
							placeholder='Search group members'
							prependIcon='search'
							// value={value}
							onKeyUp={this.handleKeyUp}
							onChange={this.handleOnChange}
							onFocus={this.handleOnFocus}
							onBlur={this.handleOnBlur}
							autoComplete='off'
						/>
					</div>
					*/
				}
				<div className={[_s.d].join(' ')}>
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
									actionIcon={(!isAdmin || id === me) ? undefined : 'ellipsis'}
									onActionClick={(data, event) => {
										return !isAdmin ? false : this.handleOpenGroupMemberOptions(event, id)
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
		accountIds: state.getIn(['user_lists', 'groups', groupId, 'items']),
		hasMore: !!state.getIn(['user_lists', 'groups', groupId, 'next']),
	}
}

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