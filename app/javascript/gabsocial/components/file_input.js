import classNames from 'classnames/bind'
import Image from './image'
import Text from './text'

const cx = classNames.bind(_s)

export default class FileInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    file: PropTypes.any,
    fileType: PropTypes.string,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string,
  }

  static defaultProps = {
    fileType: 'image'
  }

  state = {
    file: null,
  }

  handleOnChange = (e) => {
    this.props.onChange(e)
    this.setState({
      file: URL.createObjectURL(e.target.files[0])
    })
  }

  render() {
    const {
      fileType,
      disabled,
      title,
      height,
      width,
    } = this.props
    const { file } = this.state

    const imageClasses = cx({
      border2PX: 1,
      borderDashed: 1,
      borderColorSecondary: 1,
      backgroundColorPrimary: 1,
      px10: 1,
      py10: 1,
      radiusSmall: 1,
      cursorPointer: 1,
    })

    return (
      <div>
        {
          !!title &&
          <div className={[_s.default, _s.mb10, _s.pl15].join(' ')}>
            <Text size='small' weight='medium' color='secondary'>
              {title}
            </Text>
          </div>
        }

        <label
          className={[_s.default, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}
          htmlFor={`file-input-${title}`}
          style={{
            width,
            height,
          }}
        >
          <Image
            className={imageClasses}
            width={width}
            height={height}
            src={fileType === 'image' ? file : null}
          />
          {
            !file &&
            <div className={[_s.positionAbsolute, _s.cursorPointer].join(' ')}>
              <Text size='medium' color='secondary'>
                Click Here to Upload
              </Text>
            </div>
          }
        </label>

        <input
          id={`file-input-${title}`}
          className={_s.displayNone}
          disabled={disabled}
          onChange={this.handleOnChange}
          type='file'
        />

      </div>
    )
  }
}