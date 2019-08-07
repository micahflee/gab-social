import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import IconButton from '../../icon_button';

import './unauthorized_modal.scss';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  signup: {id: 'unauthorized_modal.title', defaultMessage: 'Sign up for Gab' },
  text: { id: 'unauthorized_modal.text', defaultMessage: 'You need to be logged in to do that.' },
  register: { id: 'account.register', defaultMessage: 'Sign up' },
  alreadyHaveAccount: { id: 'unauthorized_modal.footer', defaultMessage: 'Already have an account? {login}.' },
  login: { id: 'account.login', defaultMessage: 'Log in' },
});

export default @injectIntl
class UnauthorizedModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  onClickClose = () => {
    this.props.onClose('UNAUTHORIZED');
  };

  render () {
    const { intl } = this.props;

    return (
      <div className='modal-root__modal compose-modal unauthorized-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'>{intl.formatMessage(messages.signup)}</h3>
          <IconButton className='compose-modal__close' title={intl.formatMessage(messages.close)} icon='times' onClick={this.onClickClose} size={20} />
        </div>
        <div className='compose-modal__content'>
          <div className='unauthorized-modal__content'>
            <span className='unauthorized-modal-content__text'>{intl.formatMessage(messages.text)}</span>
            <a href='/auth/sign_up' className='unauthorized-modal-content__button button'>{intl.formatMessage(messages.register)}</a>
          </div>
        </div>
        <div className='unauthorized-modal__footer'>
          {intl.formatMessage(messages.login, {
            login: <a href='/auth/sign_in'>{intl.formatMessage(messages.login)}</a>
          })}
        </div>
      </div>
    );
  }
}