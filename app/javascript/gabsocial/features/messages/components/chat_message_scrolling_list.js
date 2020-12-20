import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment-mini'
import throttle from 'lodash.throttle'
import { List as ImmutableList } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { createSelector } from 'reselect'
import debounce from 'lodash.debounce'
import { me } from '../../../initial_state'
import { CX, MOUSE_IDLE_DELAY } from '../../../constants'
import { setChatConversationSelected } from '../../../actions/chats'
import {
  expandChatMessages,
  scrollBottomChatMessageConversation,
} from '../../../actions/chat_conversation_messages'
import { readChatConversation } from '../../../actions/chat_conversations'
import IntersectionObserverArticle from '../../../components/intersection_observer_article'
import IntersectionObserverWrapper from '../../ui/util/intersection_observer_wrapper'
import ChatMessagePlaceholder from '../../../components/placeholder/chat_message_placeholder'
import ChatMessageItem from './chat_message_item'
import ColumnIndicator from '../../../components/column_indicator'
import LoadMore from '../../../components/load_more'

class ChatMessageScrollingList extends ImmutablePureComponent {

  state = {
    isRefreshing: false,
  }

  intersectionObserverWrapper = new IntersectionObserverWrapper()

  mouseIdleTimer = null
  mouseMovedRecently = false
  lastScrollWasSynthetic = false
  scrollToTopOnMouseIdle = false

  componentDidMount () {
    const { chatConversationId } = this.props
    this.props.onExpandChatMessages(chatConversationId)
    this.scrollToBottom()
  }

  componentWillUnmount() {
    this.props.onSetChatConversationSelected(null)
    this.detachScrollListener()
    this.detachIntersectionObserver()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.chatConversationId !== this.props.chatConversationId) {
      this.props.onExpandChatMessages(this.props.chatConversationId)
    }
    
    // Reset the scroll position when a new child comes in in order not to
    // jerk the scrollbar around if you're already scrolled down the page.
    if (snapshot !== null && this.scrollContainerRef) {
      this.setScrollTop(this.scrollContainerRef.scrollHeight - snapshot)
    }

    if (this.state.isRefreshing) {
      this.setState({ isRefreshing: false })
    }

