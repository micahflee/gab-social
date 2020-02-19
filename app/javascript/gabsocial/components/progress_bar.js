import Text from './text'

export default class ProgressBar extends PureComponent {
  static propTypes = {
    progress: PropTypes.number,
  }

  render() {
    const { progress } = this.props

    const completed = Math.min(parseFloat(progress), 100)
    const style = {
      width: `${completed}%`,
    }
    const title = `${completed}% covered this month`

    return (
      <a href='https://shop.dissenter.com/category/donations' className={[_s.default, _s.backgroundPanel, _s.noUnderline, _s.circle, _s.overflowHidden, _s.height22PX, _s.cursorPointer].join(' ')}>
        <div className={[_s.default, _s.backgroundColorBrandDark, _s.circle, _s.height22PX].join(' ')} style={style} />
        <div className={[_s.default, _s.positionAbsolute,  _s.width100PC, _s.height22PX, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
          <Text size='small' weight='bold' color='white'>
            {title}
          </Text>
        </div>
      </a>
    )
  }
}