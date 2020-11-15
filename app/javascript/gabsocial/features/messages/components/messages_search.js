import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Input from '../../../components/input'

class MessagesSearch extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  state = {
    composeFocused: false,
  }

  render() {
    const {
      intl,
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

const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: "What's on your mind?" },
})

MessagesSearch.propTypes = {
  intl: PropTypes.object.isRequired,
}

export default injectIntl(MessagesSearch)