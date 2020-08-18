import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../../constants'
import { getRandomInt } from '../../utils/numbers'
import PlaceholderLayout from './placeholder_layout'

class GroupListItemPlaceholder extends React.PureComponent {
  
  render() {
    const { isLast } = this.props

    const classes = CX({
      d: 1,
      px15: 1,
      py7: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const width = getRandomInt(120, 230)

    return (
      <div className={classes}>
        <PlaceholderLayout viewBox='0 0 400 60'>
          <rect x='0' y='0' rx='5' ry='5' width='108' height='60' /> 
          <rect x='126' y='10' rx='5' ry='5' width={width} height='14' /> 
          <rect x='126' y='36' rx='5' ry='5' width='108' height='14' />
        </PlaceholderLayout>
      </div>
    )
  }

}

GroupListItemPlaceholder.propTypes = {
  isLast: PropTypes.bool,
}

export default GroupListItemPlaceholder