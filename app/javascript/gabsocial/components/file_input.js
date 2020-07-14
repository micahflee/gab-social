import { CX } from '../constants'
import Icon from './icon'
import Image from './image'
import Text from './text'

export default class FileInput extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func,
    file: PropTypes.any,
    fileType: PropTypes.string,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    id: PropTypes.string.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
    isBordered: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    fileType: 'image',
    isBordered: false,
  }

  state = {
    file: this.props.file,
  }

  handleOnChange = (e) => {
    this.props.onChange(e)
    this.setState({
      file: URL.createObjectURL(e.target.files[0])
    })
  }

  render() {
    const {
      id,
      fileType,
      disabled,
      title,
      height,
      width,
      className,
      isBordered,
    } = this.props
    const { file } = this.state

    const containerClasses = CX(className, {
      default: 1,
      alignItemsCenter: 1,
      cursorPointer: 1,
      justifyContentCenter: 1,
      overflowHidden: true,
      radiusSmall: isBordered,
      px10: isBordered,
      py10: isBordered,
      border2PX: isBordered,
      borderColorSecondary: isBordered,
      borderDashed: isBordered,
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
          className={containerClasses}
          htmlFor={`file-input-${id}`}
          style={{
            width,
            height,
          }}
        >
          <Image
            className={[_s.height100PC, _s.width100PC, _s.radiusSmall].join(' ')}
            src={fileType === 'image' ? file : null}
          />
          {
            !file &&
            <div className={[_s.posAbs, _s.cursorPointer].join(' ')}>
              <Icon id='add-image' size='32px' className={_s.fillSecondary} />
            </div>
          }
        </label>

        <input
          id={`file-input-${id}`}
          className={_s.displayNone}
          disabled={disabled}
          onChange={this.handleOnChange}
          type='file'
        />

      </div>
    )
  }

}