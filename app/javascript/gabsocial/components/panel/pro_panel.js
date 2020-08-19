import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { URL_GAB_PRO } from '../../constants'
import PanelLayout from './panel_layout';
import Button from '../button'
import Icon from '../icon'
import Text from '../text'

class ProPanel extends React.PureComponent {

  render() {
    const { intl, isPro } = this.props

    if (isPro) return null

    const title = (
      <span className={[_s.d, _s.flexRow, _s.jcCenter, _s.aiCenter].join(' ')}>
        <span className={[_s.d, _s.mr2].join(' ')}>
          Upgrade to Gab
        </span>
        <span className={[_s.bgPro, _s.cBlack, _s.radiusSmall, _s.px5, _s.py5].join(' ')}>PRO</span>
      </span>
    )

    return (
      <PanelLayout
        title={title}
        subtitle={intl.formatMessage(messages.text)}
      >

        <div className={[_s.d, _s.flexRow, _s.pb5].join(' ')}>
          <Button
            isOutline
            color='brand'
            backgroundColor='none'
            href={URL_GAB_PRO}
            className={[_s.flexRow, _s.aiCenter, _s.jcCenter, _s.mr10].join(' ')}
          >
            <Text color='inherit' weight='medium' align='center'>
              Learn more
            </Text>
          </Button>
          <Button
            href={URL_GAB_PRO}
            className={[_s.flexRow, _s.flexGrow1, _s.aiCenter, _s.jcCenter].join(' ')}
          >
            <Text color='inherit' size='large' weight='bold' align='center'>
              Upgrade
            </Text>
            <Icon id='arrow-right' size='20px' className={[_s.cWhite, _s.ml5].join(' ')} />
          </Button>
        </div>

      </PanelLayout>
    )
  }

}

const messages = defineMessages({
  title: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  text: { id: 'pro_upgrade_modal.text_sm', defaultMessage: 'Please consider supporting us on our mission to defend free expression online for all people.' },
})

ProPanel.propTypes = {
  intl: PropTypes.object.isRequired,
  isPro: PropTypes.bool.isRequired,
}

export default injectIntl(ProPanel)