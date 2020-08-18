import React from 'react'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Responsive from '../features/ui//util/responsive_component'
import Icon from './icon'

export default class PullToRefresher extends React.PureComponent {

  render() {
    return (
      <Responsive max={BREAKPOINT_EXTRA_SMALL}>
        <div className={[_s.d, _s.h53PX, _s.w100PC, _s.aiCenter, _s.posAbs, _s.left0, _s.right0, _s.topNeg50PX].join(' ')}>
          <div className={[_s.d, _s.w100PC, _s.aiCenter].join(' ')}>
            <Icon id='loading' size='24px' />
          </div>
        </div>
      </Responsive>
    )
  }

}