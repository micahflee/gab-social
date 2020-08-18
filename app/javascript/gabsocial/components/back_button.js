import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'
import Button from './button'

class BackButton extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  historyBack = () => {
    if (window.history && window.history.length === 1 || this.props.toHome) {
      this.context.router.history.push('/home')
    } else {
      this.context.router.history.goBack()
    }
  }

  handleBackClick = () => {
    this.historyBack()
  }

  render() {
    const {
      className,
      icon,
      iconClassName,
      iconSize,
    } = this.props

    const classes = CX(className, {
       alignItemsCenter: 1,
       bgTransparent: 1,
       mr5: 1,
       cursorPointer: 1,
       outlineNone: 1,
       default: 1,
       justifyContentCenter: 1,
    })

    return (
      <Button
        noClasses
        color='primary'
        backgroundColor='none'
        className={classes}
        icon={icon || 'angle-left'}
        iconSize={iconSize || '24px'}
        iconClassName={iconClassName || [_s.mr5, _s.colorPrimary].join(' ')}
        onClick={this.handleBackClick}
      />
    )
  }

}

BackButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  iconSize: PropTypes.string,
  toHome: PropTypes.bool,
}

export default BackButton