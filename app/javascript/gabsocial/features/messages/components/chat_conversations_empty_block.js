import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openModal } from '../../../actions/modal'
import { MODAL_CHAT_CONVERSATION_CREATE } from '../../../constants'
import Text from '../../../components/text'
import Button from '../../../components/button'

class ChatEmptyMessageBlock extends React.PureComponent {

  handleOnCreateNewChat = () => {
    this.props.onOpenChatConversationCreateModal()
  }

  render () {
    return (
      <div className={[_s.d, _s.bgPrimary, _s.h100PC, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.w100PC, _s.h100PC, _s.aiCenter, _s.jcCenter].join(' ')}>
          <Text weight='bold' size='extraLarge'>
            You don’t have a message selected
          </Text>
          <Text size='medium' color='secondary' className={_s.py10}>
            Choose one from your existing messages, or start a new one.
          </Text>
          <Button className={_s.mt10} onClick={this.handleOnCreateNewChat}>
            <Text color='inherit' weight='bold' className={_s.px15}>
              New Message
            </Text>
          </Button>
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onOpenChatConversationCreateModal() {
    dispatch(openModal(MODAL_CHAT_CONVERSATION_CREATE))
  }
})

ChatEmptyMessageBlock.propTypes = {
  onOpenChatConversationCreateModal: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(ChatEmptyMessageBlock)