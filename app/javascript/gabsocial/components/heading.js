import classNames from 'classnames/bind'

const cx = classNames.bind(_s)

const SIZES = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
}

export default class Heading extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    size: PropTypes.oneOf(Object.keys(SIZES)),
  }

  static defaultProps = {
    size: SIZES.h1,
  }

  render() {
    const { children, size } = this.props

    const classes = cx({
      default: 1,
      text: 1,

      colorPrimary: [SIZES.h1, SIZES.h3].indexOf(size) > -1,
      colorSecondary: [SIZES.h2, SIZES.h4, SIZES.h5].indexOf(size) > -1,

      fontSize24PX: size === SIZES.h1,
      fontSize19PX: size === SIZES.h2,
      fontSize16PX: size === SIZES.h3,
      fontSize13PX: size === SIZES.h4,
      fontSize12PX: size === SIZES.h5,

      marginTop5PX: [SIZES.h2, SIZES.h4].indexOf(size) > -1,

      lineHeight2: size === SIZES.h5,
      paddingVertical2PX: size === SIZES.h5,

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