import ColumnHeader from '../column_header'
import Header from '../header'

export default class ProfileLayout extends PureComponent {
  static propTypes = {
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.boolean,
  }

  render() {
    const { children } = this.props

    return (
      <div className={[styles.default, styles.flexRow, styles.width100PC, styles.backgroundColorSubtle3].join(' ')}>

        <Header />

        <main role='main' className={[styles.default, styles.flexShrink1, styles.flexGrow1, styles.borderColorSubtle2, styles.borderLeft1PX].join(' ')}>

          <div className={[styles.default, styles.height350PX, styles.width100PC].join(' ')}>
            <img
              className={[styles.default, styles.height350PX, styles.width100PC, styles.objectFitCover].join(' ')}
              src='https://gab.com/media/user/bz-5cf53d08403d4.jpeg'
            />
          </div>

          <div className={[styles.default, styles.width1015PX, styles.flexRow, styles.justifyContentSpaceBetween, styles.paddingLeft15PX, styles.paddingVertical15PX].join(' ')}>
            <div className={[styles.default, styles.z1].join(' ')}>
              {children}
            </div>
          </div>

        </main>

      </div>
    )
  }

}
