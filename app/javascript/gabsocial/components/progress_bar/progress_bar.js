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

    return (
      <a href='https://shop.dissenter.com/category/donations' className={[styles.default, styles.backgroundPanel, styles.noUnderline, styles.circle, styles.overflowHidden, styles.height22PX, styles.cursorPointer].join(' ')}>
        <div className={[styles.default, styles.backgroundColorBrandDark, styles.circle, styles.height22PX].join(' ')} style={style} />
        <span className={[styles.default, styles.text, styles.width100PC, styles.textAlignCenter, styles.colorWhite, styles.fontSize13PX, styles.positionAbsolute, styles.fontWeightBold, styles.displayFlex, styles.height100PC, styles.justifyContentCenter].join(' ')}>{completed}% covered this month</span>
      </a>
    )
  }
}