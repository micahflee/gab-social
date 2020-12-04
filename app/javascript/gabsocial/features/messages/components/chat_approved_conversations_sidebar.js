import React from 'react'
import PropTypes from 'prop-types'
import ResponsiveClassesComponent from '../../ui/util/responsive_classes_component'
import ChatConversationsSearch from './chat_conversations_search'
import ChatConversationsList from './chat_conversations_list'
import ChatConversationRequestsListItem from './chat_conversations_requests_list_item'

class ChatApprovedConversationsSidebar extends React.PureComponent {

  render() {
    const { source } = this.props

    return (
      <ResponsiveClassesComponent
        classNames={[_s.d, _s.w340PX, _s.h100PC, _s.bgPrimary, _s.borderLeft1PX, _s.borderRight1PX, _s.borderColorSecondary].join(' ')}
        classNamesSmall={[_s.d, _s.w300PX, _s.h100PC, _s.bgPrimary, _s.borderLeft1PX, _s.borderRight1PX, _s.borderColorSecondary].join(' ')}
        classNamesXS={[_s.d, _s.w100PC, _s.h100PC, _s.overflowYScroll, _s.bgPrimary].join(' ')}
      >
        <div className={[_s.d, _s.h100PC, _s.overflowHidden, _s.w100PC, _s.boxShadowNone].join(' ')}>
          <ChatConversationsSearch />
          <ResponsiveClassesComponent
            classNames={[_s.d, _s.w100PC, _s.posAbs, _s.bottom0, _s.top60PX, _s.overflowYScroll].join(' ')}
            classNamesXS={[_s.d, _s.w100PC].join(' ')}
          >
            <ChatConversationRequestsListItem />
            <ChatConversationsList source={source} />
          </ResponsiveClassesComponent>
        </div>
      </ResponsiveClassesComponent>
    )
  }

}

ChatApprovedConversationsSidebar.propTypes = {
  source: PropTypes.string,
}

export default ChatApprovedConversationsSidebar