import Sticky from 'react-stickynode'
import Search from '../components/search'
import ColumnHeader from '../components/column_header'
import Sidebar from '../components/sidebar'

export default class SettingsLayout extends PureComponent {
  static propTypes = {
    actions: PropTypes.array,
    tabs: PropTypes.array,
    title: PropTypes.string,
  }

  render() {
    const { children, actions, tabs, title } = this.props

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>

        <Sidebar />

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.borderColorSecondary, _s.borderLeft1PX].join(' ')}>

          <div className={[_s.default, _s.height53PX, _s.borderBottom1PX, _s.borderColorSecondary, _s.bgTertiary, _s.z3, _s.top0, _s.posFixed].join(' ')}>
            <div className={[_s.default, _s.height53PX, _s.pl15, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
              <div className={[_s.default, _s.width100PC].join(' ')}>
                <ColumnHeader
                  title={title}
                  showBackBtn={true}
                  actions={actions}
                  tabs={tabs}
                />
              </div>
            </div>
          </div>

          <div className={[_s.default, _s.height53PX].join(' ')}></div>

          <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.pl15, _s.py15].join(' ')}>
            <div className={[_s.default, _s.z1, _s.width100PC].join(' ')}>
              {children}
            </div>
          </div>

        </main>

      </div>
    )
  }

}
