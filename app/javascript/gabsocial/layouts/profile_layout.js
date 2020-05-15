import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Sticky from 'react-stickynode'
import { me } from '../initial_state'
import LinkFooter from '../components/link_footer'
import ProfileStatsPanel from '../components/panel/profile_stats_panel'
import ProfileInfoPanel from '../components/panel/profile_info_panel'
import MediaGalleryPanel from '../components/panel/media_gallery_panel'
import NavigationBar from '../components/navigation_bar'
import FooterBar from '../components/footer_bar'
import ProfileHeader from '../components/profile_header'
import FloatingActionButton from '../components/floating_action_button'
import ProfileNavigationBar from '../components/profile_navigation_bar'
import LoggedOutNavigationBar from '../components/logged_out_navigation_bar'
import Responsive from '../features/ui/util/responsive_component';
import Divider from '../components/divider';

export default class ProfileLayout extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    unavailable: PropTypes.bool,
  }

  render() {
    const {
      account,
      children,
      title,
      unavailable,
    } = this.props

    return (
      <div className={[_s.default, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          {
            !!me &&
            <ProfileNavigationBar title={title} />
          }
          {
            !me &&
            <LoggedOutNavigationBar />
          }

          <main role='main' className={[_s.default, _s.width100PC].join(' ')}>

            <div className={[_s.default, _s.width100PC, _s.flexRow, _s.pb15].join(' ')}>

              <div className={[_s.default, _s.width100PC, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
                <div className={[_s.default, _s.z1, _s.width100PC, _s.alignItemsCenter].join(' ')}>

                  <ProfileHeader account={account}>
                    <ProfileInfoPanel account={account} noPanel />
                    <Divider isSmall />
                    <ProfileStatsPanel account={account} noPanel />
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
            <LoggedOutNavigationBar />
          }

          <main role='main' className={[_s.default, _s.width100PC].join(' ')}>

            <div className={[_s.default, _s.width100PC, _s.flexRow, _s.pb15].join(' ')}>

              <div className={[_s.default, _s.width100PC, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
                <div className={[_s.default, _s.z1, _s.width100PC, _s.alignItemsCenter].join(' ')}>

                  <ProfileHeader account={account} />

                  <div className={[_s.default, _s.width1015PX, , _s.flexRow, _s.justifyContentEnd, _s.py15].join(' ')}>
                    <div className={[_s.default, _s.width340PX, _s.mr15].join(' ')}>
                      <Sticky top={63} enabled>
                        <div className={[_s.default, _s.width340PX].join(' ')}>
                          <ProfileStatsPanel account={account} />
                          <ProfileInfoPanel account={account} />
                          { !unavailable && <MediaGalleryPanel account={account} /> }
                          <LinkFooter />
                        </div>
                      </Sticky>
                    </div>
                    <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
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