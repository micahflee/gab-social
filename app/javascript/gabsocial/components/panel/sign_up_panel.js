import { injectIntl, defineMessages } from 'react-intl';
import { me } from '../../initial_state';
import PanelLayout from './panel_layout';

const messages = defineMessages({
  title: { id: 'signup_panel.title', defaultMessage: 'New to Gab?' },
  subtitle: { id: 'signup_panel.subtitle', defaultMessage: 'Sign up now to speak freely.' },
  register: { id: 'account.register', defaultMessage: 'Sign up?' },
});

export default @injectIntl
class SignUpPanel extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    if (me) return null;

    const { intl } = this.props;

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <span className='panel__subtitle'>{intl.formatMessage(messages.subtitle)}</span>
        <div className='panel__form'>
          <a className='button' href="/auth/sign_up">{intl.formateMessage(messages.register)}</a>
        </div>
      </PanelLayout>
    )
  }
}
