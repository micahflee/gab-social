import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { openPopover } from '../../../actions/popover'
import { modal } from '../../../actions/modal'
import { sendChatMessage } from '../../../actions/chat_messages'
import { me } from '../../../initial_state'
import {
  CX,
  MODAL_PRO_UPGRADE,
  POPOVER_CHAT_CONVERSATION_EXPIRATION_OPTIONS,
} from '../../../constants'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
import Input from '../../../components/input'
import Text from '../../../components/text'

class ChatMessagesComposeForm extends React.PureComponent {

  state = {
    focused: false,
    value: '',
  }

  handleOnSendChatMessage = () => {
    this.props.onSendChatMessage(this.state.value, this.props.chatConversationId)
    // document.querySelector('#gabsocial').focus()
    this.onFocus()
    this.setState({ value: '' })
  }

  handleOnExpire = () => {
    if (this.props.isPro) {
      this.props.onShowExpirePopover(this.expiresBtn)
    } else {
      this.props.onShowProModal()
    }
  }

  onChange = (e) => {
    this.setState({ value: e.target.value })
  }

  onBlur = () => {
    console.log("onBlur")
    this.setState({ focused: false })
  }

  onFocus = () => {
    console.log("onFocus")
    this.setState({ focused: true })
  }

  onKeyDown = (e) => {
    const { disabled } = this.props

    if (disabled) return e.preventDefault()

    // Ignore key events during text composition
    // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
    if (e.which === 229) return

    switch (e.key) {
    case 'Escape':
      document.querySelector('#gabsocial').focus()
      break
    case 'Enter':
      this.handleOnSendChatMessage()
      return e.preventDefault()
    case 'Tab':
      this.sendBtn.focus()
      return e.preventDefault()
      break
    }

    if (e.defaultPrevented) return
  }

  setTextbox = (c) => {
    this.textbox = c
  }

  setSendBtn = (c) => {
    this.sendBtn = c
  }

  setExpiresBtn = (c) => {
    this.expiresBtn = c
  }

  render () {
    const {
      isXS,
      expiresAtValue,
      chatConversationId,
    } = this.props
    const { focused, value } = this.state
    const disabled = false

    const textareaClasses = CX({
      d: 1,
      font: 1,
      wrap: 1,
      resizeNone: 1,
      bgTransparent: 1,
      outlineNone: 1,
      lineHeight125: 1,
      cPrimary: 1,
      px10: 1,
      fs14PX: 1,
      maxH200PX: 1,
      w100PC: 1,
      py10: 1,
    })

    const expireBtnClasses = CX({
      d: 1,
      borderRight1PX: 1,
      borderColorSecondary: 1,
      w40PX: 1,
      h100PC: 1,
      aiCenter: 1,
      jcCenter: 1,
      cursorPointer: 1,
      outlineNone: 1,
      bgSubtle: !expiresAtValue,
      bgBlack: !!expiresAtValue,
    })

    const expireBtnIconClassName = !!expiresAtValue ?  _s.cWhite : _s.cBlack

    const textarea = (
      <Textarea
        id='chat-message-compose-input'
        inputRef={this.setTextbox}
        className={textareaClasses}
        disabled={disabled}
        placeholder='Type a new message...'
        autoFocus={false}
        value={value}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        focused={focused}
        aria-autocomplete='list'
        maxLength={1600}
      />
    )

    const button = (
      <Button
        buttonRef={this.setSendBtn}
        disabled={disabled}
        onClick={this.handleOnSendChatMessage}
      >
        <Text color='inherit' weight='medium' className={isXS ? undefined : _s.px10}>Send</Text>
      </Button>
    )

    const expiresBtn = (
      <Button
        noClasses
        buttonRef={this.setExpiresBtn}
        className={expireBtnClasses}
        onClick={this.handleOnExpire}
        icon='stopwatch'
        iconSize='15px'
        iconClassName={expireBtnIconClassName}
      />
    )

    if (isXS) {
      return (
        <div className={[_s.d, _s.z4, _s.minH58PX, _s.w100PC, _s.mtAuto].join(' ')}>
          <div className={[_s.d, _s.minH58PX, _s.bgPrimary, _s.aiCenter, _s.z3, _s.bottom0, _s.right0, _s.left0, _s.posFixed].join(' ')} >
            <div className={[_s.d, _s.w100PC, _s.pb5, _s.px15, _s.aiCenter, _s.jcCenter, _s.saveAreaInsetPB, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w100PC].join(' ')}>
              <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.minH58PX, _s.w100PC, _s.borderTop1PX, _s.borderColorSecondary, _s.px10].join(' ')}>
                <div className={[_s.d, _s.flexRow, _s.flexGrow1, _s.radiusRounded, _s.border1PX, _s.borderColorSecondary, _s.overflowHidden].join(' ')}>
                  <div className={_s.d}>  
                    {expiresBtn}
                  </div>
                  <div className={[_s.d, _s.flexGrow1].join(' ')}>
                    {textarea}
                  </div>
                </div>
                <div className={[_s.d, _s.pl10, _s.h100PC, _s.aiCenter, _s.jcCenter].join(' ')}>
                  {button}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={[_s.d, _s.posAbs, _s.bottom0, _s.left0, _s.right0, _s.flexRow, _s.aiCenter, _s.minH58PX, _s.bgPrimary, _s.w100PC, _s.borderTop1PX, _s.borderColorSecondary, _s.px15].join(' ')}>
        <div className={[_s.d, _s.pr15, _s.flexGrow1, _s.py10].join(' ')}>
          <div className={[_s.d, _s.flexRow, _s.radiusRounded, _s.border1PX, _s.borderColorSecondary, _s.overflowHidden].join(' ')}>
            <div className={_s.d}>  
              {expiresBtn}
            </div>
            <div className={[_s.d, _s.flexGrow1].join(' ')}>
              {textarea}
            </div>
          </div>
        </div>
        <div className={[_s.d, _s.h100PC, _s.mtAuto, _s.mb10, _s.aiCenter, _s.jcCenter].join(' ')}>
          {button}
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state, { chatConversationId }) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
  expiresAtValue: state.getIn(['chat_conversations', chatConversationId, 'chat_message_expiration_policy']),
})

const mapDispatchToProps = (dispatch, { chatConversationId }) => ({
  onSendChatMessage(text, chatConversationId) {
    dispatch(sendChatMessage(text, chatConversationId))
  },
  onShowProModal() {
    dispatch(openModal(MODAL_PRO_UPGRADE))
  },
  onShowExpirePopover(targetRef) {
    dispatch(openPopover(POPOVER_CHAT_CONVERSATION_EXPIRATION_OPTIONS, {
      targetRef,
      chatConversationId,
      position: 'top',
    }))
  }
})

ChatMessagesComposeForm.propTypes = {
  chatConversationId: PropTypes.string,
  isXS: PropTypes.bool,
  isPro: PropTypes.bool,
  onSendChatMessage: PropTypes.func.isRequired,
  onShowExpirePopover: PropTypes.func.isRequired,
  onShowProModal: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessagesComposeForm)