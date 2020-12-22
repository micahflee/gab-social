import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { is } from 'immutable'
import { decode } from 'blurhash'
import videojs from 'video.js'
import { isPanoramic, isPortrait, minimumAspectRatio, maximumAspectRatio } from '../utils/media_aspect_ratio'
import { displayMedia } from '../initial_state'
import Button from './button'
import Icon from './icon'
import SensitiveMediaItem from './sensitive_media_item'
import Text from './text'

import '!style-loader!css-loader!video.js/dist/video-js.min.css'

const videoJsOptions = {
  autoplay: false,
  playbackRates: [0.5, 1, 1.5, 2],
  controls: true,
  sources: [{}],
}

class Video extends ImmutablePureComponent {

  state = {
    containerWidth: this.props.width,
    revealed: this.props.visible !== undefined ? this.props.visible : (displayMedia !== 'hide_all' && !this.props.sensitive || displayMedia === 'show_all'),
  }

  componentDidMount() {
    //
  }

  componentWillUnmount() {
    if (this.videoPlayer) {
      this.videoPlayer.dispose()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!is(nextProps.visible, this.props.visible) && nextProps.visible !== undefined) {
      this.setState({ revealed: nextProps.visible })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.revealed && !this.state.revealed && this.video) {
      this.video.pause()
    }
  }

  setPlayerRef = (n) => {
    this.player = n

    if (n) {
      if (this.props.cacheWidth) this.props.cacheWidth(this.player.offsetWidth)
      this.setState({
        containerWidth: n.offsetWidth,
      })
    }
  }

  setVideoRef = (n) => {
    this.video = n
    this.setupVideo()
  }

  setupVideo = () => {
    if (!this.video) return null

    videoJsOptions.sources = [
      {
        src: this.props.src,
        type: this.props.fileContentType,
      },
      {
        src: this.props.sourceMp4,
        type: 'video/mp4',
      },
    ]
    this.videoPlayer = videojs(this.video, videoJsOptions)
  }

  handleClickRoot = (e) => e.stopPropagation()

  toggleReveal = () => {
    if (this.props.onToggleVisibility) {
      this.props.onToggleVisibility()
    } else {
      this.setState({ revealed: !this.state.revealed })
    }
  }

  render() {
    const {
      preview,
      src,
      inline,
      startTime,
      intl,
      alt,
      detailed,
      sensitive,
      aspectRatio,
    } = this.props

    const {
      containerWidth,
      revealed,
    } = this.state

    const playerStyle = {}

    let { width, height } = this.props

    if (inline && containerWidth) {
      width = containerWidth
      const minSize = containerWidth / (16 / 9)

      if (isPanoramic(aspectRatio)) {
        height = Math.max(Math.floor(containerWidth / maximumAspectRatio), minSize)
      } else if (isPortrait(aspectRatio)) {
        height = Math.max(Math.floor(containerWidth / minimumAspectRatio), minSize)
      } else {
        height = Math.floor(containerWidth / aspectRatio)
      }

      playerStyle.height = height
    }

    let preload

    if (startTime) {
      preload = 'auto'
    } else if (detailed) {
      preload = 'metadata'
    } else {
      preload = 'none'
    }

    if (!revealed && sensitive) {
      return <SensitiveMediaItem onClick={this.toggleReveal} />
    }

    return (
      <div
        className={[_s.d, _s.mt10, _s.outlineNone].join(' ')}
        style={playerStyle}
        ref={this.setPlayerRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClickRoot}
        tabIndex={0}
      >
        <div data-vjs-player>
          <video
            className={[_s.d, _s.h100PC, _s.w100PC, _s.outlineNone, 'video-js'].join(' ')}
            ref={this.setVideoRef}
            playsInline
            poster={preview}
            preload={preload}
            role='button'
            tabIndex='0'
            aria-label={alt}
            title={alt}
            width={width}
            height={height}
          />
        </div>

        {
          revealed && sensitive &&
          <div className={[_s.posAbs, _s.z2, _s.top0, _s.right0, _s.mt10, _s.mr10].join(' ')}>
            <Button
              title={intl.formatMessage(messages.toggle_visible)}
              icon='hidden'
              backgroundColor='black'
              className={[_s.px10, _s.bgBlackOpaque_onHover].join(' ')}
              onClick={this.toggleReveal}
            />
          </div>
        }
      </div>
    )
  }
}

const messages = defineMessages({
  toggle_visible: { id: 'media_gallery.toggle_visible', defaultMessage: 'Hide media' },
})

Video.propTypes = {
  preview: PropTypes.string,
  src: PropTypes.string.isRequired,
  sourceMp4: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sensitive: PropTypes.bool,
  startTime: PropTypes.number,
  detailed: PropTypes.bool,
  inline: PropTypes.bool,
  cacheWidth: PropTypes.func,
  visible: PropTypes.bool,
  onToggleVisibility: PropTypes.func,
  intl: PropTypes.object.isRequired,
  blurhash: PropTypes.string,
  aspectRatio: PropTypes.number,
  meta: ImmutablePropTypes.map,
  fileContentType: PropTypes.string,
}

export default injectIntl(Video)