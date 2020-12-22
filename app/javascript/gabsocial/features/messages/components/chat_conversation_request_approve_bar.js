import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openPopover } from '../../../actions/popover'
import { approveChatConversationRequest } from '../../../actions/chat_conversations'
import {
  POPOVER_CHAT_CONVERSATION_OPTIONS
} from '../../../constants'
import Button from '../../../components/button'
import Text from '../../../components/text'

class ChatConversationRequestApproveBar extends React.PureComponent {

  handleOnApproveMessageRequest = () => {
    this.props.onApproveChatConversationRequest(this.props.chatConversationId)
  }

  setOptionsBtnRef = (c) => {
    this.optionsBtnRef = c
  }

  render () {
    if (!chatConversationId) return null
    
    return (
      <div className={[_s.d, _s.z4, _s.minH53PX, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.minH53PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.bottom0, _s.right0, _s.left0, _s.posFixed].join(' ')} >
          <div className={[_s.d, _s.w100PC, _s.pt15, _s.px15, _s.aiCenter, _s.jcCenter, _s.saveAreaInsetPB, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w100PC].join(' ')}>
            <Button
              isNarrow
              onClick={this.handleOnApproveMessageRequest}
            >
              <Text color='inherit' align='center'>
                Approve Message Request
              </Text>
            </Button>
          </div>
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onApproveChatConversationRequest(chatConversationId) {
    dispatch(approveChatConversationRequest(chatConversationId))
  },
  onOpenChatConversationOptionsPopover(chatConversationId, targetRef) {
    dispatch(openPopover(POPOVER_CHAT_CONVERSATION_OPTIONS, {
      chatConversationId,
      targetRef,
      position: 'bottom',
    }))
  },
})

ChatConversationRequestApproveBar.propTypes = {
  chatConversationId: PropTypes.string,
  onApproveChatConversationRequest: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(ChatConversationRequestApproveBar)