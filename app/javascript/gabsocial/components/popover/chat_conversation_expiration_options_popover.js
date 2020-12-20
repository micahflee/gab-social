import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { closePopover } from '../../actions/popover'
import { setChatConversationExpiration } from '../../actions/chat_conversations'
import {
  EXPIRATION_OPTION_5_MINUTES,
  EXPIRATION_OPTION_1_HOUR,
  EXPIRATION_OPTION_6_HOURS,
  EXPIRATION_OPTION_1_DAY,
  EXPIRATION_OPTION_3_DAYS,
  EXPIRATION_OPTION_7_DAYS,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'
import Text from '../text'

class ChatConversationExpirationOptionsPopover extends React.PureComponent {

  handleOnSetExpiration = (expiresAt) => {
    this.props.onSetChatConversationExpiration(expiresAt)
    this.handleOnClosePopover()
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      chatConversationId,
      expiresAtValue,
      intl,
      isXS,
    } = this.props

    if (!chatConversationId) return <div/>

    const listItems = [
      {
        hideArrow: true,
        title: 'None',
        onClick: () => this.handleOnSetExpiration(null),
        isActive: !expiresAtValue,
      },
      {
        hideArrow: true,
        title: intl.formatMessage(messages.minutes, { number: 5 }),
        onClick: () => this.handleOnSetExpiration(EXPIRATION_OPTION_5_MINUTES),
        isActive: expiresAtValue === EXPIRATION_OPTION_5_MINUTES,
      },
      {
        hideArrow: true,
        title: intl.formatMessage(messages.minutes, { number: 60 }),
        onClick: () => this.handleOnSetExpiration(EXPIRATION_OPTION_1_HOUR),
        isActive: expiresAtValue === EXPIRATION_OPTION_1_HOUR,
      },
      {
        hideArrow: true,
        title: '6 hours',
        title: intl.formatMessage(messages.hours, { number: 6 }),
        onClick: () => this.handleOnSetExpiration(EXPIRATION_OPTION_6_HOURS),
        isActive: expiresAtValue === EXPIRATION_OPTION_6_HOURS,
      },
      {
        hideArrow: true,
        title: intl.formatMessage(messages.hours, { number: 24 }),
        onClick: () => this.handleOnSetExpiration(EXPIRATION_OPTION_1_DAY),
        isActive: expiresAtValue === EXPIRATION_OPTION_1_DAY,
      },
      {
        hideArrow: true,
        title: '3 days',
        title: intl.formatMessage(messages.days, { number: 3 }),
        onClick: () => this.handleOnSetExpiration(EXPIRATION_OPTION_3_DAYS),
        isActive: expiresAtValue === EXPIRATION_OPTION_3_DAYS,
      },
      {
        hideArrow: true,
        title: intl.formatMessage(messages.days, { number: 7 }),
        onClick: () => this.handleOnSetExpiration(EXPIRATION_OPTION_7_DAYS),
        isActive: expiresAtValue === EXPIRATION_OPTION_7_DAYS,
      },
    ]

    return (
      <PopoverLayout
        width={210}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <Text className={[_s.d, _s.px15, _s.py10, _s.bgSecondary].join(' ')}>Chats delete after:</Text>
        <List
          scrollKey='chat_conversation_expiration'
          items={listItems}
          size={isXS ? 'large' : 'small'}
        />
      </PopoverLayout>
    )
  }

}

const messages = defineMessages({
  minutes: { id: 'intervals.full.minutes', defaultMessage: '{number, plural, one {# minute} other {# minutes}}' },
  hours: { id: 'intervals.full.hours', defaultMessage: '{number, plural, one {# hour} other {# hours}}' },
  days: { id: 'intervals.full.days', defaultMessage: '{number, plural, one {# day} other {# days}}' },
})

const mapStateToProps = (state, { chatConversationId }) => ({
  expiresAtValue: state.getIn(['chat_conversations', chatConversationId, 'chat_message_expiration_policy']),
})

const mapDispatchToProps = (dispatch, { chatConversationId }) => ({
  onClosePopover() {
    dispatch(closePopover())
  },
  onSetChatConversationExpiration(expiration) {
    dispatch(setChatConversationExpiration(chatConversationId, expiration))
  },
})

ChatConversationExpirationOptionsPopover.defaultProps = {
  expiresAtValue: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  isXS: PropTypes.bool,
  onSetChatConversationExpiration: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ChatConversationExpirationOptionsPopover))