import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'

class Image extends React.PureComponent {

  state = {
    error: false,
  }

  handleOnError = () => {
    this.setState({ error: true })
  }

  render() {
    const {
      alt,
      src,
      fit,
      className,
      nullable,
      isLazy,
      imageRef,
      ...otherProps
    } = this.props
    const { error } = this.state

    const classes = CX(className, {
      d: 1,
      objectFitCover: !!src && fit === 'cover',
      bgSecondary: !src,
    })

    //If error and not our own image
    if (error && nullable) {
      return null
    }

    if (!src) {
      return (
        <div className={classes} />
      )
    }

    return (
      <img
        alt={alt}
        className={classes}
        {...otherProps}
        ref={imageRef}
        src={src}
        onError={this.handleOnError}
        loading={isLazy ? 'lazy' : undefined}
      />
    )
  }

}

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  isLazy: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  fit: PropTypes.oneOf(['contain', 'cover', 'tile', 'none']),
  nullable: PropTypes.bool,
  lazy: PropTypes.bool,
  imageRef: PropTypes.func,
}

Image.defaultProps = {
  width: '100%',
  fit: 'cover',
}

export default Image