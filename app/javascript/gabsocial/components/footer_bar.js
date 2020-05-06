import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from './button'
import Icon from './icon'

const links = [
  <NavLink key='pr1' className='footer-bar__link' to='/home' data-preview-title-id='column.home'>
    <i className='tabs-bar__link__icon home' />
    <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
  </NavLink>,
  <NavLink key='pr2' className='footer-bar__link' to='/notifications' data-preview-title-id='column.notifications'>
    <i className='tabs-bar__link__icon notifications' />
    <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
  </NavLink>,
  <a key='pl5' className='footer-bar__link footer-bar__link--chat' href='https://chat.gab.com' data-preview-title-id='tabs_bar.chat'>
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

  handleSettings = () => {
    //
  }

  render() {
    const { intl } = this.props

    return (
      <div className={[_s.default, _s.z4, _s.height53PX, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.posFixed, _s.left0, _s.right0, _s.bottom0, _s.height53PX, _s.width100PC, _s.bgPrimary, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentSpaceAround].join(' ')}>
            <Button
              backgroundColor='none'
              color='secondary'
              to='/home'
              icon='home'
              iconSize='20px'
            />
            <Button
              backgroundColor='none'
              color='secondary'
              to='/search'
              icon='search'
              iconSize='20px'
            />
            <Button
              backgroundColor='none'
              color='secondary'
              to='/notifications'
              icon='notifications'
              iconSize='20px'
            />
            <Button
              backgroundColor='none'
              color='secondary'
              to='/groups'
              icon='group'
              iconSize='20px'
            />
            <Button
              backgroundColor='none'
              color='secondary'
              onClick={this.handleSettings}
              icon='hamburger'
              iconSize='20px'
            />
          </div>
        </div>
      </div>
    )
  }
}
