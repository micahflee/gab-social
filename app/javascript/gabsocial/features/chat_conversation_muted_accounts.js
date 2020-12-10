import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'
import {
  fetchChatMessengerMutes,
  expandChatMessengerMutes,
  unmuteChatMessenger,
} from '../actions/chat_conversation_accounts'
import Account from '../components/account'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import ScrollableList from '../components/scrollable_list'

class ChatConversationMutedAccounts extends ImmutablePureComponent {

  componentWillMount() {
    this.props.onFetchMutes()
  }

  handleLoadMore = debounce(() => {
    this.props.onExpandMutes()
  }, 300, { leading: true })

  render() {
    const {
      accountIds,
      hasMore,
      isLoading,
    } = this.props

    return (
      <div className={[_s.d, _s.w100PC, _s.boxShadowNone].join(' ')}>
        <div className={[_s.d, _s.h60PX, _s.w100PC, _s.px10, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <BlockHeading title={<FormattedMessage id='navigation_bar.chat_mutes' defaultMessage='Muted chat users' />} />
        </div>
        <ScrollableList
          scrollKey='chat_muted_accounts'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          emptyMessage={<FormattedMessage id='empty_column.chat_mutes' defaultMessage="You haven't muted any chat users yet." />}
        >
          {
            accountIds && accountIds.map((id) =>
              <Account
                key={`mutes-${id}`}
                id={id}
                compact
                actionIcon='subtract'
								onActionClick={() => this.props.onRemove(id)}
								actionTitle='Remove'
              />
            )
          }
        </ScrollableList>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  accountIds: state.getIn(['user_lists', 'chat_mutes', me, 'items']),
  hasMore: !!state.getIn(['user_lists', 'chat_mutes', me, 'next']),
  isLoading: state.getIn(['user_lists', 'chat_mutes', me, 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchMutes: () => dispatch(fetchChatMessengerMutes()),
  onExpandMutes: () => dispatch(expandChatMessengerMutes()),
  onRemove: (accountId) => dispatch(unmuteChatMessenger(accountId)),
})

ChatConversationMutedAccounts.propTypes = {
  accountIds: ImmutablePropTypes.list,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  onExpandMutes: PropTypes.func.isRequired,
  onFetchMutes: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ChatConversationMutedAccounts))