import classNames from 'classnames/bind'
import Button from '../../../components/button'

const cx = classNames.bind(_s)

export default class ComposeExtraButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    icon: PropTypes.string,
    small: PropTypes.bool,
    active: PropTypes.bool,
  }

  render() {
    const {
      title,
      disabled,
      onClick,
      icon,
      children,
      small,
      active
    } = this.props

    const containerClasses = cx({
      default: 1,
      mr10: !small,
      mr2: small,
    })

    const btnClasses = cx({
      backgroundColorBrandLight: active,
      py10: !small,
      px10: !small,
      py5: small,
      px5: small,
    })

    const iconClasses = cx({
      fillColorSecondary: !active,
      fillColorWhite: active,
    })

    const iconSize = !!small ? '12px' : '18px'

    return (
      <div className={containerClasses} data-tip={title}>
        <Button
          className={btnClasses}
          title={title}
          disabled={disabled}
          onClick={onClick}
          backgroundColor='secondary'
          iconClassName={iconClasses}
          icon={icon}
          iconWidth={iconSize}
          iconHeight={iconSize}
        />
        {children}
      </div>
    )
  }
}