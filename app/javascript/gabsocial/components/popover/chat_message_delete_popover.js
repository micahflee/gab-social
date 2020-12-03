import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import { deleteChatMessage } from '../../actions/chat_messages'
import PopoverLayout from './popover_layout'
import Button from '../button'
import Text from '../text'

class ChatMessageDeletePopover extends React.PureComponent {

  handleOnClick = () => {
    this.props.onDeleteChatMessage(this.props.chatMessageId)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { isXS } = this.props

    return (
      <PopoverLayout
        width={96}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <Button
          onClick={this.handleOnClick}
          color='primary'
          backgroundColor='tertiary'
          className={[_s.radiusSmall].join(' ')}
        >
          <Text align='center' color='inherit'>Remove</Text>
        </Button>
      </PopoverLayout>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  onDeleteChatMessage(chatMessageId) {
    dispatch(deleteChatMessage(chatMessageId))
  },
})

ChatMessageDeletePopover.propTypes = {
  isXS: PropTypes.bool,
  chatMessageId: PropTypes.string.isRequired,
  onDeleteChatMessage: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(ChatMessageDeletePopover)