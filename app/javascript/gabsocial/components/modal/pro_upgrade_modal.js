import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import {
  URL_GAB_PRO,
  DEFAULT_THEME,
} from '../../constants'
import Button from '../button'
import Text from '../text'
import Icon from '../icon'
import Image from '../image'
import ModalLayout from './modal_layout'

class ProUpgradeModal extends React.PureComponent {

  render() {
    const {
      intl,
      onClose,
      theme,
    } = this.props

    const imgSuffix = (theme === 'light' || !theme) ? 'light' : 'dark'

    const title = (
      <span className={[_s.d, _s.flexRow, _s.jcCenter, _s.aiCenter].join(' ')}>
        <span className={[_s.d, _s.mr2].join(' ')}>
          Upgrade to Gab
        </span>
        <span className={[_s.bgPro, _s.cBlack, _s.radiusSmall, _s.px5, _s.py5].join(' ')}>PRO</span>
      </span>
    )

    return (
      <ModalLayout
        title={title}
        width={540}
        onClose={onClose}
      >
        <Text size='medium' weight='medium' className={_s.mb10}>
          {intl.formatMessage(messages.text)}
        </Text>
        <Text size='medium' color='secondary'>
          {intl.formatMessage(messages.benefits)}
        </Text>

        <div className={[_s.d, _s.my10].join(' ')}>
          <Image
            src={`/headers/pro-features-${imgSuffix}.png`}
            width='100%'
            height='auto'
            fit='cover'
            className={[_s.maxH340PX, _s.minH200PX].join(' ')}
          />
        </div>

        <div className={[_s.d, _s.flexRow, _s.py10].join(' ')}>
          <Button
            isOutline
            color='brand'
            backgroundColor='none'
            href={URL_GAB_PRO}
            className={[_s.flexRow, _s.aiCenter, _s.jcCenter, _s.mr10].join(' ')}
          >
            <Text color='inherit' weight='medium' align='center'>
              {intl.formatMessage(messages.learnMore)}
            </Text>
          </Button>
          <Button
            href={URL_GAB_PRO}
            className={[_s.flexRow, _s.flexGrow1, _s.aiCenter, _s.jcCenter].join(' ')}
          >
            <Text color='inherit' size='large' weight='bold' align='center'>
              {intl.formatMessage(messages.upgrade)}
            </Text>
            <Icon id='arrow-right' size='20px' className={[_s.cWhite, _s.ml5].join(' ')} />
          </Button>
        </div>

      </ModalLayout>
    )
  }

}

const messages = defineMessages({
  title: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  upgrade: { id: 'promo.upgrade', defaultMessage: 'Upgrade' },
  learnMore: { id: 'promo.learn_more', defaultMessage: 'Learn more' },
  text: { id: 'pro_upgrade_modal.text', defaultMessage: 'Gab is fully funded by people like you. Please consider supporting us on our mission to defend free expression online for all people.' },
  benefits: { id: 'pro_upgrade_modal.benefits', defaultMessage: 'Here are some benefits that GabPRO members receive:' },
})

const mapStateToProps = (state) => ({
  theme: state.getIn(['settings', 'displayOptions', 'theme'], DEFAULT_THEME),
})

ProUpgradeModal.propTypes = {
  intl: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
}

export default injectIntl(connect(mapStateToProps)(ProUpgradeModal))