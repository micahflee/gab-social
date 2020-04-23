import classnames from 'classnames/bind'

// Bind CSS Modules global variable `_s` to classNames module
const cx = classnames.bind(_s)

/**
 * Renders a divider component
 * @param {bool} [props.isInvisible] - to style the tab bar larger
 * @param {bool} [props.isSmall] - if item is active
 */
export default class Divider extends PureComponent {

  static propTypes = {
    isInvisible: PropTypes.bool,
    isSmall: PropTypes.bool,
  }

  render() {
    const { isSmall, isInvisible } = this.props

    const classes = cx({
      default: 1,
      borderBottom1PX: !isInvisible,
      borderColorSecondary2: !isInvisible,
      width100PC: 1,
      mb15: !isSmall,
      my10: isSmall || isInvisible,
    })

    return <div className={classes} />
  }

}