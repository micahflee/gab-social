import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../../constants'
import { getRandomInt } from '../../utils/numbers'
import PlaceholderLayout from './placeholder_layout'
import ResponsiveClassesComponent from '../../features/ui/util/responsive_classes_component'

class ListItemPlaceholder extends React.PureComponent {

  render() {
    const { isLast } = this.props

    const classes = CX({
      d: 1,
      px15: 1,
      py15: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const classesXS = CX({
      d: 1,
      px15: 1,
      py7: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const width = getRandomInt(120, 375)

    return (
      <ResponsiveClassesComponent
        classNames={classes}
        classNamesXS={classesXS}
      >
        <PlaceholderLayout viewBox='0 0 400 30'>
          <circle cx='10' cy='17' r='10' />
          <rect x='30' y='12' rx='5' ry='5' width={width} height='12' />
        </PlaceholderLayout>
      </ResponsiveClassesComponent>
    )
  }

}

ListItemPlaceholder.propTypes = {
  isLast: PropTypes.bool,
}

export default ListItemPlaceholder
