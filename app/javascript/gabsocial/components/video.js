import { defineMessages, injectIntl } from 'react-intl'
import { is } from 'immutable'
import throttle from 'lodash.throttle'
import classNames from 'classnames/bind'
import { decode } from 'blurhash'
import { isFullscreen, requestFullscreen, exitFullscreen } from '../utils/fullscreen'
import { isPanoramic, isPortrait, minimumAspectRatio, maximumAspectRatio } from '../utils/media_aspect_ratio'
import { displayMedia } from '../initial_state'
import Button from './button'
import Text from './text'

const cx = classNames.bind(_s)

const messages = defineMessages({
  play: { id: 'video.play', defaultMessage: 'Play' },
  pause: { id: 'video.pause', defaultMessage: 'Pause' },
  mute: { id: 'video.mute', defaultMessage: 'Mute sound' },
  unmute: { id: 'video.unmute', defaultMessage: 'Unmute sound' },
  hide: { id: 'video.hide', defaultMessage: 'Hide video' },
  fullscreen: { id: 'video.fullscreen', defaultMessage: 'Full screen' },
  exit_fullscreen: { id: 'video.exit_fullscreen', defaultMessage: 'Exit full screen' },
  sensitive: { id: 'status.sensitive_warning', defaultMessage: 'Sensitive content' },
  hidden: { id: 'status.media_hidden', defaultMessage: 'Media hidden' },
})

const formatTime = secondsNum => {
  let hours = Math.floor(secondsNum / 3600)
  let minutes = Math.floor((secondsNum - (hours * 3600)) / 60)
  let seconds = secondsNum - (hours * 3600) - (minutes * 60)

  if (hours < 10) hours = '0' + hours
  if (minutes < 10) minutes = '0' + minutes
  if (seconds < 10) seconds = '0' + seconds

  return (hours === '00' ? '' : `${hours}:`) + `${minutes}:${seconds}`
}

export const findElementPosition = el => {
  let box

  if (el.getBoundingClientRect && el.parentNode) {
    box = el.getBoundingClientRect()
  }

  if (!box) {
    return {
      left: 0,
      top: 0,
    }
  }

  const docEl = document.documentElement
  const body = document.body

  const clientLeft = docEl.clientLeft || body.clientLeft || 0
  const scrollLeft = window.pageXOffset || body.scrollLeft
  const left = (box.left + scrollLeft) - clientLeft

  const clientTop = docEl.clientTop || body.clientTop || 0
  const scrollTop = window.pageYOffset || body.scrollTop
  const top = (box.top + scrollTop) - clientTop

  return {
    left: Math.round(left),
    top: Math.round(top),
  }
}

export const getPointerPosition = (el, event) => {
  const position = {}
  const box = findElementPosition(el)
  const boxW = el.offsetWidth
  const boxH = el.offsetHeight
  const boxY = box.top
  const boxX = box.left

  let pageY = event.pageY
  let pageX = event.pageX

  if (event.changedTouches) {
    pageX = event.changedTouches[0].pageX
    pageY = event.changedTouches[0].pageY
  }

  position.y = Math.max(0, Math.min(1, (pageY - boxY) / boxH))
  position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW))

  return position
}

export default
@injectIntl
class Video extends PureComponent {

  static propTypes = {
    preview: PropTypes.string,
    src: PropTypes.string.isRequired,
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
  }

  state = {
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    paused: true,
    dragging: false,
    containerWidth: this.props.width,
    fullscreen: false,
    hovered: false,
    muted: false,
    hoveringVolumeButton: false,
    hoveringVolumeControl: false,
    revealed: this.props.visible !== undefined ? this.props.visible : (displayMedia !== 'hide_all' && !this.props.sensitive || displayMedia === 'show_all'),
  }

  volHeight = 100
  volOffset = 13

  volHandleOffset = v => {
    const offset = v * this.volHeight + this.volOffset
    return (offset > 110) ? 110 : offset
  }

  setPlayerRef = c => {
    this.player = c

    if (c) {
      if (this.props.cacheWidth) this.props.cacheWidth(this.player.offsetWidth)
      this.setState({
        containerWidth: c.offsetWidth,
      })
    }
  }

