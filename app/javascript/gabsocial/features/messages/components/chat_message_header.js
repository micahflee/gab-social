import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { makeGetChatConversation } from '../../../selectors'
import { openPopover } from '../../../actions/popover'
import { approveChatConversationRequest } from '../../../actions/chat_conversations'
import {
  POPOVER_CHAT_CONVERSATION_OPTIONS
} from '../../../constants'
import Button from '../../../components/button'
import AvatarGroup from '../../../components/avatar_group'
import DisplayName from '../../../components/display_name'
import Text from '../../../components/text'

class ChatMessageHeader extends React.PureComponent {

  handleOnApproveMessageRequest = () => {
    this.props.onApproveChatConversationRequest(this.props.chatConversationId)
  }

  handleOnOpenChatConversationOptionsPopover = () => {
    const isChatConversationRequest = !!this.props.chatConversation ? !this.props.chatConversation.get('is_approved') : false
    this.props.onOpenChatConversationOptionsPopover({
      isChatConversationRequest,
      chatConversationId: this.props.chatConversationId,
      targetRef: this.optionsBtnRef,
    })
  }

  setOptionsBtnRef = (c) => {
    this.optionsBtnRef = c
  }

  render () {
    const { chatConversation } = this.props
    
    const isChatConversationRequest = !!chatConversation ? !chatConversation.get('is_approved') : false
    const otherAccounts = !!chatConversation ? chatConversation.get('other_accounts') : null

    return (
      <div className={[_s.d, _s.posAbs, _s.top0, _s.left0, _s.right0, _s.flexRow, _s.aiCenter, _s.h60PX, _s.w100PC, _s.borderBottom1PX, _s.borderColorSecondary, _s.bgPrimary, _s.px15, _s.py5].join(' ')}>

        {
          !!otherAccounts &&
          <React.Fragment>
            <AvatarGroup accounts={otherAccounts} size={34} noHover />
            <div className={[_s.d, _s.pl10, _s.maxW100PC86PX, _s.overflowHidden].join(' ')}>
              <DisplayName account={otherAccounts.get(0)} isMultiline />
            </div>
          </React.Fragment>
        }
        <Button
          buttonRef={this.setOptionsBtnRef}
          isNarrow
          onClick={this.handleOnOpenChatConversationOptionsPopover}
          color='primary'
          backgroundColor='secondary'
          className={[_s.mlAuto, _s.px5].join(' ')}
          icon='ellipsis'
          iconSize='18px'
        />
        {
          isChatConversationRequest &&
          <Button
            isNarrow
            onClick={this.handleOnApproveMessageRequest}
            className={_s.ml10}
          >
            <Text color='inherit'>
              Approve Message Request
            </Text>
          </Button>
        }
      </div>
    )
  }

}

const mapStateToProps = (state, { chatConversationId }) => ({
  chatConversation: makeGetChatConversation()(state, { id: chatConversationId }),
})

const mapDispatchToProps = (dispatch) => ({
  onApproveChatConversationRequest(chatConversationId) {
    dispatch(approveChatConversationRequest(chatConversationId))
  },
  onOpenChatConversationOptionsPopover(options) {
    dispatch(openPopover(POPOVER_CHAT_CONVERSATION_OPTIONS, {
      ...options,
      position: 'left-end',
    }))
  },
})

ChatMessageHeader.propTypes = {
  chatConversationId: PropTypes.string,
  onApproveChatConversationRequest: PropTypes.func.isRequired,
  onOpenChatConversationOptionsPopover: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageHeader)