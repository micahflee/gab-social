import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import classNames from 'classnames/bind'
import Button from './button'
import { closeSidebar } from '../actions/sidebar'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
// import ProgressPanel from './progress_panel'
import GabLogo from './assets/gab_logo'
import Icon from './icon'

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
  const getAccount = makeGetAccount()

  return {
    account: getAccount(state, me),
    sidebarOpen: state.get('sidebar').sidebarOpen,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onClose() {
    dispatch(closeSidebar())
  },
})

const cx = classNames.bind(_s)

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Sidebar extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    sidebarOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  }

  state = {
    moreOpen: false,
    hoveringItemIndex: null,
  }

  componentDidUpdate() {
    if (!me) return

    if (this.props.sidebarOpen) {
      document.body.classList.add('with-modals--active')
    } else {
      document.body.classList.remove('with-modals--active')
    }
  }

  toggleMore = () => {
    this.setState({
      moreOpen: !this.state.moreOpen
    })
  }

  handleSidebarClose = () => {
    this.props.onClose()
    this.setState({
      moreOpen: false,
    })
  }

  render() {
    const { sidebarOpen, intl, account } = this.props
    const { moreOpen, hoveringItemIndex } = this.state

    if (!me || !account) return null

    const acct = account.get('acct')
    const isPro = account.get('is_pro')

    // const classes = classNames('sidebar-menu__root', {
    //   'sidebar-menu__root--visible': sidebarOpen,
    // })

    const moreIcon = moreOpen ? 'minus' : 'plus'
    const moreContainerStyle = { display: moreOpen ? 'block' : 'none' }

    const menuItems = [
      {
        title: 'Home',
        icon: 'home',
        to: '/',
        count: 124,
      },
      {
        title: 'Notifications',
        icon: 'notifications',
        to: '/notifications',
        count: 40,
      },
      {
        title: 'Groups',
        icon: 'group',
        to: '/groups',
      },
      {
        title: 'Lists',
        icon: 'list',
        to: '/lists',
      },
      {
        title: 'Chat',
        icon: 'chat',
        to: '/',
      },
      {
        title: 'More',
        icon: 'more',
        to: '/',
      },
    ]

    const shortcutItems = [
      {
        title: 'Meme Group',
        icon: 'group',
        to: '/',
        count: 0,
      },
      {
        title: '@andrew',
        image: 'http://localhost:3000/system/accounts/avatars/000/000/001/original/260e8c96c97834da.jpeg?1562898139',
        to: '/',
        count: 3,
      },
    ]

    const exploreItems = [
      {
        title: 'Apps',
        icon: 'apps',
        to: '/',
      },
      {
        title: 'Shop',
        icon: 'shop',
        to: '/',
      },
      {
        title: 'Trends',
        icon: 'trends',
        to: '/',
      },
      {
        title: 'Dissenter',
        icon: 'dissenter',
        to: '/',
      },
    ]

    const titleClasses = cx({
      default: 1,
      text: 1,
      colorSecondary: 1,
      displayBlock: 1,
      fontSize13PX: 1,
      paddingVertical5PX: 1,
      marginTop10PX: 1,
      paddingHorizontal10PX: 1,
      fontWeightBold: 1,
    })

    return (
      <header role='banner' className={[_s.default, _s.flexGrow1, _s.z3, _s.alignItemsEnd].join(' ')}>
        <div className={[_s.default, _s.width240PX].join(' ')}>
          <div className={[_s.default, _s.positionFixed, _s.top0, _s.height100PC].join(' ')}>
            <div className={[_s.default, _s.height100PC, _s.width240PX, _s.paddingRight15PX, _s.marginVertical10PX].join(' ')}>
              <h1 className={[_s.default].join(' ')}>
                <NavLink to='/' aria-label='Gab' className={[_s.default, _s.noSelect, _s.noUnderline, _s.height50PX, _s.justifyContentCenter, _s.cursorPointer, _s.paddingHorizontal10PX].join(' ')}>
                  <GabLogo />
                </NavLink>
              </h1>
              <div>
                <HeaderMenuItem me image='http://localhost:3000/system/accounts/avatars/000/000/001/original/260e8c96c97834da.jpeg?1562898139' title='@admin' to='/profile' />
              </div>
              <nav aria-label='Primary' role='navigation' className={[_s.default, _s.width100PC, _s.marginBottom15PX].join(' ')}>
                <span className={titleClasses}>Menu</span>
                {
                  menuItems.map((menuItem, i) => (
                    <HeaderMenuItem {...menuItem} key={`header-item-menu-${i}`} />
                  ))
                }
                <span className={titleClasses}>Shortcuts</span>
                {
                  shortcutItems.map((shortcutItem, i) => (
                    <HeaderMenuItem {...shortcutItem} key={`header-item-shortcut-${i}`} />
                  ))
                }
                <span className={titleClasses}>Explore</span>
                {
                  exploreItems.map((exploreItem, i) => (
                    <HeaderMenuItem {...exploreItem} key={`header-item-explore-${i}`} />
                  ))
                }
              </nav>
              <Button block className={[_s.paddingVertical15PX, _s.fontSize15PX, _s.fontWeightBold].join(' ')}>
                Gab
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

}

class HeaderMenuItem extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    active: PropTypes.bool,
    icon: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    me: PropTypes.bool,
    count: PropTypes.number,
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const { to, active, icon, image, title, me, count } = this.props
    const { hovering } = this.state

    const iconSize = '16px'
    const shouldShowActive = hovering || active
    const isNotifications = to === '/notifications'

    const containerClasses = cx({
      default: 1,
      maxWidth100PC: 1,
      width100PC: 1,
      flexRow: 1,
      paddingVertical5PX: 1,
      paddingHorizontal10PX: 1,
      alignItemsCenter: 1,
      radiusSmall: 1,
      // border1PX: shouldShowActive,
      // borderColorSecondary: shouldShowActive,
      backgroundSubtle2: shouldShowActive,
    })

    const textClasses = cx({
      default: 1,
      fontWeightNormal: 1,
      fontSize15PX: 1,
      text: 1,
      textOverflowEllipsis: 1,
      colorPrimary: shouldShowActive || me,
      colorSecondary: !hovering && !active && !me,
    })

    const iconClasses = cx({
      fillColorBlack: shouldShowActive,
      fillcolorSecondary: !hovering && !active,
    })

    const countClasses = cx({
      default: 1,
      text: 1,
      marginLeftAuto: 1,
      fontSize12PX: 1,
      paddingHorizontal5PX: 1,
      marginRight2PX: 1,
      lineHeight15: 1,
      marginLeft5PX: 1,
      colorSecondary: !isNotifications,
      colorWhite: isNotifications,
      backgroundColorBrand: isNotifications,
      radiusSmall: isNotifications,
    })

    return (
      <NavLink
        to={to}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
        className={[_s.default, _s.noUnderline, _s.cursorPointer, _s.width100PC, _s.alignItemsStart, _s.flexGrow1].join(' ')}
      >
        <div className={containerClasses}>
          <div className={[_s.default]}>
            { icon && <Icon id={icon} className={iconClasses} width={iconSize} height={iconSize} /> }
            { image &&
              <img
                className={[_s.default, _s.circle].join(' ')}
                width={iconSize}
                height={iconSize}
                src={image}
              />
            }
          </div>
          <div className={[_s.default, _s.flexNormal, _s.paddingHorizontal10PX, _s.textOverflowEllipsis, _s.overflowWrapBreakWord, _s.flexRow, _s.width100PC].join(' ')}>
            <span className={textClasses}>{title}</span>
          </div>
          { count > 0 &&
            <span className={countClasses}>
              {count}
            </span>
          }
        </div>
      </NavLink>
    )
  }
}