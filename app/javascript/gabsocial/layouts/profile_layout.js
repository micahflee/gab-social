import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Sticky from 'react-stickynode'
import throttle from 'lodash.throttle'
import { me } from '../initial_state'
import {
  CX,
  LAZY_LOAD_SCROLL_OFFSET,
} from '../constants'
import DefaultNavigationBar from '../components/navigation_bar/default_navigation_bar'
import FooterBar from '../components/footer_bar'
import ProfileHeader from '../components/profile_header'
import FloatingActionButton from '../components/floating_action_button'
import ProfileNavigationBar from '../components/navigation_bar/profile_navigation_bar'
import LoggedOutNavigationBar from '../components/navigation_bar/logged_out_navigation_bar'
import Responsive from '../features/ui/util/responsive_component'
import Divider from '../components/divider'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  LinkFooter,
  ProfileStatsPanel,
  ProfileInfoPanel,
  MediaGalleryPanel,
  SignUpPanel,
  SidebarXS,
} from '../features/ui/util/async_components'

class ProfileLayout extends ImmutablePureComponent {

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
      
      if (scrollTop > LAZY_LOAD_SCROLL_OFFSET && !this.state.lazyLoaded) {
        this.setState({ lazyLoaded: true })
        this.detachScrollListener()
      }
    }
  }, 150, { trailing: true })


  render() {
    const {
      account,
      children,
      titleHTML,
      unavailable,
      noSidebar,
    } = this.props
    const { lazyLoaded } = this.state

    const mainContentClasses = CX({
      d: 1,
      w645PX: !noSidebar,
      w1015PX: noSidebar,
      z1: 1,
    })

    return (
      <div className={[_s.d, _s.w100PC, _s.minH100VH, _s.bgTertiary].join(' ')}>

        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <WrappedBundle component={SidebarXS} />
        </Responsive>

        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          {
            !!me &&
            <ProfileNavigationBar titleHTML={titleHTML} account={account} />
          }
          {
            !me &&
            <LoggedOutNavigationBar isProfile />
          }

          <main role='main' className={[_s.d, _s.w100PC].join(' ')}>

            <div className={[_s.d, _s.w100PC, _s.flexRow, _s.pb15].join(' ')}>

              <div className={[_s.d, _s.w100PC, _s.flexRow, _s.jcSpaceBetween].join(' ')}>
                <div className={[_s.d, _s.z1, _s.w100PC, _s.aiCenter].join(' ')}>

                  <ProfileHeader account={account} isXS>
                    <WrappedBundle component={ProfileInfoPanel} componentParams={{ account, noPanel: true }} />
                    <Divider isSmall />
                    <WrappedBundle component={ProfileStatsPanel} componentParams={{ account, noPanel: true }} />
                  </ProfileHeader>

                  <div className={[_s.d, _s.w100PC, , _s.flexRow, _s.jcEnd, _s.py15].join(' ')}>
                    <div className={[_s.d, _s.w100PC, _s.z1].join(' ')}>
                      <div className={[_s.d, _s.boxShadowNone].join(' ')}>
                        {children}
                      </div>
                    </div>
                  </div>

                </div>
              </div>


            </div>

            <FloatingActionButton />

          </main>

          <FooterBar />

        </Responsive>

        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          {
            me &&
            <DefaultNavigationBar />
          }
          {
            !me &&
            <LoggedOutNavigationBar isProfile />
          }

          <main role='main' className={[_s.d, _s.w100PC].join(' ')}>

            <div className={[_s.d, _s.w100PC, _s.flexRow, _s.pb15].join(' ')}>

              <div className={[_s.d, _s.w100PC, _s.flexRow, _s.jcSpaceBetween].join(' ')}>
                <div className={[_s.d, _s.z1, _s.w100PC, _s.aiCenter].join(' ')}>

                  <ProfileHeader account={account} />

                  <div className={[_s.d, _s.w1015PX, , _s.flexRow, _s.jcEnd, _s.py15].join(' ')}>
                    {
                      !noSidebar &&
                      <div className={[_s.d, _s.w340PX, _s.mr15].join(' ')}>
                        <Sticky top={63} enabled>
                          <div className={[_s.d, _s.w340PX].join(' ')}>
                            <WrappedBundle component={ProfileStatsPanel} componentParams={{ account }} />
                            <WrappedBundle component={ProfileInfoPanel} componentParams={{ account }} />
                            { /*  !unavailable && <WrappedBundle component={MediaGalleryPanel} componentParams={{ account, isLazy: true, shouldLoad: lazyLoaded }} /> */ }
                            { !me && <WrappedBundle component={SignUpPanel} /> }
                            <WrappedBundle component={LinkFooter} />
                          </div>
                        </Sticky>
                      </div>
                    }
                    <div className={mainContentClasses}>
                      <div className={_s.d}>
                        {children}
                      </div>
                    </div>
                  </div>

                </div>
              </div>


            </div>

            <FloatingActionButton />

          </main>
        </Responsive>

      </div>
    )
  }

}

ProfileLayout.propTypes = {
  account: ImmutablePropTypes.map,
  children: PropTypes.node.isRequired,
  titleHTML: PropTypes.string,
  unavailable: PropTypes.bool,
  noSidebar: PropTypes.bool,
}

export default ProfileLayout