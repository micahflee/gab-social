import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Sticky from 'react-stickynode'
import { me } from '../initial_state'
import { CX } from '../constants'
import NavigationBar from '../components/navigation_bar'
import FooterBar from '../components/footer_bar'
import ProfileHeader from '../components/profile_header'
import FloatingActionButton from '../components/floating_action_button'
import ProfileNavigationBar from '../components/profile_navigation_bar'
import LoggedOutNavigationBar from '../components/logged_out_navigation_bar'
import Responsive from '../features/ui/util/responsive_component'
import Divider from '../components/divider'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  LinkFooter,
  ProfileStatsPanel,
  ProfileInfoPanel,
  MediaGalleryPanel,
  SignUpPanel,
} from '../features/ui/util/async_components'

export default class ProfileLayout extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    children: PropTypes.node.isRequired,
    titleHTML: PropTypes.string,
    unavailable: PropTypes.bool,
    noSidebar: PropTypes.bool,
  }

  render() {
    const {
      account,
      children,
      titleHTML,
      unavailable,
      noSidebar,
    } = this.props

    const mainContentClasses = CX({
      default: 1,
      width645PX: !noSidebar,
      width1015PX: noSidebar,
      z1: 1,
    })

    return (
      <div className={[_s.default, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          {
            !!me &&
            <ProfileNavigationBar titleHTML={titleHTML} />
          }
          {
            !me &&
            <LoggedOutNavigationBar isProfile />
          }

          <main role='main' className={[_s.default, _s.width100PC].join(' ')}>

            <div className={[_s.default, _s.width100PC, _s.flexRow, _s.pb15].join(' ')}>

              <div className={[_s.default, _s.width100PC, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
                <div className={[_s.default, _s.z1, _s.width100PC, _s.alignItemsCenter].join(' ')}>

                  <ProfileHeader account={account} isXS>
                    <WrappedBundle component={ProfileInfoPanel} componentParams={{ account, noPanel: true }} />
                    <Divider isSmall />
                    <WrappedBundle component={ProfileStatsPanel} componentParams={{ account, noPanel: true }} />
                  </ProfileHeader>

                  <div className={[_s.default, _s.width100PC, , _s.flexRow, _s.justifyContentEnd, _s.py15].join(' ')}>
                    <div className={[_s.default, _s.width100PC, _s.z1].join(' ')}>
                      <div className={_s.default}>
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
            <NavigationBar />
          }
          {
            !me &&
            <LoggedOutNavigationBar isProfile />
          }

          <main role='main' className={[_s.default, _s.width100PC].join(' ')}>

            <div className={[_s.default, _s.width100PC, _s.flexRow, _s.pb15].join(' ')}>

              <div className={[_s.default, _s.width100PC, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
                <div className={[_s.default, _s.z1, _s.width100PC, _s.alignItemsCenter].join(' ')}>

                  <ProfileHeader account={account} />

                  <div className={[_s.default, _s.width1015PX, , _s.flexRow, _s.justifyContentEnd, _s.py15].join(' ')}>
                    {
                      !noSidebar &&
                      <div className={[_s.default, _s.width340PX, _s.mr15].join(' ')}>
                        <Sticky top={63} enabled>
                          <div className={[_s.default, _s.width340PX].join(' ')}>
                            <WrappedBundle component={ProfileStatsPanel} componentParams={{ account }} />
                            <WrappedBundle component={ProfileInfoPanel} componentParams={{ account }} />
                            { !unavailable && <WrappedBundle component={MediaGalleryPanel} componentParams={{ account }} /> }
                            { !me && <WrappedBundle component={SignUpPanel} /> }
                            <WrappedBundle component={LinkFooter} />
                          </div>
                        </Sticky>
                      </div>
                    }
                    <div className={mainContentClasses}>
                      <div className={_s.default}>
                        {children}
                      </div>
                    </div>
                  </div>

                </div>
              </div>


            </div>

            <FloatingActionButton isDesktop />

          </main>
        </Responsive>

      </div>
    )
  }

}