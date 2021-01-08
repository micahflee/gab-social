import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { me } from '../initial_state'
import Button from '../components/button'
import Text from '../components/text'
import DeckSidebar from '../components/sidebar/deck_sidebar'
import WrappedBundle from '../features/ui/util/wrapped_bundle'

class DeckLayout extends React.PureComponent {

  render() {
    const { children, title, width } = this.props

    const isXS = width <= BREAKPOINT_EXTRA_SMALL

    if (isXS) {
      return (
        <div className={[_s.d, _s.aiCenter, _s.jcCenter, _s.w100PC, _s.h100VH, _s.bgTertiary, _s.px15, _s.py15].join(' ')}>
          <Text className={_s.mb10}>Gab Deck is not available on mobile or tablet devices. Please only access using a desktop computer.</Text>
          <Button to='/home'>Return home</Button>
        </div>
      )
    }

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

const mapStateToProps = (state) => ({
  width: state.getIn(['settings', 'window_dimensions', 'width']),
})

DeckLayout.propTypes = {
  title: PropTypes.string,
}

export default connect(mapStateToProps)(DeckLayout)