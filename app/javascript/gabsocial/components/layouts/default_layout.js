import Sticky from 'react-stickynode'
import Search from '../search'
import ColumnHeader from '../column_header'
import Sidebar from '../sidebar'

export default class DefaultLayout extends PureComponent {
  static propTypes = {
    actions: PropTypes.array,
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { children, title, showBackBtn, layout, actions } = this.props

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.backgroundcolorSecondary3].join(' ')}>

        <Sidebar />

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.borderColorSecondary2, _s.borderLeft1PX].join(' ')}>

          <div className={[_s.default, _s.height53PX, _s.borderBottom1PX, _s.borderColorSecondary2, _s.backgroundcolorSecondary3, _s.z3, _s.top0, _s.positionFixed].join(' ')}>
            <div className={[_s.default, _s.height53PX, _s.paddingLeft15PX, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
              <div className={[_s.default, _s.width645PX].join(' ')}>
                <ColumnHeader title={title} showBackBtn={showBackBtn} actions={actions} />
              </div>
              <div className={[_s.default, _s.width340PX].join(' ')}>
                <Search />
              </div>
            </div>
          </div>

          <div className={[_s.default, _s.height53PX].join(' ')}></div>

          <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.paddingLeft15PX, _s.paddingVertical15PX].join(' ')}>
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

        </main>

      </div>
    )
  }

}
