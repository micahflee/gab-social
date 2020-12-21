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
    visible: true,
  }

  componentDidMount() {
    const { attachment } = this.props
    if (!attachment) return

    if (attachment.get('blurhash')) {
      this._decode()
    }

    this.setState({
      visible: displayMedia !== 'hide_all' && !this.props.attachment.getIn(['status', 'sensitive']) || displayMedia === 'show_all',
    })
  }

  componentDidUpdate(prevProps) {
    const { attachment } = this.props
    const { prevAttachment } = prevProps

    if (prevAttachment !== attachment) {
      this._decode()
      return
    }

    if (prevAttachment.get('blurhash') !== attachment.get('blurhash') && attachment.get('blurhash')) {
      this._decode()
    }
  }

  _decode = () => {
    const { attachment } = this.props
    if (!attachment) return

    const hash = attachment.get('blurhash')
    const pixels = decode(hash, 160, 160)

    if (pixels && this.canvas) {
      const ctx = this.canvas.getContext('2d')
      const imageData = new ImageData(pixels, 160, 160)

      ctx.putImageData(imageData, 0, 0)
    }
  }

  setCanvasRef = (c) => {
    this.canvas = c
  }

  handleImageLoad = () => {
    this.setState({ loaded: true })
  }

  hoverToPlay() {
    const { attachment } = this.props
    if (!attachment) return

    return !autoPlayGif && ['gifv', 'video'].indexOf(attachment.get('type')) !== -1
  }

  render() {
    const {
      account,
      attachment,
      isSmall,
    } = this.props
    const { visible, loaded } = this.state
    
    if (!attachment || !account) return null
    
    const status = attachment.get('status')
    const title = status.get('spoiler_text') || attachment.get('description')

    const attachmentType = attachment.get('type')
    const aspectRatio = attachment.getIn(['meta', 'aspect'])

    const isVideo = attachmentType === 'video'
    let badge = null

    if (isVideo) {
      const duration = attachment.getIn(['meta', 'duration'])
      badge = (duration / 60).toFixed(2)
    } else if (attachmentType === 'gifv') {
      badge = 'GIF'
    }

    const statusUrl = `/${account.getIn(['acct'])}/posts/${status.get('id')}`

    const isSmallRatio = aspectRatio < 1
    const isSquare = aspectRatio === 1
    const containerClasses = CX({
      d: 1,
      px5: 1,
      flex1: !isSmallRatio && !isSquare,
      minW198PX: !isVideo && !isSmallRatio && !isSquare,
      minW232PX: isVideo && !isSmallRatio && !isSquare,
      minW120PX: isSmallRatio,
      minW162PX: isSquare,
    })

    const paddedContainerClasses = CX({
      d: 1,
      h100PC: isSmallRatio || isSquare,
      pt100PC: isSmallRatio || isSquare || !isVideo,
      pt5625PC: isVideo && !isSmallRatio && !isSquare,
    })

    return (
      <div className={containerClasses}>
        <NavLink
          className={[_s.d, _s.noUnderline, _s.outlineNone, _s.bgTransparent, _s.flexGrow1].join(' ')}
          to={statusUrl}
          title={title}
        >
          <div className={[_s.d, _s.mt5, _s.mb10, _s.flexGrow1].join(' ')}>
            <div className={paddedContainerClasses}>
              <div className={[_s.d, _s.posAbs, _s.top0, _s.right0, _s.left0, _s.bottom0].join(' ')}>
                <div className={[_s.d, _s.h100PC, _s.aiCenter, _s.jcCenter, _s.radiusSmall, _s.overflowHidden].join(' ')}>
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

                  {
                    (!visible || !!badge) &&
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
                  }
              
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      </div>
    )

    // return (
    //   <div className={[_s.d, _s.pt25PC].join(' ')}>
    //     <div className={containerClasses}>
    //       <NavLink
    //         to={statusUrl}
    //         title={title}
    //         className={linkClasses}
    //       >
    //         {
    //           (!loaded || !visible) &&
    //           <canvas
    //             height='100%'
    //             width='100%'
    //             ref={this.setCanvasRef}
    //             className={[_s.d, _s.w100PC, _s.h100PC, _s.z2].join(' ')}
    //           />
    //         }

    //         {
    //           visible &&
    //           <Image
    //             height='100%'
    //             width=''
    //             src={attachment.get('preview_url')}
    //             alt={attachment.get('description')}
    //             title={attachment.get('description')}
    //             onLoad={this.handleImageLoad}
    //             className={_s.z1}
    //           />
    //         }

   
    //       </NavLink>
    //     </div>
    //   </div>
    // )
  }

}

MediaItem.propTypes = {
  isDummy: PropTypes.bool.isRequired,
  account: ImmutablePropTypes.map.isRequired,
  attachment: ImmutablePropTypes.map.isRequired,
  isSmall: PropTypes.bool,
}

export default MediaItem