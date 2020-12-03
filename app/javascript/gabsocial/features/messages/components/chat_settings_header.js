import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Heading from '../../../components/heading'
import Button from '../../../components/button'

class ChatSettingsHeader extends ImmutablePureComponent {

  render() {
    const {
      account,
    } = this.props

    return (
      <div className={[_s.d, _s.w100PC, _s.h60PX, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <div className={[_s.d, _s.flexRow, _s.pl15, _s.pr5, _s.py15].join(' ')}>
          <Button
            noClasses
            className={[_s.d, _s.noUnderline, _s.jcCenter, _s.mr5, _s.aiCenter, _s.bgTransparent, _s.cursorPointer, _s.outlineNone].join(' ')}
            to='/messages'
            color='primary'
            backgroundColor='none'
            icon='angle-left'
            iconSize='16px'
            iconClassName={[_s.mr5, _s.cPrimary].join(' ')}
          />
          <Heading size='h1'>
            Chat Settings
          </Heading>
        </div>
      </div>
    )
  }

}

export default ChatSettingsHeader