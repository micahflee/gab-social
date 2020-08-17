import React from 'react'
import { CX } from '../constants'

export default class Icon extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    size: PropTypes.string,
  }

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
