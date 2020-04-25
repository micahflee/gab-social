import Sticky from 'react-stickynode'
import Search from '../components/search'
import ColumnHeader from '../components/column_header'
import Sidebar from '../components/sidebar'

export default class SearchLayout extends PureComponent {
  static propTypes = {
    actions: PropTypes.array,
    layout: PropTypes.object,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { children, showBackBtn, layout, actions } = this.props

    const tabs = [
      {
        title: 'Top',
        to: '/search'
      },
      {
        title: 'People',
        to: '/search/people'
      },
      {
        title: 'Groups',
        to: '/search/groups'
      },
      {
        title: 'Gabs',
        to: '/search/gabs'
      },
      {
        title: 'Hashtags',
        to: '/search/hashtags'
      },
    ]


    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.backgroundColorSecondary3].join(' ')}>

        <Sidebar />

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.borderColorSecondary, _s.borderLeft1PX].join(' ')}>

          <div className={[_s.default, _s.height53PX, _s.borderBottom1PX, _s.borderColorSecondary, _s.backgroundColorSecondary3, _s.z3, _s.top0, _s.posFixed].join(' ')}>
            <div className={[_s.default, _s.height53PX, _s.pl15, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
              <div className={[_s.default, _s.width645PX].join(' ')}>
                <ColumnHeader
                  title={'Search'}
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

          <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.pl15, _s.py15].join(' ')}>
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
