import classNames from 'classnames/bind'

const cx = classNames.bind(_s)

const COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  brand: 'brand',
  error: 'error',
  white: 'white',
  inherit: 'inherit',
  pro: 'pro',
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
    badge: PropTypes.bool,
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
      htmlFor,
      badge
    } = this.props

    const classes = cx(className, {
      default: 1,
      text: 1,

      radiusSmall: badge,
      lineHeight15: badge,
      px5: badge,

      colorPrimary: color === COLORS.primary,
      colorSecondary: color === COLORS.secondary,
      colorTertiary: color === COLORS.tertiary,
      colorBrand: color === COLORS.brand,
      colorWhite: color === COLORS.white,
      colorGabPro: color === COLORS.pro,
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