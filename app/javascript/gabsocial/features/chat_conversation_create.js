import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchChatConversationAccountSuggestions,
  clearChatConversationAccountSuggestions,
} from '../actions/chats'
import { createChatConversation } from '../actions/chat_conversations'
import Account from '../components/account'
import Button from '../components/button'
import Input from '../components/input'
import Form from '../components/form'
import Text from '../components/text'

class ChatConversationCreate extends React.PureComponent {

  state = {
    query: '',
  }

  onChange = (query) => {
    this.setState({ query })
    this.props.onChange(query)
  }

  handleOnCreateChatConversation = (accountId) => {
    this.props.onCreateChatConversation(accountId)
    this.props.onClearChatConversationAccountSuggestions()

    if (this.props.isModal && !!this.props.onCloseModal) {
      this.props.onCloseModal()
    }
  }

  render() {
    const { query, suggestionsIds } = this.props

    return (
      <Form>
        <div className={[_s.d, _s.px15, _s.pt10].join(' ')}>
          <Input
            title='Search for a user'
            value={query}
            onChange={this.onChange}
          />
        </div>

        <div className={[_s.d, _s.pt10].join(' ')}>
          <div className={[_s.d].join(' ')}>
            <Text weight='bold' size='small' color='secondary' className={[_s.d, _s.px15, _s.ml15, _s.mt5, _s.mb15].join(' ')}>
              Search results ({suggestionsIds.size})
            </Text>
            {
              suggestionsIds &&
              suggestionsIds.map((accountId) => (
                <Account
                  compact
                  key={`chat-conversation-account-create-${accountId}`}
                  id={accountId}
                  onActionClick={() => this.handleOnCreateChatConversation(accountId)}
                  actionIcon='add'
                />
              ))
            }
          </div>
        </div>
      </Form>
    )
  }

}

const mapStateToProps = (state) => ({
  suggestionsIds: state.getIn(['chats', 'createChatConversationSuggestionIds']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange(value) {
    dispatch(fetchChatConversationAccountSuggestions(value))
  },
  onCreateChatConversation(accountId) {
    dispatch(createChatConversation(accountId))
  },
  onClearChatConversationAccountSuggestions() {
    dispatch(clearChatConversationAccountSuggestions())
  }
})

ChatConversationCreate.propTypes = {
  onChange: PropTypes.func.isRequired,
  onCreateChatConversation: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversationCreate)