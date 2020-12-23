import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'
import {
  fetchChatMessengerBlocks,
  expandChatMessengerBlocks,
  unblockChatMessenger,
} from '../actions/chat_conversation_accounts'
import Account from '../components/account'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import Divider from '../components/divider'
import ScrollableList from '../components/scrollable_list'
import AccountPlaceholder from '../components/placeholder/account_placeholder'

class ChatConversationBlockedAccounts extends ImmutablePureComponent {

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
      <div className={[_s.d, _s.w100PC, _s.h100PC, _s.overflowHidden, _s.boxShadowNone].join(' ')}>
        <div className={[_s.d, _s.h60PX, _s.w100PC, _s.px10, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <BlockHeading title={intl.formatMessage(messages.blocks)} />
        </div>
        <div className={[_s.d, _s.posAbs, _s.top60PX, _s.left0, _s.right0, _s.bottom0, _s.overflowYScroll].join(' ')}>
          <ScrollableList
            scrollKey='chat_blocked_accounts'
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
                  actionIcon=''
                  onActionClick={() => this.props.onRemove(id)}
                  actionTitle='Undo Chat Block'
                />
              ))
            }
          </ScrollableList>
        </div>
      </div>
    )
  }

}

const messages = defineMessages({
  empty: { id: 'empty_column.chat_blocks', defaultMessage: 'You haven\'t blocked any chat users yet.' },
  blocks: { id: 'navigation_bar.chat_blocks', defaultMessage: 'Blocked chat users' },
})

const mapStateToProps = (state) => ({
  accountIds: state.getIn(['user_lists', 'chat_blocks', me, 'items']),
  hasMore: !!state.getIn(['user_lists', 'chat_blocks', me, 'next']),
  isLoading: state.getIn(['user_lists', 'chat_blocks', me, 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchBlocks: () => dispatch(fetchChatMessengerBlocks()),
  onExpandBlocks: () => dispatch(expandChatMessengerBlocks()),
  onRemove: (accountId) => dispatch(unblockChatMessenger(accountId)),
})

ChatConversationBlockedAccounts.propTypes = {
  accountIds: ImmutablePropTypes.list,
  hasMore: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  onExpandBlocks: PropTypes.func.isRequired,
  onFetchBlocks: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ChatConversationBlockedAccounts))