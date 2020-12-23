import React from 'react'
import PropTypes from 'prop-types'
import BlockHeading from '../components/block_heading'
import ChatConversationsList from './messages/components/chat_conversations_list'

class ChatConversationRequests extends React.PureComponent {

  render() {
    return (
      <div className={[_s.d, _s.w100PC, _s.h100PC, _s.overflowHidden, _s.boxShadowNone].join(' ')}>
        <div className={[_s.d, _s.h60PX, _s.w100PC, _s.px10, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <BlockHeading title={'Message Requests'} />
        </div>
        <div className={[_s.d, _s.posAbs, _s.top60PX, _s.left0, _s.right0, _s.bottom0, _s.overflowYScroll].join(' ')}>
          <ChatConversationsList source='requested' />
        </div>
      </div>
    )
  }

}

export default ChatConversationRequests