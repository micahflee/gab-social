import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import NotificationCounter from '../notification_counter';

// : todo :

const links = [
  <NavLink key='pr1' className='footer-bar__link' to='/home' data-preview-title-id='column.home'>
    <i className='tabs-bar__link__icon home' />
    <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
  </NavLink>,
  <NavLink key='pr2' className='footer-bar__link' to='/notifications' data-preview-title-id='column.notifications'>
    <i className='tabs-bar__link__icon notifications'/>
    <NotificationCounter />
    <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
  </NavLink>,
  <a key='pl5' className='footer-bar__link footer-bar__link--chat' href='https://chat.gab.com' data-preview-title-id='tabs_bar.chat'>
    <Icon id='comments' className='tabs-bar__link__icon chat' />
    <FormattedMessage id='tabs_bar.chat' defaultMessage='Chat' />
  </a>,
  <a key='pl4' className='footer-bar__link footer-bar__link--trends' href='https://trends.gab.com' data-preview-title-id='tabs_bar.trends'>
    <i className='tabs-bar__link__icon trends' />
    <FormattedMessage id='tabs_bar.trends' defaultMessage='Trends' />
  </a>,
  <NavLink key='pr3' className='footer-bar__link' to='/groups' data-preview-title-id='column.groups'>
    <i className='tabs-bar__link__icon groups' />
    <FormattedMessage id='tabs_bar.groups' defaultMessage='Groups' />
  </NavLink>,
]

export default
@injectIntl
@withRouter
class FooterBar extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <div className='footer-bar'>
        <div className='footer-bar__container'>
          {
            links.map((link) =>
              React.cloneElement(link, {
                key: link.props.to,
                'aria-label': formatMessage({
                  id: link.props['data-preview-title-id']
                })
              }))
          }
        </div>
      </div>
    );
  }
}
