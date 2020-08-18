import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Button from '../button'
import Text from '../text'
import ModalLayout from './modal_layout'

class HomeTimelineSettingsModal extends ImmutablePureComponent {

  render() {
    const { intl } = this.props

    return (
      <div>
        <Text>
          {intl.formatMessage(messages.text)}
        </Text>
        <Text>
          {intl.formatMessage(messages.benefits)}
        </Text>

        <div className={[_s._, _s.my10].join(' ')}>
          <Text>• Schedule Posts</Text>
          <Text>• Get Verified</Text>
          <Text>• Create Groups</Text>
          <Text>• Larger Video and Image Uploads</Text>
          <Text>• Receive the PRO Badge</Text>
          <Text>• Remove in-feed promotions</Text>
        </div>

        <Button
          backgroundColor='brand'
          color='white'
          icon='pro'
          href='https://pro.gab.com'
          className={_s.jcCenter}
          iconClassName={[_s.mr5, _s.cWhite].join(' ')}
        >
          <Text color='inherit' weight='bold' align='center'>
            {intl.formatMessage(messages.title)}
          </Text>
        </Button>

      </div>
    )
  }
}

const messages = defineMessages({
  title: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  text: { id: 'pro_upgrade_modal.text', defaultMessage: 'Gab is fully funded by people like you. Please consider supporting us on our mission to defend free expression online for all people.' },
  benefits: { id: 'pro_upgrade_modal.benefits', defaultMessage: 'Here are just some of the benefits that thousands of GabPRO members receive:' },
})

HomeTimelineSettingsModal.propTypes = {
  intl: PropTypes.object.isRequired,
}

export default injectIntl(HomeTimelineSettingsModal)