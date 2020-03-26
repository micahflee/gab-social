import { me, monthlyExpensesComplete } from '../../initial_state'
import PanelLayout from './panel_layout';
import ProgressBar from '../progress_bar'

export default class ProgressPanel extends PureComponent {
  render() {
    if (!monthlyExpensesComplete || !me) return null

    return (
      <PanelLayout
        title="Gab's Operational Expenses"
        subtitle="We are 100% funded by you"
        hasBackground
      >
        <ProgressBar
          progress={monthlyExpensesComplete}
          title={`${Math.min(parseFloat(monthlyExpensesComplete), 100)}% covered this month`}
          href='https://shop.dissenter.com/category/donations'
        />
      </PanelLayout>
    )
  }
}