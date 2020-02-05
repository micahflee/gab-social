import Header from './header'

export default class PageLayout extends PureComponent {
  static propTypes = {
    layout: PropTypes.object,
  }

  render() {
    const { children, layout } = this.props

    const right = layout.RIGHT || null

    return (
      <div className={[styles.default, styles.flexRow, styles.width100PC].join(' ')}>
        <Header />
        <main role='main' className={[styles.default, styles.flexShrink1, styles.flexGrow1, styles.flexRow].join(' ')}>
          <div className={[styles.default, styles.width1015PX, styles.flexRow, styles.justifyContentSpaceBetween].join(' ')}>
            <div className={[styles.default, styles.width660PX, styles.z1, styles.borderColorSubtle, styles.borderLeft1PX, styles.borderRight1PX].join(' ')}>
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
