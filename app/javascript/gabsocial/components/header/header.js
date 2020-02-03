import { Link, NavLink } from 'react-router-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages } from 'react-intl';
import classNames from 'classnames';
import Avatar from '../avatar';
import IconButton from '../icon_button';
import Icon from '../icon';
import DisplayName from '../display_name';
import { closeSidebar } from '../../actions/sidebar';
import { shortNumberFormat } from '../../utils/numbers';
import { me } from '../../initial_state';
import { makeGetAccount } from '../../selectors';
import ProgressPanel from '../progress_panel';
import GabLogo from './assets/gab_logo';
import {
  GroupIcon,
  HomeIcon,
  NotificationsIcon,
} from './assets/tabs_bar_icon';

console.log("header global - styles:", styles);

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domain_blocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Hidden domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Muted words' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  lists: { id: 'column.lists', defaultMessage: 'Lists', },
  apps: { id: 'tabs_bar.apps', defaultMessage: 'Apps' },
  more: { id: 'sidebar.more', defaultMessage: 'More' },
  pro: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  trends: { id: 'promo.trends', defaultMessage: 'Trends' },
  search: { id: 'tabs_bar.search', defaultMessage: 'Search' },
  shop: { id: 'tabs_bar.shop', defaultMessage: 'Store - Buy Merch' },
  donate: { id: 'tabs_bar.donate', defaultMessage: 'Make a Donation' },
})

