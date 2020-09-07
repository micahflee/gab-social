import React from 'react'
import PropTypes from 'prop-types'
import { Popper } from 'react-popper'
import Text from './text'

class Tooltip extends React.PureComponent {

  render() {
    const { message, targetRef } = this.props

    return (
      <Popper
        placement='top'
        referenceElement={targetRef}
        strategy="fixed"
      >
        {({ ref, style, placement, arrowProps }) => (
          <div ref={ref} style={style} data-placement={placement} className={[_s.z4, _s.mt5, _s.mb5, _s.px5, _s.py5].join(' ')}>
            <div ref={arrowProps.ref} style={arrowProps.style} />
            <div data-popover='true' className={[_s, _s.bgBlackOpaque, _s.px10, _s.py5, _s.circle].join(' ')}>
              <Text color='white' size='small' className={_s.minW120PX}>
                {message}
              </Text>
            </div>
          </div>
        )}
      </Popper>
    )
  }

}

Tooltip.propTypes = {
  message: PropTypes.string.isRequired,
  targetRef: PropTypes.node.isRequired,
}

export default Tooltip