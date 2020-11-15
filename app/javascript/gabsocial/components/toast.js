import React from 'react'
import PropTypes from 'prop-types'
import {
  CX,
  TOAST_TYPE_ERROR,
  TOAST_TYPE_SUCCESS,
  // TOAST_TYPE_NOTIFICATION,
} from '../constants'
import Button from './button'
import Image from './image'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'

class Toast extends React.PureComponent {

  componentDidMount() {
    this._timer = setTimeout(() => {
      this.handleOnDismiss()
    }, 5000)
  }

  componentWillUnmount() {
    clearTimeout(this._timer)
  }

  handleOnDismiss = () => {
    this.props.onDismiss(this.props.id)
  }

  render() {
    const {
      image,
      isImageAccount,
      title,
      message,
      date,
      to,
      type,
    } = this.props

    const contentClasses = CX({
      default: 1,
      mt5: 1,
      pt2: 1,
      maxWidth240PX: 1,
      flexRow: !!image,
    })

    const innerContentClasses = CX({
      default: 1,
      flexNormal: 1,
      pl10: !!image,
      pt2: !!image,
      displayInline: !!date && !image,
    })

    const imageClasses = CX({
      radiusSmall: !isImageAccount,
      circle: isImageAccount,
    })

    const dateClasses = CX({
      mr5: 1,
      mt2: !!image,
    })

    return (
      <div className={[_s.default, _s.radiusSmall, _s.mb5, _s.px15, _s.pt10, _s.pb15, _s.bgPrimary, _s.boxShadowToast].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
          <Text size='media' weight='medium' className={[_s.mr15, _s.minWidth160PX].join(' ')}>
            {title}
          </Text>
          <Button
            backgroundColor='secondary'
            color='primary'
            icon='close'
            iconSize='6px'
            onClick={this.handleOnDismiss}
            className={[_s.mlAuto, _s.px10].join(' ')}
          />
        </div>
        <div className={contentClasses}>
          {
            !!image &&
            <Image
              src={image}
              className={imageClasses}
              height='52px'
              width='52px'
            />
          }
          <div className={innerContentClasses}>
            <Text size='small'>
              {message}
            </Text>
            {
              date &&
              <Text color='secondary' size='extraSmall' className={dateClasses}>
                <RelativeTimestamp timestamp={date} />
              </Text>
              }
          </div>
        </div>
      </div>
    )
  }

}

Toast.propTypes = {
  date: PropTypes.string.isRequired,
  image: PropTypes.string,
  isImageAccount: PropTypes.bool,
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string,
  type: PropTypes.oneOf([
    TOAST_TYPE_ERROR,
    TOAST_TYPE_SUCCESS,
  ]).isRequired,
}

export default Toast