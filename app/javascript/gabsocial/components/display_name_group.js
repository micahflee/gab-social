import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import { CX } from '../constants'
import Icon from './icon'
import Text from './text'

class DisplayNameGroup extends ImmutablePureComponent {

  render() {
    const {
      accounts,
      isMultiline,
      isLarge,
      noHover,
      isSmall,
    } = this.props

    if (!account) return null

    const containerClassName = CX({
      d: 1,
      maxW100PC: 1,
      aiCenter: !isMultiline,
      flexRow: !isMultiline,
      cursorPointer: !noHover,
      aiCenter: isCentered,
    })

    const displayNameClasses = CX({
      text: 1,
      overflowWrapBreakWord: 1,
      whiteSpaceNoWrap: 1,
      fw600: 1,
      cPrimary: 1,
      mr2: 1,
      lineHeight125: !isSmall,
      fs14PX: isSmall,
      fs15PX: !isLarge,
      fs24PX: isLarge && !isSmall,
    })

    const usernameClasses = CX({
      text: 1,
      displayFlex: 1,
      flexNormal: 1,
      flexShrink1: 1,
      overflowWrapBreakWord: 1,
      textOverflowEllipsis: 1,
      cSecondary: 1,
      fw400: 1,
      lineHeight15: isMultiline,
      lineHeight125: !isMultiline,
      ml5: !isMultiline,
      fs14PX: isSmall,
      fs15PX: !isLarge,
      fs16PX: isLarge && !isSmall,
    })

    const iconSize =
      !!isLarge ? 19 :
      !!isComment ? 12 :
      !!isSmall ? 14 : 15

    return (
      <div />
    )
  }
}

DisplayNameGroup.propTypes = {
  accounts: ImmutablePropTypes.map,
  isLarge: PropTypes.bool,
  isMultiline: PropTypes.bool,
  isSmall: PropTypes.bool,
}

export default DisplayNameGroup