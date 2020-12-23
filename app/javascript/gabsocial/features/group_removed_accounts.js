import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import isObject from 'lodash.isobject'
import {
	fetchRemovedAccounts,
	expandRemovedAccounts,
	removeRemovedAccount,
	fetchGroupRemovedAccountsAdminSearch,
} from '../actions/groups'
import { FormattedMessage } from 'react-intl'
import Account from '../components/account'
import Block from '../components/block'
import Input from '../components/input'
import BlockHeading from '../components/block_heading'
import ColumnIndicator from '../components/column_indicator'
import ScrollableList from '../components/scrollable_list'

class GroupRemovedAccounts extends ImmutablePureComponent {

	state = {
		query: '',
	}

	componentWillMount() {
		const { groupId } = this.props

		this.props.onFetchRemovedAccounts(groupId)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.groupId !== this.props.groupId) {
			this.props.onFetchRemovedAccounts(nextProps.groupId)
		}
	}

	handleLoadMore = debounce(() => {
		this.props.onExpandRemovedAccounts(this.props.groupId)
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
			relationships,
			group,
		} = this.props
		const { query } = this.state

		if (!group || !relationships) return <ColumnIndicator type='loading' />

		const isAdminOrMod = relationships ? (relationships.get('admin') || relationships.get('moderator')) : false

		if (!isAdminOrMod) return <ColumnIndicator type='missing' />
		
		if (!group) return <ColumnIndicator type='loading' />

		const accountIds = !!query ? searchAcountIds : listAccountIds

		return (
			<Block>
				<BlockHeading title='Removed Accounts' />
				<div className={[_s.d, _s.jcCenter, _s.px15, _s.my5, _s.borderBottom1PX, _s.borderColorSecondary, _s.pt5, _s.pb15].join(' ')}>
					<Input
						id='group-member-search'
						placeholder='Search removed group members'
						prependIcon='search'
						value={query}
						onChange={this.handleOnChange}
						autoComplete='off'
					/>
				</div>
				<ScrollableList
					scrollKey='removed_accounts'
					hasMore={hasMore}
					showLoading={(!group || !accountIds)}
					onLoadMore={this.handleLoadMore}
					emptyMessage={<FormattedMessage id='group.removed_accounts.empty' defaultMessage='This group does not have any removed accounts.' />}
				>
					{
						accountIds && accountIds.map((id) => (
							<Account
							  compact
								key={id}
								id={id}
								onActionClick={() => this.props.onRemoveRemovedAccount(group.get('id'), id)}
								actionTitle='Allow to join'
							/>
						))
					}
				</ScrollableList>
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
		listAccountIds: state.getIn(['user_lists', 'group_removed_accounts', groupId, 'items']),
		searchAcountIds: state.getIn(['group_lists', 'removed_search_accounts']),
		hasMore: !!state.getIn(['user_lists', 'group_removed_accounts', groupId, 'next']),
		relationships: state.getIn(['group_relationships', groupId]),
	}
}

const mapDispatchToProps = (dispatch) => ({
	onChange(groupId, query) {
		dispatch(fetchGroupRemovedAccountsAdminSearch(groupId, query))
	},
	onFetchRemovedAccounts(groupId) {
		dispatch(fetchRemovedAccounts(groupId))
	},
	onExpandRemovedAccounts(groupId) {
		dispatch(expandRemovedAccounts(groupId))
	},
	onRemoveRemovedAccount(groupId, accountId) {
		dispatch(removeRemovedAccount(groupId, accountId))
	},
})

GroupRemovedAccounts.propTypes = {
	groupId: PropTypes.string.isRequired,
	accountIds: ImmutablePropTypes.list,
	hasMore: PropTypes.bool,
	onFetchRemovedAccounts: PropTypes.func.isRequired,
	onExpandRemovedAccounts: PropTypes.func.isRequired,
	onRemoveRemovedAccount: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupRemovedAccounts)