import { injectIntl, defineMessages } from 'react-intl'
import { monthlyExpensesComplete } from '../../initial_state'
import { URL_DISSENTER_SHOP } from '../../constants'
import PanelLayout from './panel_layout';
import ProgressBar from '../progress_bar'

const messages = defineMessages({
  progressTitle: { id: 'progress_title', defaultMessage: '{value}% covered this month' },
  operationsTitle: { id: 'operations_title', defaultMessage: "Gab's Operational Expenses" },
  operationsSubtitle: { id: 'operations_subtitle', defaultMessage: 'We are 100% funded by you' },
})

export default
@injectIntl
class ProgressPanel extends PureComponent {

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
      </PanelLayout>
    )
  }

}