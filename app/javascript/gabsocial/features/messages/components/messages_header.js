import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Heading from '../../../components/heading'
import Button from '../../../components/button'

class MessagesHeader extends ImmutablePureComponent {

  render() {
    const {
      account,
    } = this.props

    return (
      <div className={[_s.d, _s.w100PC, _s.h60PX, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <div className={[_s.d, _s.flexRow, _s.pl15, _s.pr5, _s.py15].join(' ')}>
          <Heading size='h1'>
            Messages
          </Heading>
          <div className={[_s.d, _s.bgTransparent, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.mlAuto].join(' ')}>
            <Button
              isNarrow
              onClick={undefined}
              className={[_s.ml5, _s.px15].join(' ')}
            >
              New
            </Button>
            <Button
              isNarrow
              onClick={undefined}
              color='brand'
              backgroundColor='none'
              className={_s.ml5}
              icon='cog'
              iconSize='18px'
            />
          </div>
        </div>
      </div>
    )
  }

}

export default MessagesHeader