    if (prevProps.chatMessageIds.size === 0 && this.props.chatMessageIds.size > 0 && this.scrollContainerRef) {
      this.scrollToBottom()
      this.props.onReadChatConversation(this.props.chatConversationId)
    } else if (prevProps.chatMessageIds.size < this.props.chatMessageIds.size && this.scrollContainerRef) {
      // this.setScrollTop(this.scrollContainerRef.scrollHeight)
    }
  }

  attachScrollListener() {
    if (!this.scrollContainerRef) return
    this.scrollContainerRef.addEventListener('scroll', this.handleScroll)
    this.scrollContainerRef.addEventListener('wheel', this.handleWheel)
  }

  detachScrollListener() {
    if (!this.scrollContainerRef) return
    this.scrollContainerRef.removeEventListener('scroll', this.handleScroll)
    this.scrollContainerRef.removeEventListener('wheel', this.handleWheel)
  }

  attachIntersectionObserver() {
    this.intersectionObserverWrapper.connect()
  }

  detachIntersectionObserver() {
    this.intersectionObserverWrapper.disconnect()
  }

  onLoadMore = (maxId) => {
    const { chatConversationId } = this.props
    this.props.onExpandChatMessages(chatConversationId, { maxId })
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

  setScrollTop = (newScrollTop) => {
    if (!this.scrollContainerRef) return
    if (this.scrollContainerRef.scrollTop !== newScrollTop) {
      this.lastScrollWasSynthetic = true
      console.log("newScrollTop:", newScrollTop)
      this.scrollContainerRef.scrollTop = newScrollTop
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }
  
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

  handleLoadOlder = debounce(() => {
    const maxId = this.props.chatMessageIds.size > 0 ? this.props.chatMessageIds.last() : undefined
    this.onLoadMore(maxId)
  }, 300, { leading: true })

  handleScroll = throttle(() => {
    if (this.scrollContainerRef) {
      const { offsetHeight, scrollTop, scrollHeight } = this.scrollContainerRef
      const offset = scrollHeight - scrollTop - offsetHeight

      if (scrollTop < 100 && this.props.hasMore && !this.props.isLoading) {
        this.handleLoadOlder()
      }

      if (offset < 100) {
        this.props.onScrollToBottom()
      }

      if (!this.lastScrollWasSynthetic) {
        // If the last scroll wasn't caused by setScrollTop(), assume it was
        // intentional and cancel any pending scroll reset on mouse idle
        this.scrollToTopOnMouseIdle = false
      }
      this.lastScrollWasSynthetic = false
    }
  }, 150, {
    trailing: true,
  })

  handleWheel = throttle(() => {
    this.scrollToTopOnMouseIdle = false
    this.handleScroll()
  }, 150, {
    trailing: true,
  })

  clearMouseIdleTimer = () => {
    if (this.mouseIdleTimer === null) return

    clearTimeout(this.mouseIdleTimer)
    this.mouseIdleTimer = null
  }

  handleMouseMove = throttle(() => {
    // As long as the mouse keeps moving, clear and restart the idle timer.
    this.clearMouseIdleTimer()
    this.mouseIdleTimer = setTimeout(this.handleMouseIdle, MOUSE_IDLE_DELAY)

    // Only set if we just started moving and are scrolled to the top.
    if (!this.mouseMovedRecently && this.scrollContainerRef.scrollTop === 0) {
      this.scrollToTopOnMouseIdle = true
    }

    // Save setting this flag for last, so we can do the comparison above.
    this.mouseMovedRecently = true
  }, MOUSE_IDLE_DELAY / 2)

  handleMouseIdle = () => {
    if (this.scrollToTopOnMouseIdle) {
      this.setScrollTop(this.scrollContainerRef.scrollHeight)
    }

    this.mouseMovedRecently = false
    this.scrollToTopOnMouseIdle = false
  }

  getSnapshotBeforeUpdate(prevProps) {
    const someItemInserted = prevProps.chatMessageIds.size > 0 &&
      prevProps.chatMessageIds.size < this.props.chatMessageIds.size &&
      prevProps.chatMessageIds.get(prevProps.chatMessageIds.size - 1) !== this.props.chatMessageIds.get(this.props.chatMessageIds.size - 1)

    if (someItemInserted && (this.scrollContainerRef.scrollTop > 0 || this.mouseMovedRecently)) {
      return this.scrollContainerRef.scrollHeight - this.scrollContainerRef.scrollTop
    }

    return null
  }
  
  setRef = (c) => {
    this.node = c
  }

  containerRef = (c) => {
    this.containerNode = c
  }

  setScrollContainerRef = (c) => {
    this.scrollContainerRef = c

    this.attachScrollListener()
    this.attachIntersectionObserver()
    // Handle initial scroll posiiton
    this.handleScroll()
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
      isXS,
    } = this.props
    const { isRefreshing } = this.state

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
              maxId={i > 0 ? chatMessageIds.get(i - 1) : null}
              onClick={this.handleLoadOlder}
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
            />
          )
        }
        
      }
    }

    const childrenCount = React.Children.count(scrollableContent)
    if (isLoading || childrenCount > 0 || hasMore) {
      const containerClasses = CX({
        d: 1,
        bgPrimary: 1,
        boxShadowNone: 1,
        posAbs: !isXS,
        bottom60PX: !isXS,
        left0: !isXS,
        right0: !isXS,
        top60PX: !isXS,
        w100PC: 1,
        overflowHidden: 1,
      })
      return (
        <div
          onMouseMove={this.handleMouseMove}
          className={containerClasses}
          ref={this.containerRef}
        >
          <div
            className={[_s.d, _s.h100PC, _s.w100PC, _s.px15, _s.py15, _s.overflowYScroll].join(' ')}
            ref={this.setScrollContainerRef}
          >
            {
              (hasMore && !isLoading) &&
              <LoadMore onClick={this.handleLoadOlder} />
            }

            {
              isLoading &&
              <ColumnIndicator type='loading' />
            }
            
            <div role='feed'>
              {
                !!scrollableContent &&
                scrollableContent.map((child, index) => (
                  <IntersectionObserverArticle
                    key={`chat_message:${chatConversationId}:${index}`}
                    id={`chat_message:${chatConversationId}:${index}`}
                    index={index}
                    listLength={childrenCount}
                    intersectionObserverWrapper={this.intersectionObserverWrapper}
                    saveHeightKey={`chat_messages:${chatConversationId}:${index}`}
                  >
                    {child}
                  </IntersectionObserverArticle>
                ))
              }
              <div
                style={{ float: 'left', clear: 'both' }}
                ref={(el) => { this.messagesEnd = el }}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={[_s.d, _s.boxShadowNone, _s.posAbs, _s.bottom60PX, _s.left0, _s.right0, _s.top60PX, _s.w100PC, _s.overflowHidden].join(' ')}>
        <div className={[_s.d, _s.h100PC, _s.w100PC, _s.px15, _s.py15, _s.overflowYScroll].join(' ')}>
          <ColumnIndicator type='error' message='No chat messages found' />
        </div>
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
  onReadChatConversation(chatConversationId) {
    dispatch(readChatConversation(chatConversationId))
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
  isXS: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageScrollingList)