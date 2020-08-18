import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../../constants'
import { getRandomInt } from '../../utils/numbers'
import PlaceholderLayout from './placeholder_layout'

class AccountPlaceholder extends React.PureComponent {

  render() {
    const { isLast, isSmall } = this.props

    const classes = CX({
      d: 1,
      px15: 1,
      py7: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const width = getRandomInt(120, 300)

    if (isSmall) {
      return (
        <div className={classes}>
          <PlaceholderLayout viewBox='0 0 400 60'>
            <circle cx='27' cy='28' r='27' />
            <rect x='72' y='10' rx='5' ry='5' width={width} height='14' /> 
            <rect x='72' y='36' rx='5' ry='5' width='108' height='14' /> 
          </PlaceholderLayout>
        </div>
      )
    }

    return (
      <div className={classes}>
        <PlaceholderLayout viewBox='0 0 400 32'>
          <rect x="38" y="4" rx="3" ry="3" width="268" height="6" /> 
          <circle cx="14" cy="14" r="14" />
          <rect x="36" y="18" rx="3" ry="3" width="208" height="6" />
        </PlaceholderLayout>
      </div>
    )
  }

}

AccountPlaceholder.propTypes = {
  isLast: PropTypes.bool,
  isSmall: PropTypes.bool,
}

export default AccountPlaceholder