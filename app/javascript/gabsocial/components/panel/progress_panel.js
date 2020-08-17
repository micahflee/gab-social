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

const messages = defineMessages({
  progressTitle: { id: 'progress_title', defaultMessage: '{value}% covered this month' },
  operationsTitle: { id: 'operations_title', defaultMessage: "Gab's Operational Expenses" },
  operationsSubtitle: { id: 'operations_subtitle', defaultMessage: 'We are 100% funded by you' },
  donationTitle: { id: 'make_donation', defaultMessage: 'Make a Donation' },
})

export default
@injectIntl
class ProgressPanel extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl } = this.props

    if (!monthlyExpensesComplete) return null

    const value = Math.min(parseFloat(monthlyExpensesComplete), 100)

    return (
      <PanelLayout
        title={intl.formatMessage(messages.operationsTitle)}
        subtitle={intl.formatMessage(messages.operationsSubtitle)}
      >
        <ProgressBar
          progress={monthlyExpensesComplete}
          title={intl.formatMessage(messages.progressTitle, { value })}
          href={URL_DISSENTER_SHOP}
        />
        <Button
          isOutline
          isNarrow
          color='brand'
          backgroundColor='none'
          className={[_s.mt10].join(' ')}
          href={URL_DISSENTER_SHOP_DONATIONS}
        >
          <Text
            align='center'
            color='inherit'
            weight='medium'
          >
            {intl.formatMessage(messages.donationTitle)}
          </Text>
        </Button>
      </PanelLayout>
    )
  }

}