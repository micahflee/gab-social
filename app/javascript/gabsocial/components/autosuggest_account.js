import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { makeGetAccount } from '../selectors'
import Avatar from './avatar'
import DisplayName from './display_name'

class AutosuggestAccount extends ImmutablePureComponent {

  render () {
    const { account } = this.props

    return (
      <div
        className={[_s.d, _s.cursorPointer, _s.bgSubtle_onHover, _s.flexRow, _s.py10, _s.aiCenter, _s.px10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}
        title={account.get('acct')}
      >
        <Avatar account={account} size={26} />
        <div className={_s.ml10}>
          <DisplayName account={account} noRelationship noHover />
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state, { id }) => ({
  account: makeGetAccount()(state, id),
})

AutosuggestAccount.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
}

export default connect(mapStateToProps)(AutosuggestAccount)