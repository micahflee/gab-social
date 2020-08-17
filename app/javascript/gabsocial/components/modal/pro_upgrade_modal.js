import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  URL_GAB_PRO,
  DEFAULT_THEME,
} from '../../constants'
import Button from '../button'
import Text from '../text'
import Icon from '../icon'
import Image from '../image'
import ModalLayout from './modal_layout'

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

export default
@injectIntl
@connect(mapStateToProps)
class ProUpgradeModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
  }

  render() {
    const {
      intl,
      onClose,
      theme,
    } = this.props

    const imgSuffix = (theme === 'light' || !theme) ? 'light' : 'dark'

    const title = (
      <span className={[_s.default, _s.flexRow, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}>
        <span className={[_s.default, _s.mr2].join(' ')}>
          Upgrade to Gab
        </span>
        <span className={[_s.bgPro, _s.colorBlack, _s.radiusSmall, _s.px5, _s.py5].join(' ')}>PRO</span>
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

        <div className={[_s.default, _s.my10].join(' ')}>
          <Image
            src={`/headers/pro-features-${imgSuffix}.png`}
            width='100%'
            height='auto'
            fit='cover'
            className={[_s.heightMax340PX, _s.heightMin200PX].join(' ')}
          />
        </div>

        <div className={[_s.default, _s.flexRow, _s.py10].join(' ')}>
          <Button
            isOutline
            color='brand'
            backgroundColor='none'
            href={URL_GAB_PRO}
            className={[_s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.mr10].join(' ')}
          >
            <Text color='inherit' weight='medium' align='center'>
              {intl.formatMessage(messages.learnMore)}
            </Text>
          </Button>
          <Button
            href={URL_GAB_PRO}
            className={[_s.flexRow, _s.flexGrow1, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}
          >
            <Text color='inherit' size='large' weight='bold' align='center'>
              {intl.formatMessage(messages.upgrade)}
            </Text>
            <Icon id='arrow-right' size='20px' className={[_s.colorWhite, _s.ml5].join(' ')} />
          </Button>
        </div>

      </ModalLayout>
    )
  }

}
