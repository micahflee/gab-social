import classNames from 'classnames/bind'

// : testing :
// : todo :
const placeholderSource = 'https://source.unsplash.com/random'
const imageUnavailable = 'https://source.unsplash.com/random'

const cx = classNames.bind(_s)

export default class Image extends PureComponent {
  static propTypes = {
    alt: PropTypes.string,
    src: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fit: PropTypes.oneOf(['contain', 'cover', 'tile', 'none']),
    nullable: PropTypes.bool,
  }

  static defaultProps = {
    width: '100%',
    fit: 'cover',
  }

  state = {
    error: false,
  }

  handleOnError = () => {
    this.setState({ error: true })
  }

  render() {
    const { src, fit, className, nullable, ...otherProps } = this.props
    const { error } = this.state

    let source = src || placeholderSource
    const classes = cx(className, {
      default: 1,
      objectFitCover: fit === 'cover'
    })

    //If error and not our own image
    if (error && nullable) {
      return null
    } else if (error) {
      source = imageUnavailable
    }
    
    return (
      <img
        className={classes}
        {...otherProps}
        src={source}
        onError={this.handleOnError}
      />
    )
  }
}