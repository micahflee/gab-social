import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Layout from './layout'
import TrendsPanel from '../components/panel/trends_panel'
import GroupSidebarPanel from '../components/panel/groups_panel'
import SignUpLogInPanel from '../components/panel/sign_up_log_in_panel'
import SidebarPanelGroup from '../components/sidebar_panel_group'
import Responsive from '../features/ui/util/responsive_component'
import Heading from '../components/heading'
import GroupSortBlock from '../components/group_sort_block'

export default class GroupLayout extends ImmutablePureComponent {

  static propTypes = {
    actions: PropTypes.array,
    children: PropTypes.node,
    group: ImmutablePropTypes.map,
    groupId: PropTypes.string,
    layout: PropTypes.object,
    relationships: ImmutablePropTypes.map,
    title: PropTypes.string,
  }

  render() {
    const { children, title } = this.props

    const pageTitleBlock = (
      <div className={[_s.default, _s.pl15, _s.py10].join(' ')}>
        <Heading size='h2'>Popular posts across Gab</Heading>
      </div>
    )

    return (
      <Layout
        showGlobalFooter
        noRightSidebar
        showLinkFooterInSidebar
        page='explore'
        title={title}
      >
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.width100PC].join(' ')}>

            <div className={[_s.default, _s.width100PC, _s.z1].join(' ')}>
              <div className={[_s.default, _s.mt15, _s.px10].join(' ')}>
                <SignUpLogInPanel key='explore-page-signup-login-panel' isXS />
              </div>

              {pageTitleBlock}

              <GroupSortBlock />

              {children}
            </div>

          </div>
        </Responsive>

        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.width100PC, _s.pl15].join(' ')}>

            <div className={[_s.default, _s.flexRow, _s.width100PC, _s.justifyContentEnd].join(' ')}>
              <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>  

                <div className={_s.default}>
                  {pageTitleBlock}

                  <GroupSortBlock />

                  {children}
                </div>
              </div>

              <div className={[_s.default, _s.ml15, _s.width340PX].join(' ')}>
                <Sticky top={73} enabled>
                  <div className={[_s.default, _s.width340PX].join(' ')}>
                    <SidebarPanelGroup
                      page='explore'
                      layout={[
                        <SignUpLogInPanel key='explore-page-signup-login-panel' />,
                        <GroupSidebarPanel groupType='featured' key='explore-page-group-panel' />,
                        <TrendsPanel key='explore-page-trends-panel' />,
                      ]}
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
