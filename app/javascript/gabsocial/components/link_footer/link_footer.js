import { defineMessages, injectIntl } from 'react-intl';
import { openModal } from '../../actions/modal';
import { invitesEnabled, version, repository, source_url, me } from '../../initial_state';

import './link_footer.scss';

const messages = defineMessages({
  invite: { id:'getting_started.invite', defaultMessage: 'Invite people' },
  hotkeys: { id: 'navigation_bar.keyboard_shortcuts', defaultMessage: 'Hotkeys' },
  security: { id: 'getting_started.security', defaultMessage: 'Security' },
  about: { id: 'navigation_bar.info', defaultMessage: 'About' },
  developers: { id: 'getting_started.developers', defaultMessage: 'Developers' },
  terms: { id: 'getting_started.terms', defaultMessage: 'Terms of Service' },
  dmca: { id: 'getting_started.dmca', defaultMessage: 'DMCA' },
  terms: { id: 'getting_started.terms_of_sale', defaultMessage: 'Terms of Sale' },
  privacy: { id: 'getting_started.privacy', defaultMessage: 'Privacy Policy' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  notice: { id: 'getting_started.open_source_notice', defaultMessage: 'Gab Social is open source software. You can contribute or report issues on our self-hosted GitLab at {gitlab}.' },
});

const mapDispatchToProps = (dispatch) => ({
  onOpenHotkeys() {
    dispatch(openModal('HOTKEYS'));
  },
});

export default @connect(null, mapDispatchToProps)
@injectIntl
class LinkFooter extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenHotkeys: PropTypes.func.isRequired,
  };

  render() {
    const { onOpenHotkeys, intl } = this.props;

    return (
      <div className='link-footer'>
        <ul>
          {(invitesEnabled && me) && <li><a href='/invites'>{intl.formatMessage(messages.invite)}</a> · </li>}
          {me && <li><a href='#' onClick={onOpenHotkeys}>{intl.formatMessage(messages.hotkeys)}</a> · </li>}
          {me && <li><a href='/auth/edit'>{intl.formatMessage(messages.security)}</a> · </li>}
          <li><a href='/about'>{intl.formatMessage(messages.about)}</a> · </li>
          <li><a href='/settings/applications'>{intl.formatMessage(messages.developers)}</a> · </li>
          <li><a href='/about/tos'>{intl.formatMessage(messages.terms)}</a> · </li>
          <li><a href='/about/dmca'>{intl.formatMessage(messages.dmca)}</a> · </li>
          <li><a href='/about/sales'>{intl.formatMessage(messages.terms)}</a> · </li>
          <li><a href='/about/privacy'>{intl.formatMessage(messages.privacy)}</a></li>
          {me && <li> · <a href='/auth/sign_out' data-method='delete'>{intl.formatMessage(messages.logout)}</a></li>}
        </ul>

        <p>
          {intl.formatMessage(messages.invite, {
            gitlab: <span><a href={source_url} rel='noopener' target='_blank'>{repository}</a> (v{version})</span>
          })}
        </p>
        <p>© 2019 Gab AI Inc.</p>
      </div>
    );
  }

};