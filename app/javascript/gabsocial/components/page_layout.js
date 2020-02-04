import Header from './header'

export default class PageLayout extends PureComponent {
  static propTypes = {
    layout: PropTypes.object,
  };

  render() {
    const { children, layout } = this.props;

    const right = layout.RIGHT || null;

    return (
      <div className={[styles.default, styles.flexRow, styles.width100PC, styles.height100PC].join(' ')}>
        <Header />
        <main role='main' className={[styles.default, styles.flexShrink1, styles.flexGrow1, styles.flexRow].join(' ')}>
          <div className={[styles.default, styles.width990PX, styles.flexRow].join(' ')}>
            <div className={[styles.default, styles.width600PX, styles.z1].join(' ')}>
              <div className={styles.default}>
                {children}
              </div>
            </div>
            <div className={[styles.default, styles.width350PX].join(' ')}>
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
