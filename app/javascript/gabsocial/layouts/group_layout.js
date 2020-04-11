import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import Layout from './layout'
import GroupHeader from '../components/group_header'

export default class GroupLayout extends ImmutablePureComponent {
  static propTypes = {
    actions: PropTypes.array,
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
    layout: PropTypes.object,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const {
      group,
      children,
      layout,
      showBackBtn,
      actions,
      relationships,
    } = this.props

    const title = !!group ? group.get('title') : undefined

    return (
      <Layout
        noRightSidebar
        title={title}
        actions={actions}
        showBackBtn={showBackBtn}
      >
        <div className={[_s.default, _s.width1015PX, _s.pl15, _s.py15].join(' ')}>

          <GroupHeader group={group} relationships={relationships} />

          <div className={[_s.default, _s.flexRow, _s.width100PC, _s.justifyContentSpaceBetween].join(' ')}>
            <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
              <div className={_s.default}>
                {children}
              </div>
            </div>

            <div className={[_s.default, _s.width340PX].join(' ')}>
              <Sticky top={73} enabled>
                <div className={[_s.default, _s.width340PX].join(' ')}>
                  {layout}
                </div>
              </Sticky>
            </div>
          </div>

        </div>
      </Layout>
    )
  }

}
