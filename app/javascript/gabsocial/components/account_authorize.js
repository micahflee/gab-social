import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { authorizeFollowRequest, rejectFollowRequest } from '../actions/accounts'
import { makeGetAccount } from '../selectors'
import Account from './account'

class AccountAuthorize extends ImmutablePureComponent {

  render () {
    const {
      intl,
      account,
      onAuthorize,
      onReject,
    } = this.props

    // <Button title={intl.formatMessage(messages.authorize)} icon='check' onClick={onAuthorize} />
    // <Button title={intl.formatMessage(messages.reject)} icon='times' onClick={onReject} />

    return (
      <Account
        id={account.get('id')}
        dismissAction={onReject}
        onActionClick={onAuthorize}
        actionIcon='add'
        showDismiss
        withBio
      />
    )
  }

}

const messages = defineMessages({
  authorize: { id: 'follow_request.authorize', defaultMessage: 'Authorize' },
  reject: { id: 'follow_request.reject', defaultMessage: 'Reject' },
})

const makeMapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, props.id),
})

const mapDispatchToProps = (dispatch, { id }) => ({
  onAuthorize() {
    dispatch(authorizeFollowRequest(id))
  },
  onReject() {
    dispatch(rejectFollowRequest(id))
  },
})

AccountAuthorize.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
  intl: PropTypes.object.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
}

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(AccountAuthorize))