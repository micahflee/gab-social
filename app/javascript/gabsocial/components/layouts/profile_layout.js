import ColumnHeader from '../column_header'
import Sidebar from '../sidebar'

export default class ProfileLayout extends PureComponent {
  static propTypes = {
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { children } = this.props

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.backgroundcolorSecondary3].join(' ')}>

        <Sidebar />

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.bordercolorSecondary2, _s.borderLeft1PX].join(' ')}>

          <div className={[_s.default, _s.height350PX, _s.width100PC].join(' ')}>
            <img
              className={[_s.default, _s.height350PX, _s.width100PC, _s.objectFitCover].join(' ')}
              src='https://gab.com/media/user/bz-5cf53d08403d4.jpeg'
            />
          </div>

          <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.paddingLeft15PX, _s.paddingVertical15PX].join(' ')}>
            <div className={[_s.default, _s.z1].join(' ')}>
              {children}
            </div>
          </div>

        </main>

      </div>
    )
  }

}
