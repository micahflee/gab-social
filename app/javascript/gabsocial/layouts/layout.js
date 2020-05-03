import Sticky from 'react-stickynode'
import Sidebar from '../components/sidebar'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import NavigationBar from '../components/navigation_bar'
// : todo :
// import Footer from '../components/footer'
import FloatingActionButton from '../components/floating_action_button'
import Responsive from '../features/ui/util/responsive_component'

export default class Layout extends PureComponent {

  static propTypes = {
    actions: PropTypes.array,
    children: PropTypes.node,
    layout: PropTypes.object,
    noComposeButton: PropTypes.bool,
    noRightSidebar: PropTypes.bool,
    noSidebar: PropTypes.bool,
    showBackBtn: PropTypes.bool,
    tabs: PropTypes.array,
    title: PropTypes.string,
  }

  render() {
    const {
      actions,
      children,
      layout,
      noComposeButton,
      noRightSidebar,
      noSidebar,
      showBackBtn,
      tabs,
      title,
    } = this.props

    return (
      <div className={[_s.default, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>

        <NavigationBar
          actions={actions}
          tabs={tabs}
          title={title}
        />

        <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>
          {
            !noSidebar &&
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              <Sidebar
                actions={actions}
                showBackBtn={showBackBtn}
                tabs={tabs}
                title={title}
              />
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
