import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'

/**
 * Renders a divider component
 * @param {bool} [props.isInvisible] - to style the tab bar larger
 * @param {bool} [props.isSmall] - if item is active
 */
class Divider extends React.PureComponent {

  render() {
    const { isSmall, isInvisible } = this.props

    const classes = CX({
      d: 1,
      borderBottom1PX: !isInvisible,
      borderColorSecondary: !isInvisible,
      w100PC: 1,
      mb15: !isSmall,
      my10: isSmall || isInvisible,
    })

    return <div className={classes} />
  }

}

Divider.propTypes = {
  isInvisible: PropTypes.bool,
  isSmall: PropTypes.bool,
}

export default Divider