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
    }, 3500)
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
    } = this.props

    const containerClasses = CX({
      d: 1,
      radiusSmall: 1,
      w228PX: 1,
      mt5: 1,
      mb5: 1,
      px15: 1,
      pt10: 1,
      pb15: !!title,
      pb10: !title,
      bgToast: 1,
      boxShadowToast: 1,
    })

    const contentClasses = CX({
      d: 1,
      mt5: !!title,
      pt2: !!title,
      flexRow: !!image,
    })

    const innerContentClasses = CX({
      d: 1,
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
      <div className={containerClasses}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
          <Text size='medium' color='alt' weight='bold'>
            {title}
          </Text>
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
            <Text size='small' color='alt'>
              {message}
            </Text>
            {
              date &&
              <Text color='tertiary' size='extraSmall' className={dateClasses}>
                {
                  !image &&
                  <Text size='small' color='tertiary' className={[_s.ml5, _s.mr5].join(' ')}>·</Text>
                }
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
}

export default Toast