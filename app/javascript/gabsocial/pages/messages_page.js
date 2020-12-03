import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import MessagesLayout from '../layouts/messages_layout'

class MessagesPage extends React.PureComponent {

  render() {
    const {
      children,
      isSettings,
      source,
    } = this.props

    return (
      <MessagesLayout
        showBackBtn
        isSettings={isSettings}
        title='Chats'
        source={source}
      >
        <PageTitle path='Chats' />
        {children}
      </MessagesLayout>
    )
  }

}


MessagesPage.propTypes = {
  children: PropTypes.node.isRequired,
  isSettings: PropTypes.func,
  source: PropTypes.string,
}

export default MessagesPage