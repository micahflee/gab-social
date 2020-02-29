import classnames from 'classnames/bind'

const cx = classnames.bind(_s)

export default class Divider extends PureComponent {
  static propTypes = {
    small: PropTypes.bool
  }
  render() {
    const { small } = this.props

    const classes = cx({
      default: 1,
      borderBottom1PX: 1,
      borderColorSecondary2: 1,
      width100PC: 1,
      marginBottom15PX: !small,
      marginVertical10PX: small,
    })

    return (
      <div className={classes} />
    )
  }
}