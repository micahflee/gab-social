import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { monthlyExpensesComplete } from '../../initial_state'
import {
  URL_DISSENTER_SHOP,
  URL_DISSENTER_SHOP_DONATIONS,
} from '../../constants'
import TimelineInjectionLayout from './timeline_injection_layout'
import ProgressBar from '../progress_bar'
import Button from '../button'
import Text from '../text'

class ProgressInjection extends React.PureComponent {
  
  render() {
    const {
      intl,
      isXS,
      injectionId,
    } = this.props

    if (!monthlyExpensesComplete || !isXS) return <div />
    
    const value = Math.min(parseFloat(monthlyExpensesComplete), 100)

    return (
      <TimelineInjectionLayout
        title={intl.formatMessage(messages.operationsTitle)}
        subtitle={intl.formatMessage(messages.operationsSubtitle)}
        buttonHref={URL_DISSENTER_SHOP}
        buttonTitle={intl.formatMessage(messages.donationTitle)}
        id={injectionId}
        isXS={isXS}
      >
        <div className={[_s.d, _s.pt5, _s.pb15, _s.w100PC].join(' ')}>
          <ProgressBar
            progress={monthlyExpensesComplete}
            title={intl.formatMessage(messages.progressTitle, { value })}
            href={URL_DISSENTER_SHOP}
          />
        </div>
      </TimelineInjectionLayout>
    )
  }

}

const messages = defineMessages({
  progressTitle: { id: 'progress_title', defaultMessage: '{value}% covered this month' },
  operationsTitle: { id: 'operations_title', defaultMessage: "Gab's Operational Expenses" },
  operationsSubtitle: { id: 'operations_subtitle', defaultMessage: 'We are 100% funded by you' },
  donationTitle: { id: 'make_donation', defaultMessage: 'Make a Donation' },
})

ProgressInjection.propTypes = {
  injectionId: PropTypes.string.isRequired,
}

export default injectIntl(ProgressInjection)