const mapStateToProps = state => {
  const getAccount = makeGetAccount();

  return {
    account: getAccount(state, me),
    sidebarOpen: state.get('sidebar').sidebarOpen,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClose() {
    dispatch(closeSidebar());
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Header extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    sidebarOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    moreOpen: false,
  }

  componentDidUpdate() {
    if (!me) return;

    if (this.props.sidebarOpen) {
      document.body.classList.add('with-modals--active');
    } else {
      document.body.classList.remove('with-modals--active');
    }
  }

  toggleMore = () => {
    this.setState({
      moreOpen: !this.state.moreOpen
    });
  }

  handleSidebarClose = () => {
    this.props.onClose();
    this.setState({
      moreOpen: false,
    });
  }

  render() {
    const { sidebarOpen, intl, account } = this.props;
    const { moreOpen } = this.state;

    if (!me || !account) return null;

    const acct = account.get('acct');
    const isPro = account.get('is_pro');

    const classes = classNames('sidebar-menu__root', {
      'sidebar-menu__root--visible': sidebarOpen,
    });

    const moreIcon = moreOpen ? 'minus' : 'plus';
    const moreContainerStyle = { display: moreOpen ? 'block' : 'none' };

    const sidebarItems = [
      {
        name: 'Home',
        icon: <NotificationsIcon />,
        to: '/',
      },
      {
        name: 'Notifications',
        icon: <NotificationsIcon />,
        to: '/',
      },
      {
        name: 'Groups',
        icon: <NotificationsIcon />,
        to: '/',
      },
      {
        name: 'Lists',
        icon: <NotificationsIcon />,
        to: '/',
      },
      {
        name: 'Chat',
        icon: <NotificationsIcon />,
        to: '/',
      },
      {
        name: 'Trends',
        icon: <NotificationsIcon />,
        to: '/',
      },
      {
        name: 'Profile',
        icon: <NotificationsIcon />,
        to: '/',
      },
    ];

    return (
      <header role='banner' className={[styles.header].join(' ')}>
        <div className='header__container'>
          <div className='header-scrollarea'>
            <div className='header-scrollarea__container'>
              <h1 className='header__heading'>
                <a className='header__heading__btn'>
                  <GabLogo />
                </a>
              </h1>
              <nav className='header-nav'>

                {
                  sidebarItems.map((sidebarItem, i) => {
                    return (
                      <NavLink to={sidebarItem.to} className='header-nav__item' key={`header-nav__item-${i}`}>
                        <div className='header-nav__item__block'>
                          {sidebarItem.icon}
                          <span className='header-nav__item__title'>{sidebarItem.name}</span>
                        </div>
                      </NavLink>
                    )
                  })
                }

                <a className='header-nav__item'>
                  <div className='header-nav__item__block'>
                    <NotificationsIcon />
                    <span className='header-nav__item__title'>More</span>
                  </div>
                </a>

              </nav>
            </div>
          </div>
        </div>
      </header>
    )

    return (
      <div className={classes}>
        <div className='sidebar-menu__wrapper' role='button' onClick={this.handleSidebarClose} />
        <div className='sidebar-menu'>

          <div className='sidebar-menu-header'>
            <span className='sidebar-menu-header__title'>Account Info</span>
            <IconButton title='close' onClick={this.handleSidebarClose} icon='close' className='sidebar-menu-header__btn' />
          </div>

          <div className='sidebar-menu__content'>

            <div className='sidebar-menu-profile'>
              <div className='sidebar-menu-profile__avatar'>
                <Link to={`/${acct}`} title={acct} onClick={this.handleSidebarClose}>
                  <Avatar account={account} />
                </Link>
              </div>
              <div className='sidebar-menu-profile__name'>
                <DisplayName account={account} />
              </div>

              <div className='sidebar-menu-profile__stats'>
                <NavLink className='sidebar-menu-profile-stat' to={`/${acct}/followers`} onClick={this.handleSidebarClose} title={intl.formatNumber(account.get('followers_count'))}>
                  <strong className='sidebar-menu-profile-stat__value'>{shortNumberFormat(account.get('followers_count'))}</strong>
                  <span className='sidebar-menu-profile-stat__label'>{intl.formatMessage(messages.followers)}</span>
                </NavLink>
                <NavLink className='sidebar-menu-profile-stat' to={`/${acct}/following`} onClick={this.handleSidebarClose} title={intl.formatNumber(account.get('following_count'))}>
                  <strong className='sidebar-menu-profile-stat__value'>{shortNumberFormat(account.get('following_count'))}</strong>
                  <span className='sidebar-menu-profile-stat__label'>{intl.formatMessage(messages.follows)}</span>
                </NavLink>
              </div>

            </div>

            <div className='sidebar-menu__section'>
              <ProgressPanel />
            </div>

            <div className='sidebar-menu__section sidebar-menu__section--borderless'>
              <NavLink className='sidebar-menu-item' to={`/${acct}`} onClick={this.handleSidebarClose}>
                <Icon id='user' fixedWidth />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.profile)}</span>
              </NavLink>
              {
                !isPro &&
                <a className='sidebar-menu-item' href='https://pro.gab.com'>
                  <Icon id='arrow-up' fixedWidth />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.pro)}</span>
                </a>
              }
              <a className='sidebar-menu-item' href='https://shop.dissenter.com/category/donations'>
                <Icon id='heart' fixedWidth />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.donate)}</span>
              </a>
              <a className='sidebar-menu-item' href='https://shop.dissenter.com'>
                <Icon id='shopping-cart' fixedWidth />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.shop)}</span>
              </a>
              <a className='sidebar-menu-item' href='https://trends.gab.com'>
                <Icon id='signal' fixedWidth />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.trends)}</span>
              </a>
              <NavLink className='sidebar-menu-item' to='/search' onClick={this.handleSidebarClose}>
                <Icon id='search' fixedWidth />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.search)}</span>
              </NavLink>
              <a className='sidebar-menu-item' href='/settings/preferences'>
                <Icon id='cog' fixedWidth />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.preferences)}</span>
              </a>
            </div>

            <div className='sidebar-menu__section'>
              <div className='sidebar-menu-item' onClick={this.toggleMore} role='button'>
                <Icon id={moreIcon} fixedWidth />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.more)}</span>
              </div>
              <div style={moreContainerStyle}>
                <NavLink className='sidebar-menu-item' to='/lists' onClick={this.handleSidebarClose}>
                  <Icon id='list' fixedWidth />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.lists)}</span>
                </NavLink>
                <NavLink className='sidebar-menu-item' to='/follow_requests' onClick={this.handleSidebarClose}>
                  <Icon id='user-plus' fixedWidth />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.follow_requests)}</span>
                </NavLink>
                <NavLink className='sidebar-menu-item' to='/blocks' onClick={this.handleSidebarClose}>
                  <Icon id='ban' fixedWidth />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.blocks)}</span>
                </NavLink>
                <NavLink className='sidebar-menu-item' to='/domain_blocks' onClick={this.handleSidebarClose}>
                  <Icon id='sitemap' fixedWidth />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.domain_blocks)}</span>
                </NavLink>
                <NavLink className='sidebar-menu-item' to='/mutes' onClick={this.handleSidebarClose}>
                  <Icon id='times-circle' fixedWidth />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.mutes)}</span>
                </NavLink>
                <a className='sidebar-menu-item' href='/filters'>
                  <Icon id='filter' fixedWidth />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.filters)}</span>
                </a>
              </div>
            </div>

            <div className='sidebar-menu__section'>
              <a  className='sidebar-menu-item' href='/auth/sign_out' data-method='delete'>
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.logout)}</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    );
  }

}
