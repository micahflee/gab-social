import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  me,
  meUsername,
} from '../../initial_state'
import Button from '../button'
import Text from '../text'
import ModalLayout from './modal_layout'

class EmailConfirmationReminderModal extends React.PureComponent {

  render() {
    const { onClose } = this.props

    return (
      <ModalLayout
        title='Having Email Confirmation Issues?'
        width={480}
        onClose={onClose}
      >
        <Text size='medium' weight='medium' className={_s.mb10}>
          Many email providers block Gab’s emails.        
        </Text>
        <Text size='medium' color='secondary'>
          Please check your spam folder for the confirmation email. If you still do not see an email please reach out to us for help.
        </Text>

        <div className={[_s.d, _s.flexRow, _s.pt15, _s.pb10].join(' ')}>
          <Button
            isOutline
            color='brand'
            backgroundColor='none'
            href={`mailto:support@gab.com?subject=Please%20confirm%20my%20email%20(${me})&body=My%20username%20is:%20${meUsername}%20and%20account%20id%20is:%20${me}`}
            className={[_s.flexRow, _s.aiCenter, _s.jcCenter, _s.mr10].join(' ')}
          >
            <Text color='inherit' weight='medium' align='center'>
              Email Gab Support
            </Text>
          </Button>
        </div>

      </ModalLayout>
    )
  }

}

EmailConfirmationReminderModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default EmailConfirmationReminderModal