import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import {
  URL_DISSENTER_SHOP,
  URL_DISSENTER_SHOP_DONATIONS,
} from '../../constants'
import { fetchExpenses } from '../../actions/expenses'
import TimelineInjectionLayout from './timeline_injection_layout'
import ProgressBar from '../progress_bar'
import Button from '../button'
import Text from '../text'

class ProgressInjection extends React.PureComponent {

  componentDidMount() {
    const { isFetched, isXS } = this.props
    if (!isFetched && isXS) {
      this.props.onFetchExpenses()
    }
  }

  render() {
    const {
      intl,
      isXS,
      value,
      isFetched,
      injectionId,
    } = this.props

    if ((value === 0 && isFetched) || !isXS) return <div />

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
            progress={value}
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
  operationsTitle: { id: 'operations_title', defaultMessage: "Help keep Gab online" },
  operationsSubtitle: { id: 'operations_subtitle', defaultMessage: "We're 100% funded by you." },
  donationTitle: { id: 'make_donation', defaultMessage: 'Make a Donation' },
})

const mapStateToProps = (state) => ({
  isFetched: state.getIn(['expenses', 'fetched'], false),
  value: state.getIn(['expenses', 'value'], 0),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchExpenses() {
    dispatch(fetchExpenses())
  },
})

ProgressInjection.propTypes = {
  injectionId: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  isFetched: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  onFetchExpenses: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProgressInjection))
