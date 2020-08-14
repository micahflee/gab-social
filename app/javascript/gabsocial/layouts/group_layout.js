import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Layout from './layout'
import GroupHeader from '../components/group_header'
import SidebarPanelGroup from '../components/sidebar_panel_group'
import Responsive from '../features/ui/util/responsive_component'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  LinkFooter,
  SignUpPanel,
  GroupsPanel,
  GroupInfoPanel,
} from '../features/ui/util/async_components'

class GroupLayout extends ImmutablePureComponent {

  render() {
    const {
      children,
      group,
      groupId,
      relationships,
      title,
    } = this.props

    return (
      <Layout
        noRightSidebar
        showBackBtn
        title={title}
        page='group'
      >
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.width100PC].join(' ')}>

            <GroupHeader group={group} relationships={relationships} isXS>
              <WrappedBundle component={GroupInfoPanel} componentParams={{ group, noPanel: true }} />
            </GroupHeader>

            <div className={[_s.default, _s.width100PC, _s.z1].join(' ')}>
              {children}
            </div>

          </div>
        </Responsive>

        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.width100PC, _s.pl15].join(' ')}>

            <GroupHeader group={group} relationships={relationships} />

            <div className={[_s.default, _s.flexRow, _s.width100PC, _s.justifyContentEnd].join(' ')}>
              <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
                <div className={_s.default}>
                  {children}
                </div>
              </div>

              <div className={[_s.default, _s.ml15, _s.width340PX].join(' ')}>
                <Sticky top={73} enabled>
                  <div className={[_s.default, _s.width340PX].join(' ')}>
                    <SidebarPanelGroup
                      page={`group.${groupId}`}
                      layout={[
                        <WrappedBundle component={GroupInfoPanel} componentParams={{ group }} />,
                        SignUpPanel,
                        GroupsPanel,
                        LinkFooter,
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

GroupLayout.propTypes = {
  children: PropTypes.node,
  group: ImmutablePropTypes.map,
  groupId: PropTypes.string,
  relationships: ImmutablePropTypes.map,
  title: PropTypes.string,
}

export default GroupLayout