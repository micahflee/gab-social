import Sticky from 'react-stickynode'
import Search from '../components/search'
import ColumnHeader from '../components/column_header'
import Sidebar from '../components/sidebar'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import NavigationBar from '../components/navigation_bar'
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
      <div className={[_s.default, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>

        <NavigationBar
          title={title}
          tabs={tabs}
          actions={actions}
        />

        <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>
          {
            !noSidebar &&
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              <Sidebar title={title} tabs={tabs} actions={actions} />
            </Responsive>
          }

          <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1].join(' ')}>

            <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentEnd, _s.py15].join(' ')}>

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
                <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                  <div className={[_s.default, _s.width340PX, _s.ml15].join(' ')}>
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
                <Responsive max={BREAKPOINT_EXTRA_SMALL}>
                  <FloatingActionButton />
                </Responsive>
              }

            </div>

          </main>
        </div>
      </div>
    )
  }

}
