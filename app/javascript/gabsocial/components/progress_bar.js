import classNames from 'classnames/bind'
import Button from './button'
import Text from './text'

const cx = classNames.bind(_s)

export default class ProgressBar extends PureComponent {
  static propTypes = {
    progress: PropTypes.number,
    small: PropTypes.bool,
    title: PropTypes.string,
  }

  render() {
    const {
      progress,
      small,
      title,
      href
    } = this.props

    const completed = Math.min(parseFloat(progress), 100)
    const style = {
      width: `${completed}%`,
    }

    const containerClassName = cx({
      default: 1,
      backgroundColorLoading: !small,
      backgroundColorSubtle2: small,
      noUnderline: 1,
      circle: 1,
      overflowHidden: 1,
      cursorPointer: 1,
      height22PX: !small,
      height4PX: small,
    })

    return (
      <Button 
        href={href}
        noClasses
        className={containerClassName}
      >
        <div className={[_s.default, _s.backgroundColorBrand, _s.circle, _s.height100PC, _s.backgroundCandy].join(' ')} style={style} />
        <div className={[_s.default, _s.posAbs,  _s.width100PC, _s.height100PC, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
          {
            !!title &&
            <Text size='small' weight='bold' color='white' className={_s.textShadow}>
              {title}
            </Text>
          }
        </div>
      </Button>
    )
  }
}