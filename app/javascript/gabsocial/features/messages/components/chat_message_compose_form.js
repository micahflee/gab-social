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
    this.setState({ focused: false })
  }

  onFocus = () => {
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
    const { isXS, chatConversationId } = this.props
    const { value } = this.state
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
      <button
        ref={this.setExpiresBtn}
        className={[_s.d, _s.bgSubtle, _s.borderRight1PX, _s.borderColorSecondary, _s.w40PX, _s.h100PC, _s.aiCenter, _s.jcCenter, _s.cursorPointer, _s.outlineNone].join(' ')}
        onClick={this.handleOnExpire}
      >
        <Icon id='stopwatch' className={[_s.cPrimary, _s.ml2].join(' ')} size='15px' />
      </button>
    )

    if (isXS) {
      return (
        <div className={[_s.d, _s.z4, _s.minH58PX, _s.w100PC].join(' ')}>
          <div className={[_s.d, _s.minH58PX, _s.bgPrimary, _s.aiCenter, _s.z3, _s.bottom0, _s.right0, _s.left0, _s.posFixed].join(' ')} >
            <div className={[_s.d, _s.w100PC, _s.pb5, _s.px15, _s.aiCenter, _s.jcCenter, _s.saveAreaInsetPB, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w100PC].join(' ')}>
              <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.minH58PX, _s.w100PC, _s.borderTop1PX, _s.borderColorSecondary, _s.px10].join(' ')}>
                <div className={[_s.d, _s.flexRow, _s.radiusRounded, _s.border1PX, _s.borderColorSecondary, _s.overflowHidden].join(' ')}>
                  <div className={_s.d}>  
                    {expiresBtn}
                  </div>
                  <div className={[_s.d, _s.flexGrow1].join(' ')}>
                    {textarea}
                  </div>
                </div>
                <div className={[_s.d, _s.h100PC, _s.aiCenter, _s.jcCenter].join(' ')}>
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

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
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