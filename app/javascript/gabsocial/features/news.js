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

class News extends React.PureComponent {

  state = {
    lazyLoaded: false,
  }

  componentDidMount() {
    this.window = window
    this.documentElement = document.scrollingElement || document.documentElement

    this.window.addEventListener('scroll', this.handleScroll)
    
    window.addEventListener('keyup', this.handleKeyUp, false)
  }

  componentWillUnmount() {
    this.detachScrollListener()
    window.removeEventListener('keyup', this.handleKeyUp)
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
    const { children, isSmall, width } = this.props
    const { lazyLoaded } = this.state

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
          <div className={[_s.d, _s.w50PC].join(' ')}>
            <WrappedBundle component={PopularLinksPanel} />
            <WrappedBundle component={TrendsFeedsPanel} />
            <WrappedBundle component={GabNewsPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  width: state.getIn(['settings', 'window_dimensions', 'width']),
})

News.propTypes = {
  isSmall: PropTypes.bool,
}

export default connect(mapStateToProps)(News)