  setVideoRef = c => {
    this.video = c

    if (this.video) {
      const { volume, muted } = this.video
      this.setState({
        volume,
        muted,
      })
    }
  }

  setSeekRef = c => {
    this.seek = c
  }

  setVolumeRef = c => {
    this.volume = c
  }

  setCanvasRef = c => {
    this.canvas = c
  }

  handleClickRoot = e => e.stopPropagation()

  handlePlay = () => {
    this.setState({ paused: false })
  }

  handlePause = () => {
    this.setState({ paused: true })
  }

  handleTimeUpdate = () => {
    const { currentTime, duration } = this.video
    this.setState({
      currentTime: Math.floor(currentTime),
      duration: Math.floor(duration),
    })
  }

  handleVolumeMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseVolSlide, true)
    document.addEventListener('mouseup', this.handleVolumeMouseUp, true)
    document.addEventListener('touchmove', this.handleMouseVolSlide, true)
    document.addEventListener('touchend', this.handleVolumeMouseUp, true)

    this.handleMouseVolSlide(e)

    e.preventDefault()
    e.stopPropagation()
  }

  handleVolumeMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseVolSlide, true)
    document.removeEventListener('mouseup', this.handleVolumeMouseUp, true)
    document.removeEventListener('touchmove', this.handleMouseVolSlide, true)
    document.removeEventListener('touchend', this.handleVolumeMouseUp, true)
  }

  handleMouseVolSlide = throttle(e => {
    const rect = this.volume.getBoundingClientRect()
    const y = 1 - ((e.clientY - rect.top) / this.volHeight)

    if (!isNaN(y)) {
      const slideamt = y
      if (y > 1) {
        slideamt = 1
      } else if (y < 0) {
        slideamt = 0
      }
      this.video.volume = slideamt
      this.setState({ volume: slideamt })
    }
  }, 60)

  handleMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseMove, true)
    document.addEventListener('mouseup', this.handleMouseUp, true)
    document.addEventListener('touchmove', this.handleMouseMove, true)
    document.addEventListener('touchend', this.handleMouseUp, true)

    this.setState({ dragging: true })
    this.video.pause()
    this.handleMouseMove(e)

    e.preventDefault()
    e.stopPropagation()
  }

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove, true)
    document.removeEventListener('mouseup', this.handleMouseUp, true)
    document.removeEventListener('touchmove', this.handleMouseMove, true)
    document.removeEventListener('touchend', this.handleMouseUp, true)

    this.setState({ dragging: false })
    this.video.play()
  }

  handleMouseMove = throttle(e => {
    const { x } = getPointerPosition(this.seek, e)
    const currentTime = Math.floor(this.video.duration * x)

    if (!isNaN(currentTime)) {
      this.video.currentTime = currentTime
      this.setState({ currentTime })
    }
  }, 60)

  togglePlay = () => {
    if (this.state.paused) {
      this.video.play()
    } else {
      this.video.pause()
    }
  }

  toggleFullscreen = () => {
    if (isFullscreen()) {
      exitFullscreen()
    } else {
      requestFullscreen(this.player)
    }
  }

  componentDidMount() {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange, true)
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange, true)
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange, true)
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange, true)

    if (this.props.blurhash) {
      this._decode()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange, true)
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange, true)
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange, true)
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange, true)
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
    if (prevProps.blurhash !== this.props.blurhash && this.props.blurhash) {
      this._decode()
    }
  }

  _decode() {
    const hash = this.props.blurhash
    const pixels = decode(hash, 32, 32)

    if (pixels && this.canvas) {
      const ctx = this.canvas.getContext('2d')
      const imageData = new ImageData(pixels, 32, 32)

      ctx.putImageData(imageData, 0, 0)
    }
  }

  handleFullscreenChange = () => {
    this.setState({ fullscreen: isFullscreen() })
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true })
  }

  handleMouseLeave = () => {
    this.setState({ hovered: false })
  }

  handleMouseEnterAudio = () => {
    this.setState({ hoveringVolumeButton: true })
  }

  handleMouseLeaveAudio = throttle(e => {
    this.setState({ hoveringVolumeButton: false })
  }, 2000)

  handleMouseEnterVolumeControl = () => {
    this.setState({ hoveringVolumeControl: true })
  }

  handleMouseLeaveVolumeControl = throttle(e => {
    this.setState({ hoveringVolumeControl: false })
  }, 2000)

  toggleMute = () => {
    this.video.muted = !this.video.muted
    this.setState({ muted: this.video.muted })
  }

  toggleReveal = () => {
    if (this.props.onToggleVisibility) {
      this.props.onToggleVisibility()
    } else {
      this.setState({ revealed: !this.state.revealed })
    }
  }

  handleLoadedData = () => {
    if (this.props.startTime) {
      this.video.currentTime = this.props.startTime
      this.video.play()
    }
  }

  handleProgress = () => {
    const { buffered, duration } = this.video

    if (!buffered) return
    if (buffered.length > 0) {
      this.setState({
        buffer: buffered.end(0) / duration * 100,
      })
    }
  }

  handleVolumeChange = () => {
    const { volume, muted } = this.video
    this.setState({
      volume,
      muted,
    })
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
      aspectRatio
    } = this.props

    const {
      containerWidth,
      currentTime,
      duration,
      volume,
      buffer,
      dragging,
      paused,
      fullscreen,
      hovered,
      muted,
      revealed,
      hoveringVolumeButton,
      hoveringVolumeControl
    } = this.state

    const progress = (currentTime / duration) * 100

    const volumeHeight = (muted) ? 0 : volume * this.volHeight
    const volumeHandleLoc = (muted) ? this.volHandleOffset(0) : this.volHandleOffset(volume)
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

    if (startTime || fullscreen || dragging) {
      preload = 'auto'
    } else if (detailed) {
      preload = 'metadata'
    } else {
      preload = 'none'
    }

    // className={classNames('video-player', {
    //   inactive: !revealed,
    //   detailed,
    //   inline: inline && !fullscreen,
    //   fullscreen
    // })}

    // : todo spoiler :

    const seekHandleClasses = cx({
      default: 1,
      positionAbsolute: 1,
      circle: 1,
      px10: 1,
      py10: 1,
      backgroundColorBrand: 1,
      marginLeftNeg5PX: 1,
      z3: 1,
      boxShadow1: 1,
      opacity0: !dragging,
      opacity1: dragging || hovered,
    })

    const progressClasses = cx({
      default: 1,
      radiusSmall: 1,
      mt10: 1,
      positionAbsolute: 1,
      height4PX: 1,
    })

    const volumeControlClasses = cx({
      default: 1,
      positionAbsolute: 1,
      backgroundColorOpaque: 1,
      videoPlayerVolume: 1,
      height122PX: 1,
      circle: 1,
      displayNone: !hoveringVolumeButton && !hoveringVolumeControl || !hovered,
    })

    return (
      <div
        className={[_s.default].join(' ')}
        style={playerStyle}
        ref={this.setPlayerRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClickRoot}
        tabIndex={0}
      >

        {
          !revealed &&
          <canvas
            width={32}
            height={32}
            ref={this.setCanvasRef}
            className={[_s.default, _s.positionAbsolute, _s.height100PC, _s.width100PC, _s.top0, _s.left0].join(' ')}
          />
        }

        {
          revealed &&
          <video
            className={[_s.default, _s.height100PC, _s.width100PC, _s.outlineNone].join(' ')}
            playsInline
            ref={this.setVideoRef}
            src={src}
            poster={preview}
            preload={preload}
            loop
            role='button'
            tabIndex='0'
            aria-label={alt}
            title={alt}
            width={width}
            height={height}
            volume={volume}
            onClick={this.togglePlay}
            onPlay={this.handlePlay}
            onPause={this.handlePause}
            onTimeUpdate={this.handleTimeUpdate}
            onLoadedData={this.handleLoadedData}
            onProgress={this.handleProgress}
            onVolumeChange={this.handleVolumeChange}
          />
        }

        { /* <div className={classNames('spoiler-button', { 'spoiler-button--hidden': revealed })}>
          <button type='button' className='spoiler-button__overlay' onClick={this.toggleReveal}>
            <span className='spoiler-button__overlay__label'>
              {intl.formatMessage(sensitive ? messages.sensitive : messages.hidden)}
            </span>
          </button>
        </div> */ }

        <div
          className={volumeControlClasses}
          onMouseDown={this.handleVolumeMouseDown}
          onMouseEnter={this.handleMouseEnterVolumeControl}
          onMouseLeave={this.handleMouseLeaveVolumeControl}
          ref={this.setVolumeRef}
        >
          <div
            className={[_s.default, _s.radiusSmall, _s.my10, _s.positionAbsolute, _s.width4PX, _s.ml10, _s.backgroundColorPrimaryOpaque].join(' ')}
            style={{
              height: '102px',
            }}
          />
          <div
            className={[_s.default, _s.radiusSmall, _s.my10, _s.bottom0, _s.positionAbsolute, _s.width4PX, _s.ml10, _s.backgroundColorPrimary].join(' ')}
            style={{
              height: `${volumeHeight}px`
            }}
          />
          <span
            className={[_s.default, _s.cursorPointer, _s.positionAbsolute, _s.circle, _s.px5, _s.boxShadow1, _s.marginBottomNeg5PX, _s.py5, _s.backgroundColorPrimary, _s.z3].join(' ')}
            tabIndex='0'
            style={{
              marginLeft: '7px',
              bottom: `${volumeHandleLoc}px`,
            }}
          />
        </div>

        <div className={[_s.default, _s.z2, _s.px15, _s.videoPlayerControlsBackground, _s.positionAbsolute, _s.bottom0, _s.right0, _s.left0].join(' ')}>

          <div
            className={[_s.default, _s.cursorPointer, _s.height22PX, _s.videoPlayerSeek].join(' ')}
            onMouseDown={this.handleMouseDown}
            ref={this.setSeekRef}
          >

            <div className={[progressClasses, _s.backgroundPanel, _s.width100PC].join(' ')} />
            <div className={[progressClasses, _s.backgroundSubtle].join(' ')} style={{ width: `${buffer}%` }} />
            <div className={[progressClasses, _s.backgroundColorBrand].join(' ')} style={{ width: `${progress}%` }} />

            <span
              className={seekHandleClasses}
              tabIndex='0'
              style={{
                left: `${progress}%`
              }}
            />
          </div>

          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.pb5, _s.noSelect].join(' ')}>
            <Button
              narrow
              backgroundColor='none'
              aria-label={intl.formatMessage(paused ? messages.play : messages.pause)}
              onClick={this.togglePlay}
              icon={paused ? 'play' : 'pause'}
              iconWidth='16px'
              iconHeight='16px'
              iconClassName={_s.fillColorWhite}
              className={_s.pl0}
            />

            <div className={[_s.default, _s.marginLeftAuto, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <Text color='white' size='small'>
                {formatTime(currentTime)}
                &nbsp;/&nbsp;
                {formatTime(duration)}
              </Text>

              <Button
                narrow
                backgroundColor='none'
                type='button'
                aria-label={intl.formatMessage(muted ? messages.unmute : messages.mute)}
                onClick={this.toggleMute}
                icon={muted ? 'audio-mute' : 'audio'}
                iconWidth='24px'
                iconHeight='24px'
                iconClassName={_s.fillColorWhite}
                className={[_s.px10, _s.ml10].join(' ')}
                onMouseEnter={this.handleMouseEnterAudio}
                onMouseLeave={this.handleMouseLeaveAudio}
              />

              <Button
                narrow
                backgroundColor='none'
                aria-label={intl.formatMessage(fullscreen ? messages.exit_fullscreen : messages.fullscreen)}
                onClick={this.toggleFullscreen}
                icon={fullscreen ? 'minimize-fullscreen' : 'fullscreen'}
                iconWidth='20px'
                iconHeight='20px'
                iconClassName={_s.fillColorWhite}
                className={[_s.px10, _s.pr0].join(' ')}
              />
            </div>
          </div>

        </div>
      </div>
    )
  }

}
