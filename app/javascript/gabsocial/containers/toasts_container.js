import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getToasts } from '../selectors'
import { dismissToast } from '../actions/toasts'
import { CX } from '../constants'
import Toast from '../components/toast'

class ToastsContainer extends React.PureComponent {

  handleOnDismiss = (key) => {
    this.props.dispatch(dismissToast(key))
  }

  render() {
    const { notifications } = this.props
    const hasNotifications = Array.isArray(notifications) && notifications.length > 0
    
    const containerClasses = CX({
      default: 1,
      z5: 1,
      posFixed: 1,
      bottom0: 1,
      left0: 1,
      pl15: 1,
      pt15: 1,
      heightMax100VH: 1,
      pb10: 1,
      displayNone: !hasNotifications
    })
    
    return (
      <div className={containerClasses}>
        {
          hasNotifications && notifications.map((notification) => (
            <Toast
              onDismiss={this.handleOnDismiss}
              key={notification.key}
              id={notification.key}
              title={notification.title}
              type={notification.type}
              to={notification.to}
              image={notification.image}
              message={notification.message}
              date={notification.date}
              isImageAccount={notification.isImageAccount}
            />
          ))
        }
      </div>
    )

  }

}

const mapStateToProps = (state) => {
  const notifications = getToasts(state)
  if (!notifications) return {}
  return { notifications }
}

ToastsContainer.propTypes = {
  notifications: PropTypes.array,
}

export default connect(mapStateToProps)(ToastsContainer)