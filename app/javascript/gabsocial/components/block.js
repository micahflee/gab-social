import React from 'react'
import PropTypes from 'prop-types'

/**
 * Renders a block component
 */
class Block extends React.PureComponent {

  render() {
    const { children } = this.props

    return (
      <div className={[_s.default, _s.boxShadowBlock, _s.bgPrimary, _s.overflowHidden, _s.radiusSmall].join(' ')}>
        {children}
      </div>
    )
  }

}

Block.propTypes = {
  children: PropTypes.any,
}

export default Block