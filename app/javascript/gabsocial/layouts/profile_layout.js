import Sticky from 'react-stickynode'
import Sidebar from '../components/sidebar'
import Image from '../components/image'

export default class ProfileLayout extends PureComponent {
  static propTypes = {
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { children, layout } = this.props

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.backgroundcolorSecondary3].join(' ')}>

        <Sidebar />

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.borderColorSecondary2, _s.borderLeft1PX].join(' ')}>

          <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.paddingLeft15PX, _s.paddingVertical15PX].join(' ')}>
            <div className={[_s.default, _s.z1, _s.width100PC].join(' ')}>
              <div className={[_s.default, _s.height350PX, _s.width100PC].join(' ')}>
                <Image className={_s.height350PX} src='https://gab.com/media/user/bz-5cf53d08403d4.jpeg' />
              </div>
              <div className={[_s.default, _s.backgroundColorPrimary].join(' ')}>

              </div>

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
            </div>
          </div>

        </main>

      </div>
    )
  }

}
