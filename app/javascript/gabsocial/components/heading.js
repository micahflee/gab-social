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
    className: PropTypes.string,
    children: PropTypes.any,
    size: PropTypes.oneOf(Object.keys(SIZES)),
  }

  static defaultProps = {
    size: SIZES.h1,
  }

  render() {
    const { className, children, size } = this.props

    const classes = cx({
      default: 1,
      text: 1,

      colorPrimary: [SIZES.h1, SIZES.h3].indexOf(size) > -1,
      colorSecondary: [SIZES.h2, SIZES.h4].indexOf(size) > -1,

      fontSize24PX: size === SIZES.h1,
      fontSize19PX: size === SIZES.h2,
      fontSize16PX: size === SIZES.h3,
      fontSize13PX: size === SIZES.h4,

      marginTop5PX: [SIZES.h2, SIZES.h4].indexOf(size) > -1,

      // fontWeightNormal: weight === WEIGHTS.normal,
      // fontWeightMedium: weight === WEIGHTS.medium,
      fontWeightBold: [SIZES.h3, SIZES.h4].indexOf(size) > -1
    })

    return React.createElement(
      size,
      {
        className: classes,
      },
      children,
    )
  }
}