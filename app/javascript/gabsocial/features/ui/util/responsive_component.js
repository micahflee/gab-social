import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Responsive extends React.PureComponent {

  shouldRender = (min, max, width) => {
    return width > min && width < max
  }

  render() {
    const { children, min, max, width } = this.props

    const shouldRender = this.shouldRender(min, max, width)

    return shouldRender ? children : null
  }

}

const mapStateToProps = (state) => ({
  width: state.getIn(['settings', 'window_dimensions', 'width']),
})

Responsive.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
}

Responsive.defaultProps = {
  min: 0,
  max: Infinity,
}

export default connect(mapStateToProps)(Responsive)