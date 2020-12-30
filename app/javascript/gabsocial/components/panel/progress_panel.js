import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { monthlyExpensesComplete } from '../../initial_state'
import {
  URL_DISSENTER_SHOP,
  URL_DISSENTER_SHOP_DONATIONS,
} from '../../constants'
import PanelLayout from './panel_layout';
import ProgressBar from '../progress_bar'
import Button from '../button'
import Text from '../text'
import Icon from '../icon'

class ProgressPanel extends React.PureComponent {

  render() {
    const { intl } = this.props

    if (!monthlyExpensesComplete) return null

    const value = Math.min(parseFloat(monthlyExpensesComplete), 100)
    const subtitle = (
      <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.jcCenter].join(' ')}>
        <Text color='secondary' size='small' weight='bold' className={_s.mrAuto}>
          {intl.formatMessage(messages.operationsSubtitle)}
        </Text>
        <Button
          noClasses
          href={URL_DISSENTER_SHOP_DONATIONS}
          className={[_s.d, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.outlineNone, _s.bgTransparent, _s.noUnderline].join(' ')}
        >
          <Text align='center' color='brand' weight='medium' className={_s.mr5}>
            Donate
          </Text>
          <Icon id='arrow-right' className={_s.cBrand} size='14px' />
        </Button>
      </div>
    )

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.operationsTitle)}
        subtitle={subtitle}
      >
        <div className={[_s.d, _s.px15, _s.pb15, _s.pt5].join(' ')}>
          <ProgressBar
            progress={monthlyExpensesComplete}
            title={intl.formatMessage(messages.progressTitle, { value })}
            href={URL_DISSENTER_SHOP}
          />
        </div>
      </PanelLayout>
    )
  }

}

const messages = defineMessages({
  progressTitle: { id: 'progress_title', defaultMessage: '{value}% covered this month' },
  operationsTitle: { id: 'operations_title', defaultMessage: "Gab's Operational Expenses" },
  operationsSubtitle: { id: 'operations_subtitle', defaultMessage: "We're 100% funded by you." },
  donationTitle: { id: 'make_donation', defaultMessage: 'Make a Donation' },
})

ProgressPanel.propTypes = {
  intl: PropTypes.object.isRequired,
}

export default injectIntl(ProgressPanel)