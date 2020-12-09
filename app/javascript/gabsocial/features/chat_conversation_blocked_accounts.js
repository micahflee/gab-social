import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'
import { fetchBlocks, expandBlocks } from '../actions/blocks'
import Account from '../components/account'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import Divider from '../components/divider'
import ScrollableList from '../components/scrollable_list'
import AccountPlaceholder from '../components/placeholder/account_placeholder'

class MessagesBlockedAccounts extends ImmutablePureComponent {

  componentDidMount() {
    this.props.onFetchBlocks()
  }

  handleLoadMore = debounce(() => {
    this.props.onExpandBlocks()
  }, 300, { leading: true })

  render() {
    const {
      intl,
      accountIds,
      hasMore,
      isLoading,
    } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <div className={[_s.d, _s.w100PC, _s.boxShadowNone].join(' ')}>
        <div className={[_s.d, _s.h60PX, _s.w100PC, _s.px10, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <BlockHeading title={intl.formatMessage(messages.blocks)} />
        </div>
        <ScrollableList
          scrollKey='blocked_accounts'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          showLoading={isLoading}
          emptyMessage={emptyMessage}
          placeholderComponent={AccountPlaceholder}
          placeholderCount={3}
        >
          {
            accountIds && accountIds.map((id) => (
              <Account
                key={`blocked-accounts-${id}`}
                id={id}
                compact
              />
            ))
          }
        </ScrollableList>
      </div>
    )
  }

}

const messages = defineMessages({
  empty: { id: 'empty_column.blocks', defaultMessage: 'You haven\'t blocked any users yet.' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
})

const mapStateToProps = (state) => ({
  accountIds: state.getIn(['user_lists', 'blocks', me, 'items']),
  hasMore: !!state.getIn(['user_lists', 'blocks', me, 'next']),
  isLoading: state.getIn(['user_lists', 'blocks', me, 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchBlocks: () => dispatch(fetchBlocks()),
  onExpandBlocks: () => dispatch(expandBlocks()),
})

MessagesBlockedAccounts.propTypes = {
  accountIds: ImmutablePropTypes.list,
  hasMore: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  onExpandBlocks: PropTypes.func.isRequired,
  onFetchBlocks: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MessagesBlockedAccounts))