import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import MessagesLayout from '../layouts/messages_layout'

class MessagesPage extends React.PureComponent {

  render() {
    const { children, intl } = this.props

    const title = intl.formatMessage(messages.chats)

    return (
      <MessagesLayout
        showBackBtn
        title={title}
      >
        <PageTitle path={title} />
        
      </MessagesLayout>
    )
  }

}

const messages = defineMessages({
  chats: { id: 'chats', defaultMessage: 'Chats' },
})

MessagesPage.propTypes = {
  intl: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default injectIntl(connect()(MessagesPage))