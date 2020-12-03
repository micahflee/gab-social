import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { openModal } from '../../../actions/modal'
import { sendChatMessage } from '../../../actions/chat_messages'
import { CX } from '../../../constants'
import Button from '../../../components/button'
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

  onChange = (e) => {
    this.setState({ value: e.target.value })
  }

  onBlur = () => {
    this.setState({ focused: false });
  }

  onFocus = () => {
    this.setState({ focused: true });
  }

  onKeyDown = (e) => {
    const { disabled } = this.props;

    if (disabled) {
      e.preventDefault();
      return;
    }

    // Ignore key events during text composition
    // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
    if (e.which === 229 || e.isComposing) return;

    switch (e.key) {
    case 'Escape':
      document.querySelector('#gabsocial').focus()
      break;
    case 'Enter':
    case 'Tab':
      // 
      break;
    }

    // if (e.defaultPrevented || !this.props.onKeyDown) return;
  }

  setTextbox = (c) => {
    this.textbox = c
  }

  render () {
    const { chatConversationId } = this.props
    const { value } = this.state
    const disabled = false

    const textareaContainerClasses = CX({
      d: 1,
      maxW100PC: 1,
      flexGrow1: 1,
      jcCenter: 1,
      py5: 1,
    })

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
      borderColorSecondary: 1,
      border1PX: 1,
      radiusRounded: 1,
      py10: 1,
    })

    return (
      <div className={[_s.d, _s.posAbs, _s.bottom0, _s.left0, _s.right0, _s.flexRow, _s.aiCenter, _s.minH58PX, _s.bgPrimary, _s.w100PC, _s.borderTop1PX, _s.borderColorSecondary, _s.px15].join(' ')}>
        <div className={[_s.d, _s.pr15, _s.flexGrow1, _s.py10].join(' ')}>
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
          />
        </div>
        <div className={[_s.d, _s.h100PC, _s.aiCenter, _s.jcCenter].join(' ')}>
          <Button
            disabled={disabled}
            onClick={this.handleOnSendChatMessage}
          >
            <Text color='inherit' className={_s.px10}>Send</Text>
          </Button>
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onSendChatMessage(text, chatConversationId) {
    dispatch(sendChatMessage(text, chatConversationId))
  },
})

ChatMessagesComposeForm.propTypes = {
  chatConversationId: PropTypes.string,
  onSendMessage: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(ChatMessagesComposeForm)