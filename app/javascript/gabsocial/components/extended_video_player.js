import React from 'react'
import PropTypes from 'prop-types'

class ExtendedVideoPlayer extends React.PureComponent {

  handleLoadedData = () => {
    if (this.props.time) {
      this.video.currentTime = this.props.time
    }
  }

  componentDidMount () {
    this.video.addEventListener('loadeddata', this.handleLoadedData)
  }

  componentWillUnmount () {
    this.video.removeEventListener('loadeddata', this.handleLoadedData)
  }

  setRef = (c) => {
    this.video = c
  }

  handleClick = e => {
    e.stopPropagation()
    const handler = this.props.onClick
    if (handler) handler()
  }

  render () {
    const { src, muted, controls, alt } = this.props

    return (
      <div className={[_s.d, _s.w100PC, _s.h100PC, _s.aiCenter, _s.jcCenter].join(' ')}>
        <video
          className={[_s.d, _s.maxW100PC, _s.maxH100PC].join(' ')}
          playsInline
          ref={this.setRef}
          src={src}
          role='button'
          tabIndex='0'
          aria-label={alt}
          title={alt}
          muted={muted}
          controls={controls}
          loop={!controls}
          onClick={this.handleClick}
        />
      </div>
    )
  }

}

ExtendedVideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  time: PropTypes.number,
  controls: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

export default ExtendedVideoPlayer