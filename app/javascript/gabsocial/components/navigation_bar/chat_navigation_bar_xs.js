import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { makeGetChatConversation } from '../../selectors'
import { openPopover } from '../../actions/popover'
import { setChatConversationSelected } from '../../actions/chats'
import { POPOVER_CHAT_CONVERSATION_OPTIONS } from '../../constants'
import Heading from '../heading'
import Button from '../button'
import BackButton from '../back_button'
import Text from '../text'
import AvatarGroup from '../avatar_group'

class ChatNavigationBar extends React.PureComponent {

  handleOnOpenChatConversationOptionsPopover = () => {
    this.props.onOpenChatConversationOptionsPopover(this.props.chatConversationId, this.optionsBtnRef)
  }

  handleOnBack = () => {
    this.props.onSetChatConversationSelectedEmpty()
  }

  setOptionsBtnRef = (c) => {
    this.optionsBtnRef = c
  }

  render() {
    const { chatConversation } = this.props

    const otherAccounts = chatConversation ? chatConversation.get('other_accounts') : null
    const nameHTML = !!otherAccounts ? otherAccounts.get(0).get('display_name_html') : ''

    return (
      <div className={[_s.d, _s.z4, _s.h53PX, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.h53PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >

          <div className={[_s.d, _s.flexRow, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w100PC].join(' ')}>

            <BackButton
              className={[_s.h53PX, _s.pl10, _s.pr10].join(' ')}
              iconSize='18px'
              onClick={this.handleOnBack}
              iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
            />

            <div className={[_s.d, _s.h53PX, _s.flexRow, _s.jcCenter, _s.aiCenter, _s.mrAuto].join(' ')}>
              <AvatarGroup accounts={otherAccounts} size={35} noHover />
              <Heading size='h1'>
                <div className={[_s.dangerousContent, _s.colorNavigation, _s.pl10, _s.fs19PX].join(' ')} dangerouslySetInnerHTML={{ __html: nameHTML }} />
              </Heading>
            </div>

            <div className={[_s.d, _s.h53PX, _s.mlAuto, _s.aiCenter, _s.jcCenter, _s.mr15].join(' ')}>
              <Button
                isNarrow
                backgroundColor='tertiary'
                color='primary'
                onClick={this.handleOnOpenChatConversationOptionsPopover}
                className={[_s.px5].join(' ')}
                icon='ellipsis'
                iconClassName={[_s.cSecondary, _s.px5, _s.py5].join(' ')}
                iconSize='15px'
              />
            </div>

          </div>

        </div>
      </div>
    )
  }

}

const mapStateToProps = (state, { chatConversationId }) => ({
  chatConversation: makeGetChatConversation()(state, { id: chatConversationId }),
})

const mapDispatchToProps = (dispatch) => ({
  onSetChatConversationSelectedEmpty() {
    dispatch(setChatConversationSelected(null))
  },
  onOpenChatConversationOptionsPopover(chatConversationId, targetRef) {
    dispatch(openPopover(POPOVER_CHAT_CONVERSATION_OPTIONS, {
      chatConversationId,
      targetRef,
      position: 'bottom',
    }))
  },
})

ChatNavigationBar.propTypes = {
  chatConversation: ImmutablePropTypes.map,
  chatConversationId: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatNavigationBar)