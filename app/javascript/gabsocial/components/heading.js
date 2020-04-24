import classNames from 'classnames/bind'

// Bind CSS Modules global variable `_s` to classNames module
const cx = classNames.bind(_s)

// Define sizes for enumeration for Heading component `size` prop
const SIZES = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
}

/**
 * Renders an H-tag
 * @param {bool} [props.isCentered] - if text is centered within the element
 * @param {string} [props.size='h1'] - the size of the heading
 */
export default class Heading extends PureComponent {

  static propTypes = {
    children: PropTypes.any,
    isCentered: PropTypes.bool,
    size: PropTypes.oneOf(Object.keys(SIZES)),
  }

  static defaultProps = {
    size: SIZES.h1,
  }

  render() {
    const { children, size, center } = this.props

    // Each size has it's own custom style
    const classes = cx({
      default: 1,
      text: 1,
      textAlignCenter: center,

      colorPrimary: [SIZES.h1, SIZES.h2].indexOf(size) > -1,
      colorSecondary: [SIZES.h3, SIZES.h4, SIZES.h5].indexOf(size) > -1,

      fontSize24PX: size === SIZES.h1,
      fontSize19PX: size === SIZES.h2,
      fontSize16PX: size === SIZES.h3,
      fontSize13PX: size === SIZES.h4,
      fontSize12PX: size === SIZES.h5,

      mt5: [SIZES.h4].indexOf(size) > -1,

      lineHeight2: size === SIZES.h5,
      py2: size === SIZES.h5,

      fontWeightMedium: [SIZES.h1, SIZES.h3, SIZES.h5].indexOf(size) > -1,
      fontWeightBold: [SIZES.h2, SIZES.h4].indexOf(size) > -1,
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