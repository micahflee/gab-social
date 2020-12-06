import React from 'react'
import PropTypes from 'prop-types'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { me } from '../initial_state'
import DeckSidebar from '../components/sidebar/deck_sidebar'
import WrappedBundle from '../features/ui/util/wrapped_bundle'

class DeckLayout extends React.PureComponent {

  render() {
    const { children, title } = this.props

    const mainBlockClasses = CX({
      d: 1,
      w1015PX: 1,
      flexRow: 1,
      jcEnd: 1,
      py15: 1,
      mlAuto: !me,
      mrAuto: !me,
    })

    return (
      <div className={[_s.d, _s.w100PC, _s.h100VH, _s.bgTertiary].join(' ')}>
        <DeckSidebar />
        <div className={[_s.d, _s.flexRow, _s.w100PC].join(' ')}>
          <div className={[_s.d, _s.w76PX, _s.h100VH].join(' ')} />
          <main role='main' className={[_s.d, _s.z1, _s.overflowXScroll, _s.noScrollbar].join(' ')}>
            {children}
          </main>
        </div>
      </div>
    )
  }

}

DeckLayout.propTypes = {
  title: PropTypes.string,
}

export default DeckLayout