import classNames from 'classnames/bind'
import Icon from '../icon'

export default class PanelLayout extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
    hasBackground: PropTypes.boolean,
  }

  render() {
    const { title, subtitle, icon, hasBackground, children } = this.props

    return (
      <aside className={[styles.default, styles.backgroundSubtle, styles.overflowHidden, styles.radiusSmall, styles.marginBottom15PX].join(' ')}>
        {
          (title || subtitle) &&
          <div className={[styles.default, styles.paddingHorizontal15PX, styles.paddingVertical10PX, styles.borderColorSubtle, styles.borderBottom1PX].join(' ')}>
            <div className={[styles.default, styles.flexRow, styles.alignItemsCenter].join(' ')}>
              {icon && <Icon id={icon} height='16px' width='16px' className={[styles.default, styles.marginRight10PX].join(' ')} />}
              <span className={[styles.default, styles.text, styles.fontWeightExtraBold, styles.colorBlack, styles.fontSize19PX].join(' ')}>{title}</span>
            </div>
            {subtitle && <span className={[styles.default, styles.text, styles.colorSubtle, styles.fontSize13PX, styles.marginTop5PX].join(' ')}>{subtitle}</span>}
          </div>
        }
        <div className={[styles.default, styles.paddingHorizontal15PX, styles.paddingVertical10PX].join(' ')}>
          {children}
        </div>
      </aside>
    )
  }
}