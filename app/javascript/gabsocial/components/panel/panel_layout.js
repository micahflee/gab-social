import classNames from 'classnames/bind'

export default class PanelLayout extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node,
    hasBackground: PropTypes.boolean,
    button: PropTypes.node,
  }

  render() {
    const { title, subtitle, button, hasBackground, children } = this.props

    return (
      <aside className={[styles.default, styles.backgroundWhite, styles.overflowHidden, styles.radiusSmall, styles.marginBottom15PX, styles.borderColorSubtle, styles.border1PX].join(' ')}>
        {
          (title || subtitle) &&
          <div className={[styles.default, styles.paddingHorizontal15PX, styles.paddingVertical10PX, styles.borderColorSubtle, styles.borderBottom1PX].join(' ')}>
            <div className={[styles.default, styles.flexRow, styles.alignItemsCenter].join(' ')}>
              <h1 className={[styles.default, styles.text, styles.fontWeightBold, styles.colorBlack, styles.fontSize16PX].join(' ')}>{title}</h1>
              {
                !!button &&
                <div className={[styles.default, styles.marginLeftAuto].join(' ')}>
                  {button}
                </div>
              }
            </div>
            {subtitle && <h2 className={[styles.default, styles.text, styles.colorSubtle, styles.fontSize13PX, styles.fontWeightBold, styles.marginTop5PX].join(' ')}>{subtitle}</h2>}
          </div>
        }
        <div className={[styles.default, styles.paddingHorizontal15PX, styles.paddingVertical10PX].join(' ')}>
          {children}
        </div>
      </aside>
    )
  }
}