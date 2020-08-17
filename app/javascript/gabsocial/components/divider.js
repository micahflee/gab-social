import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'

/**
 * Renders a divider component
 * @param {bool} [props.isInvisible] - to style the tab bar larger
 * @param {bool} [props.isSmall] - if item is active
 */
export default class Divider extends React.PureComponent {

  static propTypes = {
    isInvisible: PropTypes.bool,
    isSmall: PropTypes.bool,
  }

  render() {
    const { isSmall, isInvisible } = this.props

    const classes = CX({
      default: 1,
      borderBottom1PX: !isInvisible,
      borderColorSecondary: !isInvisible,
      width100PC: 1,
      mb15: !isSmall,
      my10: isSmall || isInvisible,
    })

    return <div className={classes} />
  }

}