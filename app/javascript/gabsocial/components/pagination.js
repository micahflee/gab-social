import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'

const COLORS = {
  primary: 'primary',
  brand: 'brand',
}

class Pagination extends React.PureComponent {

  handleClickIndex = (i) => {
    this.props.onClick(i)
  }

  render() {
    const {
      activeIndex,
      color,
      count,
    } = this.props

    if (isNaN(count)) return

    return (
      <ul className={[_s.d, _s.flexRow, _s.listStyleNone].join(' ')}>
        {
          Array.apply(null, {
            length: count
          }).map((_, i) => {
            const btnClasses = CX({
              d: 1,
              w10PX: 1,
              h10PX: 1,
              outlineNone: 1,
              circle: 1,
              cursorPointer: 1,
              bgPrimaryOpaque: i !== activeIndex && color === COLORS.primary,
              bgPrimary: i === activeIndex && color === COLORS.primary,
              boxShadowDot: i === activeIndex && color === COLORS.primary,
              bgBrandLightOpaque: i !== activeIndex && color === COLORS.brand,
              bgBrand: i === activeIndex && color === COLORS.brand,
            })

            return (
              <li className={[_s.d, _s.px5].join(' ')} key={`pagination-${i}`}>
                <button
                  tabIndex='0'
                  className={btnClasses}
                  onClick={() => this.handleClickIndex(i)}
                  data-index={i}
                />
              </li>
            )
          })
        }
      </ul>
    )

  }

}

Pagination.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.number.isRequired,
}

Pagination.defaultProps = {
  color: COLORS.primary,
}

export default Pagination