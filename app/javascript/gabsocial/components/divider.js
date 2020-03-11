import classnames from 'classnames/bind'

const cx = classnames.bind(_s)

export default class Divider extends PureComponent {
  static propTypes = {
    small: PropTypes.bool,
    invisible: PropTypes.bool,
  }

  render() {
    const { small, invisible } = this.props

    const classes = cx({
      default: 1,
      borderBottom1PX: !invisible,
      borderColorSecondary2: !invisible,
      width100PC: 1,
      mb15: !small,
      my10: small || invisible,
    })

    return (
      <div className={classes} />
    )
  }
}