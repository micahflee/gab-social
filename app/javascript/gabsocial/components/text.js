import classNames from 'classnames/bind'

const cx = classNames.bind(_s)

const COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  brand: 'brand',
  error: 'error',
  white: 'white',
  inherit: 'inherit',
}

const SIZES = {
  extraSmall: 'extraSmall',
  small: 'small',
  normal: 'normal',
  medium: 'medium',
  large: 'large',
  extraLarge: 'extraLarge',
}

const WEIGHTS = {
  normal: 'normal',
  medium: 'medium',
  bold: 'bold',
  extraBold: 'extraBold',
}

const ALIGNMENTS = {
  center: 'center',
  left: 'left',
}

export default class Text extends PureComponent {
  static propTypes = {
    tagName: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.any,
    color: PropTypes.oneOf(Object.keys(COLORS)),
    size: PropTypes.oneOf(Object.keys(SIZES)),
    weight: PropTypes.oneOf(Object.keys(WEIGHTS)),
    align: PropTypes.oneOf(Object.keys(ALIGNMENTS)),
    underline: PropTypes.bool,
    htmlFor: PropTypes.string,
  }

  static defaultProps = {
    tagName: 'span',
    color: COLORS.primary,
    size: SIZES.normal,
    weight: WEIGHTS.normal,
  }

  render() {
    const {
      tagName,
      className,
      children,
      color,
      size,
      weight,
      underline,
      align,
      htmlFor
    } = this.props

    const classes = cx(className, {
      default: 1,
      text: 1,

      colorPrimary: color === COLORS.primary,
      colorSecondary: color === COLORS.secondary,
      colorBrand: color === COLORS.brand,
      colorWhite: color === COLORS.white,
      inherit: color === COLORS.inherit,

      fontSize19PX: size === SIZES.large,
      fontSize15PX: size === SIZES.medium,
      fontSize14PX: size === SIZES.normal,
      fontSize13PX: size === SIZES.small,
      fontSize12PX: size === SIZES.extraSmall,

      fontWeightNormal: weight === WEIGHTS.normal,
      fontWeightMedium: weight === WEIGHTS.medium,
      fontWeightBold: weight === WEIGHTS.bold,
      fontWeightExtraBold: weight === WEIGHTS.extraBold,

      textAlignLeft: align === ALIGNMENTS.left,
      textAlignCenter: align === ALIGNMENTS.center,

      underline: underline,
    })

    return React.createElement(
      tagName,
      {
        htmlFor,
        className: classes,
      },
      children,
    )
  }
}