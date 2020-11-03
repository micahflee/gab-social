import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../heading'
import Search from '../search'
import Pills from '../pills'
import Button from '../button'
import Text from '../text'

class SearchNavigationBar extends React.PureComponent {

  onClickSearch = (e) => {
    e.preventDefault()
    const { isSearchFocused } = this.props
    if (!isSearchFocused) {
      this.props.onToggleSearchExplore(true)
    }
  }

  onResetSearchFocus = () => {
    this.props.onToggleSearchExplore(false)
  }

  render() {
    const {
      children,
      tabs,
      value,
      isSearchFocused,
    } = this.props

    const to = '/home'

    return (
      <div className={[_s.d, _s.z4, _s.minH103PX, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.minH103PX, _s.bgPrimary, _s.borderBottom1PX, _s.borderColorSecondary, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >

          <div className={[_s.d, _s.bgNavigation, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w100PC].join(' ')}>

            <div className={[_s.d, _s.h53PX, _s.flexRow, _s.w100PC, _s.px10, _s.aiCenter, _s.jcCenter].join(' ')}>
              {
                !isSearchFocused &&
                <Button
                  noClasses
                  color='primary'
                  backgroundColor='none'
                  className={[_s.d, _s.noUnderline, _s.aiCenter, _s.bgTransparent, _s.mr5, _s.cursorPointer, _s.outlineNone, _s.jcCenter, _s.pr10, _s.minH53PX].join(' ')}
                  to={to}
                  icon='angle-left'
                  iconSize='18px'
                  iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
                />
              }
          
              <div
                className={[_s.d, _s.minH53PX, _s.jcCenter, _s.flexGrow1].join(' ')}
                onClick={this.onClickSearch}
              >
                <Search isInNav />
              </div>
              
              {
                isSearchFocused &&
                <Button
                  isText
                  backgroundColor='none'
                  onClick={this.onResetSearchFocus}
                  className={[_s.mr5, _s.ml10, _s.fillNavigationBrand].join(' ')}
                >
                  <Text color='inherit' weight='medium' size='medium'>
                    Cancel
                  </Text>
                </Button>
              }
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
  onToggleSearchExplore: PropTypes.func,
  isSearchFocused: PropTypes.bool.isRequired,
}

export default SearchNavigationBar