import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment-mini'
import { List as ImmutableList } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { createSelector } from 'reselect'
import debounce from 'lodash.debounce'
import { me } from '../../../initial_state'
import { setChatConversationSelected } from '../../../actions/chats'
import {
  expandChatMessages,
  scrollBottomChatMessageConversation,
} from '../../../actions/chat_conversation_messages'
import ScrollableList from '../../../components/scrollable_list'
import ChatMessagePlaceholder from '../../../components/placeholder/chat_message_placeholder'
import ChatMessageItem from './chat_message_item'

class ChatMessageScrollingList extends ImmutablePureComponent {

  state = {
    isRefreshing: false,
  }

  componentDidMount () {
    const { chatConversationId } = this.props
    this.props.onExpandChatMessages(chatConversationId)
  }

  componentWillUnmount() {
    this.props.onSetChatConversationSelected(null)
  }

  componentWillReceiveProps (nextProps) {
    const { chatConversationId } = nextProps

    if (chatConversationId !== this.props.chatConversationId) {
      this.props.onExpandChatMessages(chatConversationId)
    }
  }

  handleLoadMore = (sinceId) => {
    const { chatConversationId, dispatch } = this.props
    this.props.onExpandChatMessages(chatConversationId, { sinceId })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isRefreshing) {
      this.setState({ isRefreshing: false })
    }
    if (prevProps.chatMessageIds.size === 0 && this.props.chatMessageIds.size > 0) {
      this.containerNode.scrollTop = this.containerNode.scrollHeight
    }
  }

  getCurrentChatMessageIndex = (id) => {
    // : todo :
    return this.props.chatMessageIds.indexOf(id)
  }

  handleMoveUp = (id) => {
    const elementIndex = this.getCurrentChatMessageIndex(id) - 1
    this._selectChild(elementIndex, true)
  }

  handleMoveDown = (id) => {
    const elementIndex = this.getCurrentChatMessageIndex(id) + 1
    this._selectChild(elementIndex, false)
  }

  handleLoadOlder = debounce(() => {
    this.handleLoadMore(this.props.chatMessageIds.size > 0 ? this.props.chatMessageIds.last() : undefined)
  }, 300, { leading: true })

  handleOnReload = debounce(() => {
    this.handleLoadMore()
    this.setState({ isRefreshing: true })
  }, 300, { trailing: true })

  _selectChild(index, align_top) {
    const container = this.node.node
    const element = container.querySelector(`article:nth-of-type(${index + 1}) .focusable`)

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true)
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false)
      }
      element.focus()
    }
  }

  setRef = (c) => {
    this.node = c
  }

  containerRef = (c) => {
    this.containerNode = c
  }

  render() {
    const {
      chatConversationId,
      chatMessageIds,
      isLoading,
      isPartial,
      hasMore,
      onScrollToBottom,
      onScroll,
    } = this.props
    const { isRefreshing } = this.state

    if (isPartial || (isLoading && chatMessageIds.size === 0)) {
      return null
    }

    let scrollableContent = []
    let emptyContent = []
    
    if (isLoading || chatMessageIds.size > 0) {
      for (let i = 0; i < chatMessageIds.count(); i++) {
        const chatMessageId = chatMessageIds.get(i)
        const lastChatMessageId = i > 0 ? chatMessageIds.get(i - 1) : null
        if (!chatMessageId) {
          scrollableContent.unshift(
            <div
              key={`chat-message-gap:${(i + 1)}`}
              disabled={isLoading}
              sinceId={i > 0 ? chatMessageIds.get(i - 1) : null}
              onClick={this.handleLoadMore}
            />
          )
        } else {          
          scrollableContent.unshift(
            <ChatMessageItem
              key={`chat-message-${chatConversationId}-${i}`}
              chatMessageId={chatMessageId}
              lastChatMessageId={lastChatMessageId}
              onMoveUp={this.handleMoveUp}
              onMoveDown={this.handleMoveDown}
              commentsLimited
            />
          )
        }
        
      }
    }

    return (
      <div
        className={[_s.d, _s.boxShadowNone, _s.posAbs, _s.bottom60PX, _s.left0, _s.right0, _s.px15, _s.py15, _s.top60PX, _s.w100PC, _s.overflowYScroll].join(' ')}
        ref={this.containerRef}
      >
        <ScrollableList
          scrollRef={this.setRef}
          onLoadMore={this.handleLoadMore && this.handleLoadOlder}
          scrollKey='chat_messages'
          hasMore={hasMore}
          emptyMessage='No chats found'
          onScrollToBottom={onScrollToBottom}
          onScroll={onScroll}
          isLoading={isLoading}
        >
          {scrollableContent}
        </ScrollableList>
      </div>
    )
  }

}

const mapStateToProps = (state, { chatConversationId }) => {
  if (!chatConversationId) return {}

  return {
    chatMessageIds: state.getIn(['chat_conversation_messages', chatConversationId, 'items'], ImmutableList()),
    isLoading: state.getIn(['chat_conversation_messages', chatConversationId, 'isLoading'], true),
    isPartial: state.getIn(['chat_conversation_messages', chatConversationId, 'isPartial'], false),
    hasMore: state.getIn(['chat_conversation_messages', chatConversationId, 'hasMore']),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onScrollToBottom: debounce(() => {
    dispatch(scrollBottomChatMessageConversation(ownProps.chatConversationId, true))
  }, 100),
  onScroll: debounce(() => {
    dispatch(scrollBottomChatMessageConversation(ownProps.chatConversationId, false))
  }, 100),
  onExpandChatMessages(chatConversationId, params) {
    dispatch(expandChatMessages(chatConversationId, params))
  },
  onSetChatConversationSelected: (chatConversationId) => {
    dispatch(setChatConversationSelected(chatConversationId))
  },
})

ChatMessageScrollingList.propTypes = {
  chatMessageIds: ImmutablePropTypes.list.isRequired,
  chatConversationId: PropTypes.string.isRequired,
  onExpandChatMessages: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isPartial: PropTypes.bool,
  hasMore: PropTypes.bool,
  onClearTimeline: PropTypes.func.isRequired,
  onScrollToTop: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageScrollingList)