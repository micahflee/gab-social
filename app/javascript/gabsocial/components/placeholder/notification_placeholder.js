import React from 'react'
import PropTypes from 'prop-types'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../../constants'
import { getRandomInt } from '../../utils/numbers'
import ResponsiveComponent from '../../features/ui/util/responsive_component'
import PlaceholderLayout from './placeholder_layout'

class NotificationPlaceholder extends React.PureComponent {

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
      py15: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const width1 = getRandomInt(100, 340)
    const width2 = getRandomInt(120, 320)
    const left = width2 + 30

    return (
      <React.Fragment>
        <ResponsiveComponent min={BREAKPOINT_EXTRA_SMALL}>
          <div className={classes}>
            <div className={[_s.d, _s.py2, _s.px2].join(' ')}>
              <PlaceholderLayout viewBox='0 0 400 170'>
                <rect x='24' y='34' rx='4' ry='4' width={width2} height='8' />
                <rect x={left} y='34' rx='4' ry='4' width='12' height='8' />
                <circle cx='8' cy='10' r='8' />
                <circle cx='36' cy='12' r='12' />
                <rect x='24' y='55' rx='0' ry='0' width='375' height='1' />
                <rect x='24' y='166' rx='0' ry='0' width='475' height='1' />
                <rect x='24' y='55' rx='0' ry='0' width='1' height='112' />
                <rect x='399' y='55' rx='0' ry='0' width='1' height='112' />
                <rect x='32' y='64' rx='4' ry='4' width={width1} height='8' />
                <rect x='32' y='80' rx='4' ry='4' width='23' height='8' />
                <rect x='32' y='102' rx='4' ry='4' width='337' height='8' />
                <rect x='32' y='118' rx='4' ry='4' width='290' height='8' />
                <rect x='32' y='134' rx='4' ry='4' width='216' height='8' />
                <rect x='32' y='152' rx='4' ry='4' width='23' height='8' />
                <rect x='62' y='152' rx='4' ry='4' width='60' height='8' />
                <rect x='130' y='152' rx='4' ry='4' width='26' height='8' />
              </PlaceholderLayout>
            </div>
          </div>
        </ResponsiveComponent>
        <ResponsiveComponent max={BREAKPOINT_EXTRA_SMALL}>
          <div className={classesXS}>
            <div className={[_s.d, _s.py2, _s.px2].join(' ')}>
              <PlaceholderLayout viewBox='0 0 380 200'>
                <circle cx='20' cy='20' r='20' />
                <rect x='0' y='54' rx='5' ry='5' width={width1} height='10' />
                <rect x='0' y='76' rx='0' ry='0' width='1' height='120' />
                <rect x='379' y='76' rx='0' ry='0' width='1' height='120' />
                <rect x='0' y='76' rx='0' ry='0' width='380' height='1' />
                <rect x='0' y='195' rx='0' ry='0' width='380' height='1' />
                <rect x='12' y='90' rx='5' ry='5' width='280' height='10' />
                <rect x='12' y='108' rx='5' ry='5' width='80' height='10' />
                <rect x='12' y='136' rx='5' ry='5' width='320' height='10' />
                <rect x='12' y='154' rx='5' ry='5' width='210' height='10' />
                <rect x='12' y='174' rx='5' ry='5' width='120' height='10' />
              </PlaceholderLayout>
            </div>
          </div>
        </ResponsiveComponent>
      </React.Fragment>
    )
  }

}

NotificationPlaceholder.propTypes = {
  isLast: PropTypes.bool,
}

export default NotificationPlaceholder
