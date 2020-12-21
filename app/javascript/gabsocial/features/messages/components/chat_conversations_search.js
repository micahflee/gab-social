import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Input from '../../../components/input'

class ChatConversationsSearch extends React.PureComponent {

  state = {
    value: '',
  }

  handleOnChange = (value) => {
    this.setState({ value })
    this.props.onChange(value)
  }

  render() {
    const { value } = this.state

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

const mapDispatchToProps = (dispatch) => ({
  onChange(value) {
    // dispatch()
  }
})

export default connect(null, mapDispatchToProps)(ChatConversationsSearch)