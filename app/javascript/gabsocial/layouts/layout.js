import Sticky from 'react-stickynode'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { me } from '../initial_state'
import LoggedOutSidebar from '../components/logged_out_sidebar'
import Sidebar from '../components/sidebar'
import SidebarPanelGroup from '../components/sidebar_panel_group'
import NavigationBar from '../components/navigation_bar'
import LoggedOutNavigationBar from '../components/logged_out_navigation_bar'
import FooterBar from '../components/footer_bar'
import FloatingActionButton from '../components/floating_action_button'
import Responsive from '../features/ui/util/responsive_component'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import Pills from '../components/pills'
import GlobalFooter from '../components/global_footer'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  SidebarXS,
} from '../features/ui/util/async_components'

class Layout extends PureComponent {

  render() {
    const {
      actions,
      children,
      layout,
      noComposeButton,
      noRightSidebar,
      noSidebar,
      page,
      showBackBtn,
      showLinkFooterInSidebar,
      showGlobalFooter,
      tabs,
      title,
    } = this.props

    const mainBlockClasses = CX({
      default: 1,
      width1015PX: 1,
      flexRow: 1,
      justifyContentEnd: 1,
      py15: page !== 'group',
      pb15: page === 'group',
    })

    return (
      <div className={[_s.default, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>

        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <WrappedBundle component={SidebarXS} />
        </Responsive>

        {
          me &&
          <NavigationBar
            actions={actions}
            tabs={tabs}
            title={title}
            showBackBtn={showBackBtn}
          />
        }
        {
          !me &&
          <LoggedOutNavigationBar />
        }

        <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>
          {
            !noSidebar &&
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              {
                !!me &&
                <Sidebar
                  actions={actions}
                  showBackBtn={showBackBtn}
                  tabs={tabs}
                  title={title}
                />
              }
              {
                !me &&
                <LoggedOutSidebar title={title} showLinkFooter={showLinkFooterInSidebar} />
              }
            </Responsive>
          }

          <ResponsiveClassesComponent
            classNames={[_s.default, _s.flexShrink1, _s.flexGrow1].join(' ')}
            classNamesSmall={[_s.default, _s.flexShrink1, _s.flexGrow1].join(' ')}
            classNamesXS={[_s.default, _s.width100PC].join(' ')}
          >
            <main role='main'>

              <ResponsiveClassesComponent
                classNames={mainBlockClasses}
                classNamesXS={[_s.default, _s.width1015PX, _s.justifyContentEnd, _s.pb15].join(' ')}
              >

                {
                  noRightSidebar && children
                }

                {
                  !noRightSidebar &&
                  <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>

                    {
                      !!tabs &&
                      <Responsive max={BREAKPOINT_EXTRA_SMALL}>
                        <div className={[_s.default, _s.py15].join(' ')}>
                          <Pills pills={tabs} />
                        </div>
                      </Responsive>
                    }

                    <div className={_s.default}>
                      {children}
                    </div>
                  </div>
                }

                {
                  !noRightSidebar &&
                  <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                    <div className={[_s.default, _s.width340PX, _s.ml15].join(' ')}>
                      <Sticky top={73} enabled>
                        <div className={[_s.default, _s.width340PX].join(' ')}>
                          <SidebarPanelGroup layout={layout} page={page} />
                        </div>
                      </Sticky>
                    </div>
                  </Responsive>
                }

                {
                  !noComposeButton &&
                  <Responsive max={BREAKPOINT_EXTRA_SMALL}>
                    <FloatingActionButton />
                  </Responsive>
                }

              </ResponsiveClassesComponent>

            </main>
          </ResponsiveClassesComponent>
        </div>

        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <FooterBar title={title} />
        </Responsive>

        {
          !me && showGlobalFooter && <GlobalFooter />
        }
      </div>
    )
  }

}

Layout.propTypes = {
  actions: PropTypes.array,
  children: PropTypes.node,
  layout: PropTypes.array,
  noComposeButton: PropTypes.bool,
  noRightSidebar: PropTypes.bool,
  noSidebar: PropTypes.bool,
  page: PropTypes.string,
  showBackBtn: PropTypes.bool,
  showLinkFooterInSidebar: PropTypes.bool,
  showGlobalFooter: PropTypes.bool,
  tabs: PropTypes.array,
  title: PropTypes.string,
}

export default Layout