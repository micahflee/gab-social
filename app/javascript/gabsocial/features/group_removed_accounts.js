import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import debounce from 'lodash.debounce'
import isObject from 'lodash.isobject'
import {
	fetchRemovedAccounts,
	expandRemovedAccounts,
	removeRemovedAccount,
} from '../actions/groups'
import { FormattedMessage } from 'react-intl'
import Account from '../components/account'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import ColumnIndicator from '../components/column_indicator'
import ScrollableList from '../components/scrollable_list'

class GroupRemovedAccounts extends ImmutablePureComponent {

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

	render() {
		const {
			accountIds,
			hasMore,
			group,
			intl,
		} = this.props

		if (!group) return <ColumnIndicator type='loading' />

		return (
			<Block>
				<BlockHeading title='Removed Accounts' />
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
								key={id}
								id={id}
								actionIcon='subtract'
								onActionClick={() => this.props.onRemoveRemovedAccount(group.get('id'), id)}
								actionTitle={intl.formatMessage(messages.remove)}
							/>
						))
					}
				</ScrollableList>
			</Block>
		)
	}

}

const messages = defineMessages({
	remove: { id: 'groups.removed_accounts', defaultMessage: 'Allow joining' },
})

const mapStateToProps = (state, { params }) => {
	const groupId = isObject(params) ? params['id'] : -1
	const group = groupId === -1 ? null : state.getIn(['groups', groupId])

	return {
		group,
		groupId,
		accountIds: state.getIn(['user_lists', 'groups_removed_accounts', groupId, 'items']),
		hasMore: !!state.getIn(['user_lists', 'groups_removed_accounts', groupId, 'next']),
	}
}

const mapDispatchToProps = (dispatch) => ({
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GroupRemovedAccounts))