import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import Layout from './layout'
import GroupHeader from '../components/group_header'

export default class GroupLayout extends ImmutablePureComponent {

  static propTypes = {
    actions: PropTypes.array,
    children: PropTypes.node,
    group: ImmutablePropTypes.map,
    layout: PropTypes.object,
    relationships: ImmutablePropTypes.map,
    showBackBtn: PropTypes.bool,
    title: PropTypes.string,
  }

  render() {
    const {
      actions,
      children,
      group,
      layout,
      relationships,
      showBackBtn,
      title,
    } = this.props

    return (
      <Layout
        noRightSidebar
        actions={actions}
        showBackBtn={showBackBtn}
        title={title}
      >
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
