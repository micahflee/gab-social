import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import throttle from 'lodash.throttle'
import { fetchPopularLinks } from '../actions/links'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Button from '../components/button'
import Text from '../components/text'
import TrendsItem from '../components/trends_item'
import PreviewCardItem from '../components/preview_card_item'
import ResponsiveClassesComponent from './ui/util/responsive_classes_component'
import Responsive from './ui/util/responsive_component'
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
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  detachScrollListener = () => {
    this.window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = throttle(() => {
    if (this.window) {
      const { scrollTop } = this.documentElement
      
      if (scrollTop > 25 && !this.state.lazyLoaded) {
        this.setState({ lazyLoaded: true })
        this.detachScrollListener()
      }
    }
  }, 150, {
    trailing: true,
  })

  render() {
    const { children } = this.props
    const { lazyLoaded } = this.state

    // const orderXS = ['headlines', 'breaking', 'trending_links', 'latest_from_gab', 'gab_news', 'trends_feeds']

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>

        <ResponsiveClassesComponent
          classNames={[_s.d, _s.flexRow, _s.w100PC, _s.overflowHidden].join(' ')}
          classNamesXS={[_s.d, _s.pt15].join(' ')}
        >
        
          <ResponsiveClassesComponent
            classNames={[_s.d, _s.pr15, _s.w50PC].join(' ')}
            classNamesXS={[_s.d, _s.w100PC].join(' ')}
          >
            { /* DESKTOP */ }
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              <WrappedBundle component={TrendsHeadlinesPanel} />
              <WrappedBundle component={TrendsBreakingPanel} componentParams={{ hideReadMore: 1 }} />
              <WrappedBundle component={LatestFromGabPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
            </Responsive>
            { /* MOBILE */ }
            <Responsive max={BREAKPOINT_EXTRA_SMALL}>
              <WrappedBundle component={TrendsHeadlinesPanel} />
              <WrappedBundle component={TrendsBreakingPanel} componentParams={{ hideReadMore: 1 }} />
              <WrappedBundle component={PopularLinksPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
              <WrappedBundle component={LatestFromGabPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
              <WrappedBundle component={GabNewsPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
              <WrappedBundle component={TrendsFeedsPanel} />
            </Responsive>
          </ResponsiveClassesComponent>
          
          
          { /* DESKTOP */ }
          <Responsive min={BREAKPOINT_EXTRA_SMALL}>
            <div classNames={[_s.d, _s.w50PC].join(' ')}>
              <WrappedBundle component={PopularLinksPanel} />
              <WrappedBundle component={TrendsFeedsPanel} />
              <WrappedBundle component={GabNewsPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />
            </div>
          </Responsive>

        </ResponsiveClassesComponent>

      </div>
    )
  }

}

export default News