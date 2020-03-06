import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import { fromJS, is } from 'immutable'
import { throttle } from 'lodash'
import classNames from 'classnames/bind'
import { decode } from 'blurhash'
import { isFullscreen, requestFullscreen, exitFullscreen } from '../../utils/fullscreen'
import { isPanoramic, isPortrait, minimumAspectRatio, maximumAspectRatio } from '../../utils/media_aspect_ratio'
import { displayMedia } from '../../initial_state'
import Button from '../../components/button'
import Icon from '../../components/icon'
import Text from '../../components/text'

const cx = classNames.bind(_s)

const messages = defineMessages({
  play: { id: 'video.play', defaultMessage: 'Play' },
  pause: { id: 'video.pause', defaultMessage: 'Pause' },
  mute: { id: 'video.mute', defaultMessage: 'Mute sound' },
  unmute: { id: 'video.unmute', defaultMessage: 'Unmute sound' },
  hide: { id: 'video.hide', defaultMessage: 'Hide video' },
  fullscreen: { id: 'video.fullscreen', defaultMessage: 'Full screen' },
  exit_fullscreen: { id: 'video.exit_fullscreen', defaultMessage: 'Exit full screen' },
});

const formatTime = secondsNum => {
  let hours = Math.floor(secondsNum / 3600);
  let minutes = Math.floor((secondsNum - (hours * 3600)) / 60);
  let seconds = secondsNum - (hours * 3600) - (minutes * 60);

  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;

  return (hours === '00' ? '' : `${hours}:`) + `${minutes}:${seconds}`;
};

export const findElementPosition = el => {
  let box;

  if (el.getBoundingClientRect && el.parentNode) {
    box = el.getBoundingClientRect();
  }

  if (!box) {
    return {
      left: 0,
      top: 0,
    };
  }

  const docEl = document.documentElement;
  const body = document.body;

  const clientLeft = docEl.clientLeft || body.clientLeft || 0;
  const scrollLeft = window.pageXOffset || body.scrollLeft;
  const left = (box.left + scrollLeft) - clientLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const scrollTop = window.pageYOffset || body.scrollTop;
  const top = (box.top + scrollTop) - clientTop;

  return {
    left: Math.round(left),
    top: Math.round(top),
  };
};

