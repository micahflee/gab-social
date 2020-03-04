import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import { decode } from 'blurhash'
import { autoPlayGif, displayMedia } from '../initial_state'
import Icon from './icon'
import Image from './image'
import Text from './text'

export default class MediaItem extends ImmutablePureComponent {

  static propTypes = {
    attachment: ImmutablePropTypes.map.isRequired,
  }

  state = {
    visible: displayMedia !== 'hide_all' && !this.props.attachment.getIn(['status', 'sensitive']) || displayMedia === 'show_all',
    loaded: false,
  }

  componentDidMount() {
    if (this.props.attachment.get('blurhash')) {
      this._decode()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.attachment.get('blurhash') !== this.props.attachment.get('blurhash') && this.props.attachment.get('blurhash')) {
      this._decode()
    }
  }

  _decode() {
    const hash = this.props.attachment.get('blurhash')
    const pixels = decode(hash, 160, 160)

    if (pixels && this.canvas) {
      const ctx = this.canvas.getContext('2d')
      const imageData = new ImageData(pixels, 160, 160)

      ctx.putImageData(imageData, 0, 0)
    }
  }

  setCanvasRef = c => {
    this.canvas = c
  }

  handleImageLoad = () => {
    this.setState({ loaded: true })
  }

  hoverToPlay() {
    return !autoPlayGif && ['gifv', 'video'].indexOf(this.props.attachment.get('type')) !== -1
  }

  render() {
    const { attachment } = this.props
    const { visible, loaded } = this.state

    const status = attachment.get('status')
    const title = status.get('spoiler_text') || attachment.get('description')

    const attachmentType = attachment.get('type')
    let badge = null

    if (attachmentType === 'video') {
      const duration = attachment.getIn(['meta', 'duration'])
      badge = (duration / 60).toFixed(2)
    } else if (attachmentType === 'gifv') {
      badge = 'GIF'
    }

    return (
      <div className={[_s.default, _s.width25PC, _s.paddingTop25PC].join(' ')}>
        <div className={[_s.default, _s.positionAbsolute, _s.top0, _s.height100PC, _s.width100PC, _s.paddingVertical5PX, _s.paddingHorizontal5PX].join(' ')}>
          <NavLink
            to={status.get('url')} /* : todo : */
            title={title}
            className={[_s.default, _s.width100PC, _s.height100PC, _s.border1PX, _s.borderColorSecondary, _s.overflowHidden].join(' ')}
          >
            {
              (!loaded || !visible) &&
              <canvas
                height='100%'
                width='100%'
                ref={this.setCanvasRef}
                className={[_s.default, _s.width100PC, _s.height100PC, _s.z2].join(' ')}
              />
            }

            {
              visible &&
              <Image
                height='100%'
                src={attachment.get('preview_url')}
                alt={attachment.get('description')}
                title={attachment.get('description')}
                onLoad={this.handleImageLoad}
                className={_s.z1}
              />
            }

            <div className={[_s.default, _s.alignItemsCenter, _s.justifyContentCenter, _s.height100PC, _s.width100PC, _s.z3, _s.positionAbsolute].join(' ')}>
              {
                !visible &&
                <Icon
                  id='hidden'
                  width='22px'
                  height='22px'
                  className={[_s.fillColorWhite].join('')}
                />
              }

              {
                !!badge &&
                <div className={[_s.default, _s.positionAbsolute, _s.radiusSmall, _s.backgroundColorOpaque, _s.paddingHorizontal5PX, _s.paddingVertical5PX, _s.marginRight5PX, _s.marginVertical5PX, _s.bottom0, _s.right0].join(' ')}>
                  <Text size='extraSmall' color='white'>
                    {badge}
                  </Text>
                </div>
              }

            </div>

          </NavLink>
        </div>
      </div>
    )
  }

}
