import React from 'react'
import PropTypes from 'prop-types'
import PopoverLayout from './popover_layout'
import List from '../list'

class ChatSettingsPopover extends React.PureComponent {

  handleOnClosePopover = () => {
    this.props.onClose()
  }

  render() {
    const { intl, isXS } = this.props

    return (
      <PopoverLayout width={240} isXS={isXS}>
        <List
          size={isXS ? 'large' : 'small'}
          scrollKey='profile_options'
          items={[
            {
              title: 'Preferences',
              to: '/messages/settings',
              onClick: () => this.handleOnClosePopover(),
            },
            {
              title: 'Message Requests',
              to: '/messages/requests',
              onClick: () => this.handleOnClosePopover(),
            },
            {
              title: 'Blocked Chat Messengers',
              to: '/messages/blocks',
              onClick: () => this.handleOnClosePopover(),
            },
            {
              title: 'Muted Conversations',
              to: '/messages/muted_conversations',
              onClick: () => this.handleOnClosePopover(),
            },
          ]}
        />
      </PopoverLayout>
    )
  }
}


ChatSettingsPopover.propTypes = {
  onClose: PropTypes.func.isRequired,
  isXS: PropTypes.bool,
}

export default ChatSettingsPopover