export const getPointerPosition = (el, event) => {
  const position = {};
  const box = findElementPosition(el);
  const boxW = el.offsetWidth;
  const boxH = el.offsetHeight;
  const boxY = box.top;
  const boxX = box.left;

  let pageY = event.pageY;
  let pageX = event.pageX;

  if (event.changedTouches) {
    pageX = event.changedTouches[0].pageX;
    pageY = event.changedTouches[0].pageY;
  }

  position.y = Math.max(0, Math.min(1, (pageY - boxY) / boxH));
  position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));

  return position;
};

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
    onOpenVideo: PropTypes.func,
    onCloseVideo: PropTypes.func,
    detailed: PropTypes.bool,
    inline: PropTypes.bool,
    cacheWidth: PropTypes.func,
    visible: PropTypes.bool,
    onToggleVisibility: PropTypes.func,
    intl: PropTypes.object.isRequired,
    blurhash: PropTypes.string,
    aspectRatio: PropTypes.number,
  };

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
    revealed: this.props.visible !== undefined ? this.props.visible : (displayMedia !== 'hide_all' && !this.props.sensitive || displayMedia === 'show_all'),
  };

  // hard coded in components.scss
  // any way to get ::before values programatically?
  volWidth = 50;
  volOffset = 70;
  volHandleOffset = v => {
    const offset = v * this.volWidth + this.volOffset;
    return (offset > 110) ? 110 : offset;
  }

  setPlayerRef = c => {
    this.player = c;

    if (c) {
      if (this.props.cacheWidth) this.props.cacheWidth(this.player.offsetWidth);
      this.setState({
        containerWidth: c.offsetWidth,
      });
    }
  }

  setVideoRef = c => {
    this.video = c;

    if (this.video) {
      this.setState({ volume: this.video.volume, muted: this.video.muted });
    }
  }

  setSeekRef = c => {
    this.seek = c;
  }

  setVolumeRef = c => {
    this.volume = c;
  }

  setCanvasRef = c => {
    this.canvas = c;
  }

  handleClickRoot = e => e.stopPropagation();

  handlePlay = () => {
    this.setState({ paused: false });
  }

  handlePause = () => {
    this.setState({ paused: true });
  }

  handleTimeUpdate = () => {
    this.setState({
      currentTime: Math.floor(this.video.currentTime),
      duration: Math.floor(this.video.duration),
    });
  }

  handleVolumeMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseVolSlide, true);
    document.addEventListener('mouseup', this.handleVolumeMouseUp, true);
    document.addEventListener('touchmove', this.handleMouseVolSlide, true);
    document.addEventListener('touchend', this.handleVolumeMouseUp, true);

    this.handleMouseVolSlide(e);

    e.preventDefault();
    e.stopPropagation();
  }

  handleVolumeMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseVolSlide, true);
    document.removeEventListener('mouseup', this.handleVolumeMouseUp, true);
    document.removeEventListener('touchmove', this.handleMouseVolSlide, true);
    document.removeEventListener('touchend', this.handleVolumeMouseUp, true);
  }

  handleMouseVolSlide = throttle(e => {
    const rect = this.volume.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.volWidth; //x position within the element.

    if (!isNaN(x)) {
      var slideamt = x;
      if (x > 1) {
        slideamt = 1;
      } else if (x < 0) {
        slideamt = 0;
      }
      this.video.volume = slideamt;
      this.setState({ volume: slideamt });
    }
  }, 60);

  handleMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseMove, true);
    document.addEventListener('mouseup', this.handleMouseUp, true);
    document.addEventListener('touchmove', this.handleMouseMove, true);
    document.addEventListener('touchend', this.handleMouseUp, true);

    this.setState({ dragging: true });
    this.video.pause();
    this.handleMouseMove(e);

    e.preventDefault();
    e.stopPropagation();
  }

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('mouseup', this.handleMouseUp, true);
    document.removeEventListener('touchmove', this.handleMouseMove, true);
    document.removeEventListener('touchend', this.handleMouseUp, true);

    this.setState({ dragging: false });
    this.video.play();
  }

  handleMouseMove = throttle(e => {
    const { x } = getPointerPosition(this.seek, e);
    const currentTime = Math.floor(this.video.duration * x);

    if (!isNaN(currentTime)) {
      this.video.currentTime = currentTime;
      this.setState({ currentTime });
    }
  }, 60);

  togglePlay = () => {
    if (this.state.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  toggleFullscreen = () => {
    if (isFullscreen()) {
      exitFullscreen();
    } else {
      requestFullscreen(this.player);
    }
  }

  componentDidMount() {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange, true);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange, true);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange, true);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange, true);

    if (this.props.blurhash) {
      this._decode();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange, true);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange, true);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange, true);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange, true);
  }

  componentWillReceiveProps(nextProps) {
    if (!is(nextProps.visible, this.props.visible) && nextProps.visible !== undefined) {
      this.setState({ revealed: nextProps.visible });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.revealed && !this.state.revealed && this.video) {
      this.video.pause();
    }
    if (prevProps.blurhash !== this.props.blurhash && this.props.blurhash) {
      this._decode();
    }
  }

  _decode() {
    const hash = this.props.blurhash;
    const pixels = decode(hash, 32, 32);

    if (pixels && this.canvas) {
      const ctx = this.canvas.getContext('2d');
      const imageData = new ImageData(pixels, 32, 32);

      ctx.putImageData(imageData, 0, 0);
    }
  }

  handleFullscreenChange = () => {
    this.setState({ fullscreen: isFullscreen() });
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  }

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  }

  toggleMute = () => {
    this.video.muted = !this.video.muted;
    this.setState({ muted: this.video.muted });
  }

  toggleReveal = () => {
    if (this.props.onToggleVisibility) {
      this.props.onToggleVisibility();
    } else {
      this.setState({ revealed: !this.state.revealed });
    }
  }

  handleLoadedData = () => {
    if (this.props.startTime) {
      this.video.currentTime = this.props.startTime;
      this.video.play();
    }
  }

  handleProgress = () => {
    if (!this.video.buffered) return;
    if (this.video.buffered.length > 0) {
      this.setState({ buffer: this.video.buffered.end(0) / this.video.duration * 100 });
    }
  }

  handleVolumeChange = () => {
    this.setState({ volume: this.video.volume, muted: this.video.muted });
  }

  render() {
    const {
      preview,
      src,
      inline,
      startTime,
      onOpenVideo,
      onCloseVideo,
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
      revealed
    } = this.state

    const progress = (currentTime / duration) * 100;

    const volumeWidth = (muted) ? 0 : volume * this.volWidth;
    const volumeHandleLoc = (muted) ? this.volHandleOffset(0) : this.volHandleOffset(volume);
    const playerStyle = {};

    let { width, height } = this.props;

    console.log("buffer, progress:", buffer, progress)

    if (inline && containerWidth) {
      width = containerWidth;
      const minSize = containerWidth / (16 / 9);

      if (isPanoramic(aspectRatio)) {
        height = Math.max(Math.floor(containerWidth / maximumAspectRatio), minSize);
      } else if (isPortrait(aspectRatio)) {
        height = Math.max(Math.floor(containerWidth / minimumAspectRatio), minSize);
      } else {
        height = Math.floor(containerWidth / aspectRatio);
      }

      playerStyle.height = height;
    }

    let preload;

    if (startTime || fullscreen || dragging) {
      preload = 'auto';
    } else if (detailed) {
      preload = 'metadata';
    } else {
      preload = 'none';
    }

    let warning;

    if (sensitive) {
      warning = <FormattedMessage id='status.sensitive_warning' defaultMessage='Sensitive content' />;
    } else {
      warning = <FormattedMessage id='status.media_hidden' defaultMessage='Media hidden' />;
    }

    // console.log("width, height:", width, height)

    // className={classNames('video-player', {
    //   inactive: !revealed,
    //   detailed,
    //   inline: inline && !fullscreen,
    //   fullscreen
    // })}

    const seekHandleClasses = cx({
      default: 1,
      positionAbsolute: 1,
      circle: 1,
      paddingHorizontal10PX: 1,
      paddingVertical10PX: 1,
      backgroundColorBrand: 1,
      marginLeftNeg5PX: 1,
      z3: 1,
      opacity0: !dragging,
      opacity1: dragging || hovered,
    })

    const progressClasses = cx({
      default: 1,
      radiusSmall: 1,
      marginTop10PX: 1,
      positionAbsolute: 1,
      height4PX: 1,
    })

    return (
      <div
        role='menuitem'
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
            <span className='spoiler-button__overlay__label'>{warning}</span>
          </button>
        </div> */ }

        <div className='video-player__volume' onMouseDown={this.handleVolumeMouseDown} ref={this.setVolumeRef}>
          <div className='video-player__volume__current' style={{ height: `${volumeWidth}px` }} />
          <span
            className={classNames('video-player__volume__handle')}
            tabIndex='0'
            style={{ left: `${volumeHandleLoc}px` }}
          />
        </div>

        <div className={[_s.default, _s.z2, _s.paddingHorizontal15PX, _s.videoPlayerControlsBackground, _s.positionAbsolute, _s.bottom0, _s.right0, _s.left0].join(' ')}>

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

          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.paddingBottom5PX, _s.noSelect].join(' ')}>
            <Button
              narrow
              backgroundColor='none'
              aria-label={intl.formatMessage(paused ? messages.play : messages.pause)}
              onClick={this.togglePlay}
              icon={paused ? 'play' : 'pause'}
              iconWidth='16px'
              iconHeight='16px'
              iconClassName={_s.fillColorWhite}
              className={_s.paddingLeft0}
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
                className={[_s.paddingHorizontal10PX, _s.marginLeft10PX].join(' ')}
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
                className={[_s.paddingHorizontal10PX, _s.paddingRight0].join(' ')}
              />
            </div>
          </div>

        </div>
      </div>
    );
  }

}
