import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../../components/input'

class ChatConversationsSearch extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  state = {
    composeFocused: false,
  }

  render() {
    const {
      children
    } = this.props

    return (
      <div className={[_s.d, _s.h60PX, _s.w100PC, _s.px10, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <Input
          type='search'
          placeholder='Search for messages'
          id='messages-search'
          prependIcon='search'
        />
      </div>
    )
  }

}

ChatConversationsSearch.propTypes = {
  //
}

export default ChatConversationsSearch