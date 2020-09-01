import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import throttle from 'lodash.throttle'
import Sticky from 'react-stickynode'
import { me } from '../initial_state'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Layout from './layout'
import SidebarPanelGroup from '../components/sidebar_panel_group'
import Responsive from '../features/ui/util/responsive_component'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import Heading from '../components/heading'
import {
  GroupsPanel,
  SignUpLogInPanel,
  UserSuggestionsPanel,
  TrendsPanel,
} from '../features/ui/util/async_components'

class ExploreLayout extends ImmutablePureComponent {

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
    const { children, title } = this.props
    const { lazyLoaded } = this.state

    const pageTitleBlock = (
      <div className={[_s.d, _s.pl15, _s.pb10].join(' ')}>
        <Heading size='h2'>Popular posts across Gab</Heading>
      </div>
    )

    const layout = [
      SignUpLogInPanel,
      <WrappedBundle component={GroupsPanel} componentParams={{ groupType: 'featured' }} />,
    ]
    if (!!me) {
      layout.push(<WrappedBundle component={UserSuggestionsPanel} componentParams={{ suggestionType: 'verified' }} />)
    }
    layout.push(<WrappedBundle component={TrendsPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }} />)

    return (
      <Layout
        showGlobalFooter
        noRightSidebar
        showLinkFooterInSidebar
        page='explore'
        title={title}
      >
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.d, _s.w100PC].join(' ')}>

            <div className={[_s.d, _s.w100PC, _s.z1].join(' ')}>
              <div className={[_s.d, _s.mt15, _s.px10].join(' ')}>
                <WrappedBundle component={SignUpLogInPanel} componentParams={{ isXS: true }} />
              </div>
              {pageTitleBlock}
              {children}
            </div>

          </div>
        </Responsive>

        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.d, _s.w100PC, _s.pl15].join(' ')}>

            <div className={[_s.d, _s.flexRow, _s.w100PC, _s.jcEnd].join(' ')}>
              <div className={[_s.d, _s.w645PX, _s.z1].join(' ')}>  

                <div className={_s.d}>
                  {pageTitleBlock}
                  {children}
                </div>
              </div>

              <div className={[_s.d, _s.ml15, _s.w340PX].join(' ')}>
                <Sticky top={73} enabled>
                  <div className={[_s.d, _s.w340PX].join(' ')}>
                    <SidebarPanelGroup
                      page='explore'
                      layout={layout}
                    />
                  </div>
                </Sticky>
              </div>
            </div>
          </div>
        </Responsive>
      </Layout>
    )
  }

}

ExploreLayout.propTypes = {
  actions: PropTypes.array,
  children: PropTypes.node,
  group: ImmutablePropTypes.map,
  groupId: PropTypes.string,
  layout: PropTypes.object,
  relationships: ImmutablePropTypes.map,
  title: PropTypes.string,
}

export default ExploreLayout