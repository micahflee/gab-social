import { FormattedMessage } from 'react-intl';
import Icon from 'gabsocial/components/icon';

export default class ColumnBackButton extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  handleClick = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/home'); // homehack
    } else {
      this.context.router.history.goBack();
    }
  }

  render () {
    return (
      <button onClick={this.handleClick} className='column-back-button'>
        <Icon id='chevron-left' className='column-back-button__icon' fixedWidth />
        <FormattedMessage id='column_back_button.label' defaultMessage='Back' />
      </button>
    );
  }

}
