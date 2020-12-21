import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import { decode } from 'blurhash'
import { autoPlayGif, displayMedia } from '../initial_state'
import { CX } from '../constants'
import Icon from './icon'
import Image from './image'
import Text from './text'

class MediaItem extends ImmutablePureComponent {

  state = {
    loaded: false,
    visible: displayMedia !== 'hide_all' && !this.props.attachment.getIn(['status', 'sensitive']) || displayMedia === 'show_all',
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
    const {
      account,
      attachment,
      isSmall,
    } = this.props
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

    const containerClasses = CX({
      d: 1,
      posAbs: 1,
      top0: 1,
      h100PC: 1,
      // w100PC: 1,
      py2: !isSmall,
      px2: !isSmall,
    })

    const linkClasses = CX({
      d: 1,
      w100PC: 1,
      // h100PC: 1,
      overflowHidden: 1,
      border1PX: 1,
      borderColorPrimary: 1,
    })

    const statusUrl = `/${account.getIn(['acct'])}/posts/${status.get('id')}`;

    // : todo : fix dimensions to be like albums

    return (
      <div className={[_s.d, _s.pt25PC].join(' ')}>
        <div className={containerClasses}>
          <NavLink
            to={statusUrl}
            title={title}
            className={linkClasses}
          >
            {
              (!loaded || !visible) &&
              <canvas
                height='100%'
                width='100%'
                ref={this.setCanvasRef}
                className={[_s.d, _s.w100PC, _s.h100PC, _s.z2].join(' ')}
              />
            }

            {
              visible &&
              <Image
                height='100%'
                width=''
                src={attachment.get('preview_url')}
                alt={attachment.get('description')}
                title={attachment.get('description')}
                onLoad={this.handleImageLoad}
                className={_s.z1}
              />
            }

            <div className={[_s.d, _s.aiCenter, _s.jcCenter, _s.h100PC, _s.w100PC, _s.z3, _s.posAbs].join(' ')}>
              {
                !visible &&
                <Icon
                  id='hidden'
                  size='22px'
                  className={[_s.cWhite].join('')}
                />
              }

              {
                !!badge &&
                <div className={[_s.d, _s.posAbs, _s.radiusSmall, _s.bgBlackOpaque, _s.px5, _s.py5, _s.mr5, _s.mt5, _s.mb5, _s.bottom0, _s.right0].join(' ')}>
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

MediaItem.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
  attachment: ImmutablePropTypes.map.isRequired,
  isSmall: PropTypes.bool,
}

export default MediaItem