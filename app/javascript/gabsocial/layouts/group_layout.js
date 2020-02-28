import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import Sidebar from '../components/sidebar'
import Search from '../components/search'
import Image from '../components/image'
import Text from '../components/text'
import Button from '../components/button'
import DisplayName from '../components/display_name'
import TabBar from '../components/tab_bar'
import ColumnHeader from '../components/column_header'

export default class GroupLayout extends ImmutablePureComponent {
  static propTypes = {
    actions: PropTypes.array,
    tabs: PropTypes.array,
    group: ImmutablePropTypes.map,
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { group, children, layout, title, showBackBtn, actions, tabs } = this.props

    // const tabs = !account ? null : [
    //   {
    //     to: `/${account.get('acct')}`,
    //     title: 'Timeline',
    //   },
    //   {
    //     to: `/${account.get('acct')}/comments`,
    //     title: 'Comments',
    //   },
    //   {
    //     to: `/${account.get('acct')}/photos`,
    //     title: 'Photos',
    //   },
    //   {
    //     to: `/${account.get('acct')}/videos`,
    //     title: 'Videos',
    //   },
    //   {
    //     to: '',
    //     title: 'More',
    //   },
    // ]

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.backgroundcolorSecondary3].join(' ')}>

        <Sidebar />

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.borderColorSecondary2, _s.borderLeft1PX].join(' ')}>

          <div className={[_s.default, _s.height53PX, _s.borderBottom1PX, _s.borderColorSecondary2, _s.backgroundcolorSecondary3, _s.z3, _s.top0, _s.positionFixed].join(' ')}>
            <div className={[_s.default, _s.height53PX, _s.paddingLeft15PX, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
              <div className={[_s.default, _s.width645PX].join(' ')}>
                <ColumnHeader
                  title={title}
                  showBackBtn={showBackBtn}
                  actions={actions}
                  tabs={tabs}
                />
              </div>
              <div className={[_s.default, _s.width340PX].join(' ')}>
                <Search />
              </div>
            </div>
          </div>

          <div className={[_s.default, _s.height53PX].join(' ')}></div>

          <div className={[_s.default, _s.width1015PX, _s.paddingLeft15PX, _s.paddingVertical15PX].join(' ')}>

            <div className={[_s.default, _s.z1, _s.width100PC, _s.marginBottom15PX].join(' ')}>
              <div className={[_s.default, _s.height350PX, _s.width100PC, _s.radiusSmall, _s.overflowHidden].join(' ')}>
                <Image className={_s.height350PX} src='https://gab.com/media/user/bz-5cf53d08403d4.jpeg' />
              </div>
            </div>

            <div className={[_s.default, _s.flexRow, _s.width100PC, _s.justifyContentSpaceBetween].join(' ')}>
              <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
                <div className={_s.default}>
                  {children}``
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

        </main>

      </div>
    )
  }

}
