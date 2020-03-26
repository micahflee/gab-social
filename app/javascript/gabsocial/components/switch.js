import classNames from 'classnames/bind'
import Text from './text'

const cx = classNames.bind(_s)

export default class Switch extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    labelProps: PropTypes.object,
  }

  render() {
    const {
      id,
      description,
      label,
      checked,
      onChange,
      onKeyDown,
      disabled,
      labelProps
    } = this.props

    const checkboxContainerClasses = cx({
      cursorPointer: 1,
      default: 1,
      height24PX: 1,
      width50PX: 1,
      circle: 1,
      border1PX: 1,
      marginLeftAuto: 1,
      borderColorSecondary: 1,
      backgroundColorBrand: checked,
    })

    const checkboxLabelClasses = cx({
      default: 1,
      margin1PX: 1,
      height20PX: 1,
      width20PX: 1,
      circle: 1,
      positionAbsolute: 1,
      backgroundSubtle2: !checked,
      backgroundColorPrimary: checked,
      left0: !checked,
      right0: checked,
    })

    return (
      <div className={[_s.default, _s.flexRow, _s.py5, _s.alignItemsCenter].join(' ')}>
        <Text {...labelProps} className={_s.mr10}>
          {label}
        </Text>

        <label className={checkboxContainerClasses} htmlFor={id}>
          <span className={checkboxLabelClasses} />
          <input type='checkbox' id={id} onChange={onChange} disabled={disabled} className={[_s.visibilityHidden].join(' ')} />
        </label>
      </div>
    )
  }
}