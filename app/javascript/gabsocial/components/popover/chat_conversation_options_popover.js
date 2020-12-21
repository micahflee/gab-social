import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import { openModal } from '../../actions/modal'
import { hideChatConversation } from '../../actions/chat_conversations'
import { setChatConversationSelected } from '../../actions/chats'
import {
  muteChatConversation,
  unmuteChatConversation,
} from '../../actions/chat_conversation_accounts'
import { purgeChatMessages } from '../../actions/chat_messages'
import { MODAL_PRO_UPGRADE } from '../../constants'
import { me } from '../../initial_state'
import { makeGetChatConversation } from '../../selectors'
import { changeSetting, saveSettings } from '../../actions/settings'
import PopoverLayout from './popover_layout'
import List from '../list'

class ChatConversationOptionsPopover extends ImmutablePureComponent {

  handleOnHide = () => {
    this.props.onHide()
    this.handleOnClosePopover()
  }

  handleOnMute = () => {
    if (this.props.isMuted) {
      this.props.onUnmute()
    } else {
      this.props.onMute()
    }
    this.handleOnClosePopover()
  }

  handleOnPurge = () => {
    if (!this.props.isPro) {
      this.props.openProUpgradeModal()
    } else {
      this.props.onPurge()
    }

    this.handleOnClosePopover()
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      intl,
      isXS,
      isMuted,
      isChatConversationRequest,
    } = this.props

    const items = [
      {
        hideArrow: true,
        title: 'Hide Conversation',
        subtitle: 'Hide until next message',
        onClick: () => this.handleOnHide(),
      }
    ]
    if (!isChatConversationRequest) {
      items.push({
        hideArrow: true,
        title: isMuted ? 'Unmute Conversation' : 'Mute Conversation',
        subtitle: isMuted ? null : "Don't get notified of new messages",
        onClick: () => this.handleOnMute(),
      })
      items.push({})
      items.push({
        hideArrow: true,
        title: 'Purge messages',
        subtitle: 'Remove all of your messages in this conversation',
        onClick: () => this.handleOnPurge(),
      })
    }

    return (
      <PopoverLayout
        width={220}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          size={isXS ? 'large' : 'small'}
          scrollKey='chat_conversation_options'
          items={items}
        />
      </PopoverLayout>
    )
  }
}

const mapStateToProps = (state, { chatConversationId }) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
  isMuted: state.getIn(['chat_conversations', chatConversationId, 'is_muted']),
})

const mapDispatchToProps = (dispatch, { chatConversationId }) => ({
  openProUpgradeModal() {
    dispatch(openModal(MODAL_PRO_UPGRADE))
  },
  onPurge() {
    dispatch(purgeChatMessages(chatConversationId))
  },
  onHide() {
    dispatch(hideChatConversation(chatConversationId))
    dispatch(setChatConversationSelected(null))
  },
  onMute() {
    dispatch(muteChatConversation(chatConversationId))
  },
  onUnmute() {
    dispatch(unmuteChatConversation(chatConversationId))
  },
  onClosePopover() {
    dispatch(closePopover())
  },
})

ChatConversationOptionsPopover.propTypes = {
  isXS: PropTypes.bool,
  isPro: PropTypes.bool.isRequired,
  chatConversation: ImmutablePropTypes.map,
  isChatConversationRequest: PropTypes.bool,
  onClosePopover: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversationOptionsPopover)