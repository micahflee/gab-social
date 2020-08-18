import React from 'react'
import PropTypes from 'prop-types'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../../constants'
import { getRandomInt } from '../../utils/numbers'
import ResponsiveComponent from '../../features/ui/util/responsive_component'
import PlaceholderLayout from './placeholder_layout'

export default class StatusPlaceholder extends React.PureComponent {

  render() {
    const containerClasses = CX({
      d: 1,
      px15: 1,
      mt5: 1,
      mb15: 1,
      py10: 1,
      radiusSmall: 1,
      bgPrimary: 1,
      boxShadowBlock: 1,
    })

    const containerClassesXS = CX({
      d: 1,
      bgPrimary: 1,
      boxShadowBlock: 1,
      borderTop1PX: 1,
      px15: 1,
      py10: 1,
      mb15: 1,
      borderColorSecondary: 1,
    })

    const width = getRandomInt(120, 375)
    const width1 = getRandomInt(360, 450)
    const width2 = getRandomInt(260, 360)
    const width3 = getRandomInt(120, 260)

    return (
      <React.Fragment>
        <ResponsiveComponent min={BREAKPOINT_EXTRA_SMALL}>
          <div className={containerClasses}>
            <PlaceholderLayout viewBox='0 0 476 136'>
              <rect x='48' y='8' width={width} height='6' rx='3' />
              <rect x='48' y='26' width='52' height='6' rx='3' />
              <rect x='0' y='56' width={width1} height='6' rx='3' />
              <rect x='0' y='72' width={width2} height='6' rx='3' />
              <rect x='0' y='88' width={width3} height='6' rx='3' />
              <circle cx='20' cy='20' r='20' />
            </PlaceholderLayout>
          </div>
        </ResponsiveComponent>
        <ResponsiveComponent max={BREAKPOINT_EXTRA_SMALL}>
          <div className={containerClassesXS}>
            <PlaceholderLayout viewBox='0 0 380 140'>
              <circle cx='25' cy='27' r='25' /> 
              <rect x='64' y='12' rx='5' ry='5' width='235' height='10' /> 
              <rect x='64' y='36' rx='5' ry='5' width='125' height='10' /> 
              <rect x='0' y='72' rx='5' ry='5' width='370' height='10' /> 
              <rect x='0' y='96' rx='5' ry='5' width='318' height='10' /> 
              <rect x='0' y='122' rx='5' ry='5' width='264' height='10' />
            </PlaceholderLayout>
          </div>
        </ResponsiveComponent>
      </React.Fragment>
    )

  }

}