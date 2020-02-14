import ColumnHeader from './column_header'
import Header from './header'

export default class PageLayout extends PureComponent {
  static propTypes = {
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.boolean,
  }

  render() {
    const { children, title, showBackBtn, layout } = this.props

    const right = layout.RIGHT || null
    const headerRight = layout.HEADER_RIGHT || null

    return (
      <div className={[styles.default, styles.flexRow, styles.width100PC, styles.backgroundColorSubtle3].join(' ')}>

        <Header />

        <main role='main' className={[styles.default, styles.flexShrink1, styles.flexGrow1, styles.borderColorSubtle2, styles.borderLeft1PX].join(' ')}>

          <div className={[styles.default, styles.height53PX, styles.borderBottom1PX, styles.borderColorSubtle2, styles.backgroundColorSubtle3, styles.z3, styles.top0, styles.positionFixed].join(' ')}>
            <div className={[styles.default, styles.height53PX, styles.paddingLeft15PX, styles.width1015PX, styles.flexRow, styles.justifyContentSpaceBetween].join(' ')}>
              <div className={[styles.default, styles.width660PX].join(' ')}>
                <ColumnHeader title={title} />
              </div>
              <div className={[styles.default, styles.width325PX].join(' ')}>
                { headerRight }
              </div>
            </div>
          </div>

          <div className={[styles.default, styles.height53PX].join(' ')}></div>

          <div className={[styles.default, styles.width1015PX, styles.flexRow, styles.justifyContentSpaceBetween, styles.paddingLeft15PX, styles.paddingVertical15PX].join(' ')}>
            <div className={[styles.default, styles.width660PX, styles.z1].join(' ')}>
              <div className={styles.default}>
                {children}
              </div>
            </div>

            <div className={[styles.default, styles.width325PX].join(' ')}>
              <div className={styles.default}>
                {right}
              </div>
            </div>
          </div>

        </main>

      </div>
    )
  }

}
