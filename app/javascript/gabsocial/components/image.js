import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  CX,
  MODAL_MEDIA,
} from '../constants'
import { openModal } from '../actions/modal'

class Image extends React.PureComponent {

  state = {
    error: false,
  }

  handleOnError = () => {
    this.setState({ error: true })
  }

  handleOnClick = () => {
    this.props.onOpenMediaModal()
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
      expandOnClick,
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
      return <div className={classes} />
    }

    return (
      <img
        alt={alt}
        className={classes}
        {...otherProps} // : todo : remove
        ref={imageRef}
        src={src}
        onError={this.handleOnError}
        onClick={expandOnClick ? this.handleOnClick : undefined}
        loading={isLazy ? 'lazy' : undefined}
      />
    )
  }

}

const mapDispatchToProps = (dispatch, { alt, src }) => ({
  onOpenMediaModal() {
    dispatch(openModal(MODAL_MEDIA, {
      alt,
      src,
    }))
  },
});

Image.propTypes = {
  alt: PropTypes.string,
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
  expandOnClick: PropTypes.bool,
  onOpenMediaModal: PropTypes.func.isRequired,
}

Image.defaultProps = {
  width: '100%',
  fit: 'cover',
}

export default connect(null, mapDispatchToProps)(Image)