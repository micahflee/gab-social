import classNames from 'classnames/bind'
import { autoPlayGif } from '../initial_state'

// : testing :
const placeholderSource = 'https://via.placeholder.com/150'

const cx = classNames.bind(_s)

export default class Image extends PureComponent {
  static propTypes = {
    alt: PropTypes.string,
    src: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fit: PropTypes.oneOf(['contain', 'cover', 'tile', 'none']),
  }

  static defaultProps = {
    width: '100%',
    fit: 'cover',
  }

  render() {
    const { src, fit, className, ...otherProps } = this.props

    const source = src || placeholderSource
    const classes = cx(className, {
      default: 1,
      objectFitCover: fit === 'cover'
    })

    return (
      <img
        className={classes}
        {...otherProps}
        src={source}
      />
    )
  }
}