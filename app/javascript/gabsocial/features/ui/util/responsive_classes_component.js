import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  BREAKPOINT_EXTRA_LARGE,
  BREAKPOINT_LARGE,
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
  BREAKPOINT_EXTRA_SMALL,
} from '../../../constants'

class ResponsiveClassesComponent extends React.PureComponent {

  render() {
    const {
      width,
      children,
      classNames,
      classNamesXL,
      classNamesLarge,
      classNamesMedium,
      classNamesSmall,
      classNamesXS,
    } = this.props

    let classes;
    if (width >= BREAKPOINT_EXTRA_LARGE) {
      classes = classNamesXL || classNames
    } else if (width < BREAKPOINT_EXTRA_LARGE && width >= BREAKPOINT_LARGE) {
      classes = classNames //default
    } else if (width < BREAKPOINT_LARGE && width >= BREAKPOINT_MEDIUM) {
      classes = classNamesLarge || classNames
    } else if (width < BREAKPOINT_MEDIUM && width >= BREAKPOINT_SMALL) {
      classes = classNamesMedium || classNamesLarge || classNames
    } else if (width < BREAKPOINT_SMALL && width >= BREAKPOINT_EXTRA_SMALL) {
      classes = classNamesSmall || classNamesMedium || classNamesLarge || classNames
    } else {
      classes = classNamesXS || classNamesSmall || classNamesMedium || classNamesLarge || classNames
    }

    return (
      <div className={classes}>
        {children}
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  width: state.getIn(['settings', 'window_dimensions', 'width']),
})

ResponsiveClassesComponent.propTypes = {
  classNames: PropTypes.string,
  classNamesXL: PropTypes.string,
  classNamesLarge: PropTypes.string,
  classNamesMedium: PropTypes.string,
  classNamesSmall: PropTypes.string,
  classNamesXS: PropTypes.string,
}

export default connect(mapStateToProps)(ResponsiveClassesComponent)