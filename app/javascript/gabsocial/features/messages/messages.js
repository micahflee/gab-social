import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeGetAccount } from '../../selectors'
import Text from '../../components/text'
import Button from '../../components/button'
import Avatar from '../../components/avatar'
import DisplayName from '../../components/display_name'
import Input from '../../components/input'
import EmojiPickerButton from '../compose/components/emoji_picker_button'
import UploadButton from '../compose/components/media_upload_button'
import MessageItem from './components/message_item'

// import MessagesContainer from './containers/messages_container'

class Messages extends React.PureComponent {

  render () {
    const { account } = this.props
    
    const selectedMessage = true

    return (
      <div className={[_s.d, _s.bgPrimary, _s.h100PC, _s.w100PC].join(' ')}>
        {
          !selectedMessage &&
          <div className={[_s.d, _s.w100PC, _s.h100PC, _s.aiCenter, _s.jcCenter].join(' ')}>
            <Text weight='bold' size='extraLarge'>
              You don’t have a message selected
            </Text>
            <Text size='medium' color='secondary' className={_s.py10}>
              Choose one from your existing messages, or start a new one.
            </Text>
            <Button className={_s.mt10}>
              <Text color='inherit' weight='bold' className={_s.px15}>
                New Message
              </Text>
            </Button>
          </div>
        }
        {
          selectedMessage &&
          <div className={[_s.d, _s.h100PC, _s.w100PC].join(' ')}>
            <div className={[_s.d, _s.posAbs, _s.top0, _s.left0, _s.right0, _s.flexRow, _s.aiCenter, _s.h60PX, _s.w100PC, _s.borderBottom1PX, _s.borderColorSecondary, _s.px15, _s.py5].join(' ')}>
              <Avatar account={account} size={34} />
              <div className={[_s.d, _s.pl10, _s.maxW100PC86PX, _s.overflowHidden].join(' ')}>
                <DisplayName account={account} isMultiline />
              </div>
              <Button
                isNarrow
                onClick={undefined}
                color='brand'
                backgroundColor='none'
                className={_s.mlAuto}
                icon='more'
                iconSize='18px'
              />
            </div>

            <div className={[_s.d, _s.posAbs, _s.bottom60PX, _s.left0, _s.right0, _s.px15, _s.py15, _s.top60PX, _s.w100PC, _s.overflowYScroll].join(' ')}>
              <MessageItem />
              <MessageItem />
              <MessageItem alt />
              <MessageItem />
              <MessageItem alt />
              <MessageItem alt />
              <MessageItem />
              <MessageItem />
              <MessageItem />
              <MessageItem alt />
              <MessageItem />
            </div>
            
            <div className={[_s.d, _s.posAbs, _s.bottom0, _s.left0, _s.right0, _s.flexRow, _s.aiCenter, _s.h60PX, _s.w100PC, _s.borderTop1PX, _s.borderColorSecondary, _s.px15, _s.py5].join(' ')}>
              <EmojiPickerButton />
              <UploadButton />
              <div className={[_s.d, _s.px15, _s.flexGrow1].join(' ')}>
                <Input
                  placeholder='Type a message...'
                />
              </div>
              <Button>
                Send
              </Button>
            </div>
          </div>
        }
      </div>
    )
  }

}

const mapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, '1'),
})

Messages.propTypes = {
  intl: PropTypes.object.isRequired,
  selected: PropTypes.bool,
}

export default connect(mapStateToProps)(Messages)