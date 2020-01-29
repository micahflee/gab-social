import { monthlyExpensesComplete } from '../../initial_state';

export default class ProgressPanel extends React.PureComponent {
  render() {
    if (!monthlyExpensesComplete) return null;

    const completed = Math.min(monthlyExpensesComplete, 100);
    const style = {
      width: `${completed}%`,
    };

    return (
      <div className='wtf-panel progress-panel'>
        <div className='wtf-panel-header progress-panel-header'>
          <div className='wtf-panel-header__label'>Gab's Operational Expenses</div>
        </div>
        <div className='wtf-panel__content progress-panel__content'>
          <span className='progress-panel__text'>We are 100% funded by you.</span>
          <div className='progress-panel__bar-container'>
            <a className='progress-panel__bar' style={style} href='https://shop.dissenter.com/category/donations'>
              <span className='progress-panel__bar__text'>{completed}% covered this month</span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}