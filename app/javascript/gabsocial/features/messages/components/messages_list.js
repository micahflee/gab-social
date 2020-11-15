import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import MessagesListItem from './messages_list_item'
import { makeGetAccount } from '../../../selectors'

class MessagesList extends ImmutablePureComponent {

  render() {
    const {
      account,
    } = this.props

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>
        <MessagesListItem />
        <MessagesListItem selected />
        <MessagesListItem />
        <MessagesListItem />
      </div>
    )
  }

}

const mapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, '1'),
})

MessagesList.propTypes = {
  intl: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(MessagesList)