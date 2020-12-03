import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { makeGetChatConversation } from '../../../selectors'
import { setChatConversationSelected } from '../../../actions/chats'
import { CX } from '../../../constants'
import Input from '../../../components/input'
import DisplayNameGroup from '../../../components/display_name_group'
import DisplayName from '../../../components/display_name'
import AvatarGroup from '../../../components/avatar_group'
import Text from '../../../components/text'
import RelativeTimestamp from '../../../components/relative_timestamp'

class ChatConversationsListItem extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  handleOnClick = () => {
    const { chatConversationId } = this.props
    this.props.onSetChatConversationSelected(chatConversationId)
    this.context.router.history.push(`/messages/${chatConversationId}`)
  }

  render() {
    const {
      selected,
      selectedId,
      chatConversation,
      chatConversationId,
    } = this.props

    if (!chatConversation) return <div/>

    const containerClasses = CX({
      d: 1,
      w100PC: 1,
      bgTransparent: 1,
      bgSubtle_onHover: 1,
      borderBottom1PX: 1,
      borderColorSecondary: 1,
      noUnderline: 1,
      outlineNone: 1,
      cursorPointer: 1,
    })

    const innerContainerClasses = CX({
      d: 1,
      flexRow: 1,
      aiStart: 1,
      aiCenter: 0,
      px15: 1,
      py15: 1,
      borderRight4PX: selected,
      borderColorBrand: selected,
    })

    const avatarSize = 46
    const otherAccounts = chatConversation.get('other_accounts')
    const lastMessage = chatConversation.get('last_chat_message', null)
    const content = { __html: !!lastMessage ? lastMessage.get('text', '') : '' }
    const date = !!lastMessage ? lastMessage.get('created_at') : chatConversation.get('created_at')

    return (
      <button
        className={containerClasses}
        onClick={this.handleOnClick}
      >
        <div className={innerContainerClasses}>
          <AvatarGroup accounts={otherAccounts} size={avatarSize} noHover />

          <div className={[_s.d, _s.pl10, _s.overflowHidden, _s.flexNormal].join(' ')}>
            <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
              <div className={[_s.d, _s.pt2, _s.pr5, _s.noUnderline, _s.overflowHidden, _s.flexNormal, _s.flexRow, _s.aiStart, _s.aiCenter].join(' ')}>
                <div className={_s.maxW100PC42PX}>
                  <DisplayName account={otherAccounts.get(0)} noHover />
                </div>
                <Text size='extraSmall' color='secondary' className={_s.mlAuto}>
                  <RelativeTimestamp timestamp={date} />
                </Text>
              </div>
            </div>

            <div className={[_s.py5, _s.dangerousContent, _s.textAlignLeft].join(' ')} dangerouslySetInnerHTML={content} />
          </div>
        </div>
      </button>
    )
  }

}

const mapStateToProps = (state, { chatConversationId }) => ({
  chatConversation: makeGetChatConversation()(state, { id: chatConversationId }),
  selectedId: state.getIn(['chats', 'selectedChatConversationId'], null),
  selected: state.getIn(['chats', 'selectedChatConversationId'], null) === chatConversationId,
})

const mapDispatchToProps = (dispatch) => ({
  onSetChatConversationSelected: (chatConversationId) => {
    dispatch(setChatConversationSelected(chatConversationId))
  },
})

ChatConversationsListItem.propTypes = {
  chatConversationId: PropTypes.string.isRequired,
  chatConversation: ImmutablePropTypes.map,
  onSetChatConversationSelected: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  source: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversationsListItem)