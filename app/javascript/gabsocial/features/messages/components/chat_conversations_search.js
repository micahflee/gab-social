import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchApprovedChatConversations } from '../../../actions/chat_conversations'
import { onChangeSearch } from '../../../actions/chats'
import Input from '../../../components/input'

class ChatConversationsSearch extends React.PureComponent {

  handleOnChange = (value) => {
    this.props.onChange(value)
  }

  render() {
    const { value } = this.props

    return (
      <div className={[_s.d, _s.h60PX, _s.w100PC, _s.px10, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <Input
          type='search'
          placeholder='Search for conversations'
          id='messages-search'
          prependIcon='search'
          value={value}
          onChange={this.handleOnChange}
        />
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  value: state.getIn(['chats', 'searchValue'], ''),
})

const mapDispatchToProps = (dispatch) => ({
  onChange(value) {
    dispatch(onChangeSearch(value))
    dispatch(searchApprovedChatConversations(value))
  }
})

ChatConversationsSearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversationsSearch)