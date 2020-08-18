import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { me } from '../initial_state'
import { CX } from '../constants'
import { openModal } from '../actions/modal'
import Button from './button'

class FloatingActionButton extends React.PureComponent {

  render() {
    const {
      intl,
      onOpenCompose,
      isDesktop,
    } = this.props

    if (!me) return null

    const message = intl.formatMessage(messages.gab)

    const containerClasses = CX({
      posFixed: 1,
      z3: 1,
      mb15: 1,
      mr15: 1,
      right0: 1,
      bottom55PX: !isDesktop,
      bottom0: isDesktop,
      pb15: isDesktop,
      pr15: isDesktop,
    })

    return (
      <div
        className={containerClasses}
      >
        <Button
          to={isDesktop ? undefined : '/compose'}
          onClick={isDesktop ? onOpenCompose : undefined}
          className={[_s.py15, _s.h60PX, _s.saveAreaInsetMR, _s.saveAreaInsetMB, _s.w60PX, _s.jcCenter, _s.aiCenter].join(' ')}
          title={message}
          aria-label={message}
          icon='pencil'
          iconSize='20px'
        />
      </div>
    )
  }
  
}

const messages = defineMessages({
  gab: { id: 'gab', defaultMessage: 'Gab' }, 
})

const mapDispatchToProps = (dispatch) => ({
  onOpenCompose: () => dispatch(openModal('COMPOSE')),
})

FloatingActionButton.propTypes = {
  intl: PropTypes.object.isRequired,
  onOpenCompose: PropTypes.func.isRequired,
  isDesktop: PropTypes.bool,
}

export default injectIntl(connect(null, mapDispatchToProps)(FloatingActionButton))