import React from 'react'
import PropTypes from 'prop-types'
import ResponsiveClassesComponent from '../../ui/util/responsive_classes_component'
import ChatSettingsHeader from './chat_settings_header'
import List from '../../../components/list'

class ChatSettingsSidebar extends React.PureComponent {

  render() {
    return (
      <ResponsiveClassesComponent
        classNames={[_s.d, _s.w340PX, _s.h100PC, _s.bgPrimary, _s.borderLeft1PX, _s.borderRight1PX, _s.borderColorSecondary].join(' ')}
        classNamesSmall={[_s.d, _s.w300PX, _s.h100PC, _s.bgPrimary, _s.borderLeft1PX, _s.borderRight1PX, _s.borderColorSecondary].join(' ')}
      >
        <ChatSettingsHeader />
        <List
          items={[
            {
              title: 'Preferences',
              to: '/messages/settings',
            },
            {
              title: 'Message Requests',
              to: '/messages/requests',
            },
            {
              title: 'Blocked Chats',
              to: '/messages/blocks',
            },
            {
              title: 'Muted Chats',
              to: '/messages/mutes',
            },
          ]}
        />
      </ResponsiveClassesComponent>
    )
  }

}

export default ChatSettingsSidebar