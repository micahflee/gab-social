import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getToasts } from '../selectors'
import { dismissToast } from '../actions/toasts'
import { CX } from '../constants'
import Toast from '../components/toast'

class ToastsContainer extends React.PureComponent {

  handleOnDismiss = (toastKey) => {
    this.props.dispatch(dismissToast(toastKey))
  }

  render() {
    const { notifications } = this.props

    console.log("notifications:", notifications)

    // const notifications = [
    //   {
    //     key: '1',
    //     title: 'Error',
    //     to: 'to',
    //     image: 'https://gab.com/media/user/58077e8a49705.jpg',
    //     message: 'Unable to follow @andrew',
    //     date: new Date(),
    //     isImageAccount: true,
    //   },
    //   {
    //     key: '2',
    //     title: 'Success',
    //     to: 'to',
    //     image: 'https://gab.com/media/user/58077e8a49705.jpg',
    //     message: 'Your gab was posted. Click here to view',
    //     date: new Date(),
    //     isImageAccount: false,
    //   },
    //   {
    //     key: '3',
    //     title: '',
    //     to: 'to',
    //     image: 'https://gab.com/media/user/58077e8a49705.jpg',
    //     message: 'Unable to follow @andrew',
    //     date: new Date(),
    //     isImageAccount: true,
    //   },
    //   {
    //     key: '4',
    //     title: '',
    //     to: 'to',
    //     image: 'https://gab.com/media/user/58077e8a49705.jpg',
    //     message: 'Your gab was posted. Click here to view',
    //     date: new Date(),
    //     isImageAccount: false,
    //   },
    //   {
    //     key: '5',
    //     title: '',
    //     to: 'to',
    //     message: 'Your gab was deleted',
    //     date: new Date(),
    //     isImageAccount: false,
    //   },
    // ]

    const hasNotifications = !!notifications && notifications.size > 0
    
    const containerClasses = CX({
      d: 1,
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
              id={notification.get('key')}
              key={`toast-${notification.get('key')}`}
              title={notification.get('title', '')}
              to={notification.get('to', null)}
              image={notification.get('image', null)}
              message={notification.get('message', null)}
              date={notification.get('date', null)}
              isImageAccount={notification.get('isImageAccount', null)}
            />
          ))
        }
      </div>
    )

  }

}

const mapStateToProps = (state) => ({
  notifications: state.get('toasts')
})

ToastsContainer.propTypes = {
  notifications: PropTypes.array,
}

export default connect(mapStateToProps)(ToastsContainer)