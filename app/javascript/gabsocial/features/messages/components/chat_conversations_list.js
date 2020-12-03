import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  fetchChatConversations,
  expandChatConversations,
  fetchChatConversationRequested,
  expandChatConversationRequested,
} from '../../../actions/chat_conversations'
import AccountPlaceholder from '../../../components/placeholder/account_placeholder'
import ChatConversationsListItem from './chat_conversations_list_item'
import ScrollableList from '../../../components/scrollable_list'

class ChatConversationsList extends ImmutablePureComponent {

  componentDidMount() {
    this.props.onFetchChatConversations(this.props.source)
  }

  handleLoadMore = debounce(() => {
    this.props.onExpandChatConversations(this.props.source)
  }, 300, { leading: true })

  render() {
    const {
      hasMore,
      isLoading,
      source,
      chatConversationIds,
    } = this.props

    return (
      <div className={[_s.d, _s.w100PC, _s.overflowHidden, _s.boxShadowNone].join(' ')}>
        <ScrollableList
          scrollKey='chat-conversations'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          showLoading={isLoading}
          placeholderComponent={AccountPlaceholder}
          placeholderCount={3}
          emptyMessage='Empty'
        >
          {
            !!chatConversationIds && chatConversationIds.map((chatConversationId, i) => (
              <ChatConversationsListItem
                key={`chat-conversation-${i}`}
                chatConversationId={chatConversationId}
                source={source}
              />
            ))
          }
        </ScrollableList>
      </div>
    )
  }

}

const mapStateToProps = (state, { source }) => ({
  chatConversationIds: state.getIn(['chat_conversation_lists', source, 'items']),
  hasMore: !!state.getIn(['chat_conversation_lists', source, 'next']),
  isLoading: state.getIn(['chat_conversation_lists', source, 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchChatConversations(source) {
    if (source ==='approved') {
      dispatch(fetchChatConversations())
    } else if (source ==='requested') {
      dispatch(fetchChatConversationRequested())
    }
  },
  onExpandChatConversations(source) {
    if (source ==='approved') {
      dispatch(expandChatConversations())
    } else if (source ==='requested') {
      dispatch(expandChatConversationRequested())
    }
  },
})

ChatConversationsList.propTypes = {
  chatConversationIds: ImmutablePropTypes.list,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  onFetchChatConversations: PropTypes.func.isRequired,
  onExpandChatConversations: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversationsList)