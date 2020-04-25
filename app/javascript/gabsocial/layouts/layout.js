import Sticky from 'react-stickynode'
import * as Constants from '../constants'
import Search from '../components/search'
import ColumnHeader from '../components/column_header'
import Sidebar from '../components/sidebar'
// import Header from '../components/header'
// import Footer from '../components/footer'
import FloatingActionButton from '../components/floating_action_button'
import Responsive from '../features/ui/util/responsive_component'

export default class Layout extends PureComponent {
  static propTypes = {
    actions: PropTypes.array,
    tabs: PropTypes.array,
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
    noSidebar: PropTypes.bool,
    noRightSidebar: PropTypes.bool,
    noHeader: PropTypes.bool,
    noComposeButton: PropTypes.bool,
  }

  render() {
    const {
      children,
      title,
      showBackBtn,
      layout,
      actions,
      tabs,
      noSidebar,
      noRightSidebar,
      noHeader,
      noComposeButton,
    } = this.props

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.backgroundColorSecondary3].join(' ')}>

        {
          !noSidebar &&
          <Responsive min={Constants.BREAKPOINT_EXTRA_SMALL}>
            <Sidebar />
          </Responsive>
        }

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.borderColorSecondary, _s.borderLeft1PX].join(' ')}>

          {
            !noHeader &&
            <div className={[_s.default, _s.height53PX, _s.borderBottom1PX, _s.borderColorSecondary, _s.backgroundColorSecondary3, _s.z3, _s.top0, _s.posFixed].join(' ')}>
              <div className={[_s.default, _s.height53PX, _s.pl15, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
                <div className={[_s.default, _s.width645PX].join(' ')}>
                  <ColumnHeader
                    title={title}
                    showBackBtn={showBackBtn}
                    actions={actions}
                    tabs={tabs}
                  />
                </div>
                <Responsive min={Constants.BREAKPOINT_EXTRA_SMALL}>
                  <div className={[_s.default, _s.width340PX].join(' ')}>
                    <Search />
                  </div>
                </Responsive>
              </div>
            </div>
          }

          {
            !noHeader &&
            <div className={[_s.default, _s.height53PX].join(' ')}></div>
          }

          <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.pl15, _s.py15].join(' ')}>

            {
              noRightSidebar && children
            }

            {
              !noRightSidebar &&
              <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
                <div className={_s.default}>
                  {children}
                </div>
              </div>
            }

            {
              !noRightSidebar &&
              <Responsive min={Constants.BREAKPOINT_EXTRA_SMALL}>
                <div className={[_s.default, _s.width340PX].join(' ')}>
                  <Sticky top={73} enabled>
                    <div className={[_s.default, _s.width340PX].join(' ')}>
                      {layout}
                    </div>
                  </Sticky>
                </div>
              </Responsive>
            }

            {
              !noComposeButton &&
              <Responsive max={Constants.BREAKPOINT_EXTRA_SMALL}>
                <FloatingActionButton />
              </Responsive>
            }

          </div>

        </main>

      </div>
    )
  }

}
