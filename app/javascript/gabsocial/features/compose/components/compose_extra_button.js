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
    buttonRef: PropTypes.func,
  }

  render() {
    const {
      title,
      disabled,
      onClick,
      icon,
      children,
      small,
      active,
      buttonRef
    } = this.props

    const btnClasses = cx({
      backgroundColorSubtle_onHover: !active,
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

    const iconSize = !!small ? '14px' : '16px'

    return (
      <div className={[_s.default, _s.mr2].join(' ')} ref={buttonRef}>
        <Button
          className={btnClasses}
          title={title}
          isDisabled={disabled}
          onClick={onClick}
          backgroundColor='none'
          iconClassName={iconClasses}
          icon={icon}
          iconSize={iconSize}
        />
        {children}
      </div>
    )
  }
}