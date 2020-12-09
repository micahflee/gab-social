import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import throttle from 'lodash.throttle'
import { fetchPopularLinks } from '../actions/links'
import {
  BREAKPOINT_EXTRA_SMALL,
  LAZY_LOAD_SCROLL_OFFSET,
} from '../constants'
import Button from '../components/button'
import Text from '../components/text'
import TrendsItem from '../components/trends_item'
import PreviewCardItem from '../components/preview_card_item'
import WrappedBundle from './ui/util/wrapped_bundle'
import {
  GabNewsPanel,
  LatestFromGabPanel,
  PopularLinksPanel,
  TrendsBreakingPanel,
  TrendsFeedsPanel,
  TrendsHeadlinesPanel,
  TrendsRSSPanel,
} from './ui/util/async_components'
import { getWindowDimension } from '../utils/is_mobile'

const initialState = getWindowDimension()

class News extends React.PureComponent {

  state = {
    lazyLoaded: false,
    width: initialState.width,
  }

  componentDidMount() {
    this.window = window
    this.documentElement = document.scrollingElement || document.documentElement

    this.window.addEventListener('scroll', this.handleScroll)
    
    this.handleResize()
    window.addEventListener('keyup', this.handleKeyUp, false)
    window.addEventListener('resize', this.handleResize, false)
  }

  componentWillUnmount() {
    this.detachScrollListener()
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {
    const { width } = getWindowDimension()

    this.setState({ width })
  }

  detachScrollListener = () => {
    this.window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = throttle(() => {
    if (this.window) {
      const { scrollTop } = this.documentElement
      
      if (scrollTop > LAZY_LOAD_SCROLL_OFFSET && !this.state.lazyLoaded) {
        this.setState({ lazyLoaded: true })
        this.detachScrollListener()
      }
    }
  }, 150, { trailing: true })

  render() {
    const { children, isSmall } = this.props
    const { lazyLoaded, width } = this.state

    const isXS = width <= BREAKPOINT_EXTRA_SMALL

    if (isXS || isSmall) {
      return (
        <div className={[_s.d, _s.w100PC].join(' ')}>
          <div className={[_s.d, _s.pt15].join(' ')}>
            <div className={[_s.d, _s.w100PC].join(' ')}>
              <WrappedBundle component={TrendsHeadlinesPanel} />
              <WrappedBundle component={TrendsBreakingPanel} componentParams={{ hideReadMore: 1 }} />
              <WrappedBundle component={PopularLinksPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
              <WrappedBundle component={LatestFromGabPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
              <WrappedBundle component={GabNewsPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
              <WrappedBundle component={TrendsFeedsPanel} />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.flexRow, _s.w100PC, _s.overflowHidden].join(' ')}>
          <div className={[_s.d, _s.pr15, _s.w50PC].join(' ')}>
            <WrappedBundle component={TrendsHeadlinesPanel} />
            <WrappedBundle component={TrendsBreakingPanel} componentParams={{ hideReadMore: 1 }} />
            <WrappedBundle component={LatestFromGabPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
          </div>
          <div classNames={[_s.d, _s.w50PC].join(' ')}>
            <WrappedBundle component={PopularLinksPanel} />
            <WrappedBundle component={TrendsFeedsPanel} />
            <WrappedBundle component={GabNewsPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
          </div>
        </div>
      </div>
    )
  }

}

News.propTypes = {
  isSmall: PropTypes.bool,
}

export default News