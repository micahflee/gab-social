import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../heading'
import Search from '../search'
import Pills from '../pills'
import Button from '../button'

class SearchNavigationBar extends React.PureComponent {

  render() {
    const {
      children,
      tabs,
      value,
    } = this.props

    const to = '/home'

    return (
      <div className={[_s.d, _s.z4, _s.minH103PX, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.minH103PX, _s.bgPrimary, _s.borderBottom1PX, _s.borderColorSecondary, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >

          <div className={[_s.d, _s.h53PX, _s.flexRow, _s.bgNavigation, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w100PC].join(' ')}>

            <Button
              noClasses
              color='primary'
              backgroundColor='none'
              className={[_s.d, _s.noUnderline, _s.aiCenter, _s.bgTransparent, _s.mr5, _s.cursorPointer, _s.outlineNone, _s.jcCenter, _s.pl10, _s.pr10, _s.minH53PX].join(' ')}
              to={to}
              icon='angle-left'
              iconSize='18px'
              iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
            />
        
            <div className={[_s.d, _s.minH53PX, _s.jcCenter, _s.flexGrow1, _s.mr15].join(' ')}>
              <Search isInNav />
            </div>

          </div>

          <div className={[_s.d, _s.overflowXScroll, _s.noScrollbar, _s.flexRow, _s.w100PC, _s.pt10, _s.pb5, _s.pr10].join(' ')}>
            <Pills pills={tabs} />
          </div>

        </div>
      </div>
    )
  }

}

SearchNavigationBar.propTypes = {
  tabs: PropTypes.array,
  value: PropTypes.string,
}

export default SearchNavigationBar