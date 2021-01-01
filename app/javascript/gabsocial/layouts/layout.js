import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Sticky from 'react-stickynode'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { me } from '../initial_state'
import { changeComposeGroupId } from '../actions/compose'
import LoggedOutSidebar from '../components/sidebar/logged_out_sidebar'
import DefaultSidebar from '../components/sidebar/default_sidebar'
import SidebarPanelGroup from '../components/sidebar_panel_group'
import DefaultNavigationBar from '../components/navigation_bar/default_navigation_bar'
import LoggedOutNavigationBar from '../components/navigation_bar/logged_out_navigation_bar'
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

class Layout extends React.PureComponent {

  componentDidMount() {
    if (['group', 'compose'].indexOf(this.props.page) === -1) {
      this.props.dispatch(changeComposeGroupId(null))
    }
  }

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

    const noPaddingPages = ['group', 'messages']
    const hasPadding = noPaddingPages.indexOf(page) === -1
    const mainBlockClasses = CX({
      d: 1,
      w1015PX: 1,
      flexRow: 1,
      jcEnd: 1,
      py15: hasPadding,
      pb15: hasPadding,
    })

    return (
      <div className={[_s.d, _s.w100PC, _s.minH100VH, _s.bgTertiary].join(' ')}>

        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <WrappedBundle component={SidebarXS} />
        </Responsive>

        {
          me &&
          <DefaultNavigationBar
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

        <div className={[_s.d, _s.flexRow, _s.w100PC].join(' ')}>
          {
            !noSidebar &&
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              {
                !!me &&
                <DefaultSidebar
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
            classNames={[_s.d, _s.flexShrink1, _s.flexGrow1].join(' ')}
            classNamesSmall={[_s.d, _s.flexShrink1, _s.flexGrow1].join(' ')}
            classNamesXS={[_s.d, _s.w100PC].join(' ')}
          >
            <main role='main'>

              <ResponsiveClassesComponent
                classNames={mainBlockClasses}
                classNamesXS={[_s.d, _s.w1015PX, _s.jcEnd, _s.pb15].join(' ')}
              >

                {
                  noRightSidebar && children
                }

                {
                  !noRightSidebar &&
                  <div className={[_s.d, _s.w645PX, _s.z1].join(' ')}>

                    {
                      !!tabs &&
                      <Responsive max={BREAKPOINT_EXTRA_SMALL}>
                        <div className={[_s.d, _s.py15].join(' ')}>
                          <Pills pills={tabs} />
                        </div>
                      </Responsive>
                    }

                    <div className={_s.d}>
                      {children}
                    </div>
                  </div>
                }

                {
                  !noRightSidebar &&
                  <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                    <div className={[_s.d, _s.w340PX, _s.ml15].join(' ')}>
                      <Sticky top={73} enabled>
                        <div className={[_s.d, _s.w340PX].join(' ')}>
                          <SidebarPanelGroup layout={layout} page={page} />
                        </div>
                      </Sticky>
                    </div>
                  </Responsive>
                }

                {
                  !noComposeButton &&
                  <FloatingActionButton />
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

export default connect()(Layout)