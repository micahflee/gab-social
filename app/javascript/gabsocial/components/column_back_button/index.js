import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Icon from '../icon';

import './index.scss';

export default class ColumnBackButton extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    slim: PropTypes.bool,
  };

  handleClick = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/home'); // homehack
    } else {
      this.context.router.history.goBack();
    }
  }

  render () {
    const { slim } = this.props;

    const btnClasses = classNames('column-back-button', {
      'column-back-button--slim': slim,
    });

    return (
      <button className={btnClasses} onClick={this.handleClick}>
        <Icon id='chevron-left' className='column-back-button__icon' fixedWidth />
        <FormattedMessage id='column_back_button.label' defaultMessage='Back' />
      </button>
    );
  }

}