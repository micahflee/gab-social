import classNames from 'classnames/bind'

const cx = classNames.bind(_s)

// : todo :

export default class AccountActionButton extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    size: PropTypes.oneOf(Object.keys(SIZES)),
    center: PropTypes.bool,
  }

  static defaultProps = {
    size: SIZES.h1,
  }

  render() {
    const { children, size, center } = this.props

    const classes = cx({
      default: 1,
      text: 1,
      textAlignCenter: center,

      colorPrimary: [SIZES.h1, SIZES.h3].indexOf(size) > -1,
      colorSecondary: [SIZES.h2, SIZES.h4, SIZES.h5].indexOf(size) > -1,

      fontSize24PX: size === SIZES.h1,
      fontSize19PX: size === SIZES.h2,
      fontSize16PX: size === SIZES.h3,
      fontSize13PX: size === SIZES.h4,
      fontSize12PX: size === SIZES.h5,

      mt5: [SIZES.h2, SIZES.h4].indexOf(size) > -1,

      lineHeight2: size === SIZES.h5,
      py2: size === SIZES.h5,

      // fontWeightNormal: weight === WEIGHTS.normal,
      fontWeightMedium: [SIZES.h1, SIZES.h5].indexOf(size) > -1,
      fontWeightBold: [SIZES.h3, SIZES.h4].indexOf(size) > -1,
    })

    return React.createElement(
      size,
      {
        className: classes,
        role: 'heading',
      },
      children,
    )
  }
}