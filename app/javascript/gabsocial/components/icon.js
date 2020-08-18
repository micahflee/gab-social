import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'

class Icon extends React.PureComponent {

  render() {
    const {
      className,
      id,
      size,
    } = this.props

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