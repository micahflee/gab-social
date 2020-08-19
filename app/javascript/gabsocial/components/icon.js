import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'

import Logo from './logo'
import Loading from './loading'
import VerifiedIcon from './verified_icon'

class Icon extends React.PureComponent {

  render() {
    const {
      className,
      id,
      size,
    } = this.props

    if (id === 'logo') return <Logo className={className} />
    else if (id === 'loading') return <Loading size={size} className={className} />
    else if (id === 'verified') return <VerifiedIcon size={size} />

    const additionalClasses = {}
    additionalClasses.gfi = 1
    additionalClasses[`gfi-${id}`] = 1
      
    const classes = CX(className, additionalClasses)

    return <i style={{ fontSize: size }} className={classes} />

  }

}

Icon.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  size: PropTypes.string,
}

export default Icon