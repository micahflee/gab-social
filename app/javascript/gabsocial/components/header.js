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

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Header extends ImmutablePureComponent {

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
        count: 0,
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
        icon: 'lists',
        to: '/lists',
      },
      {
        title: 'Chat',
        icon: 'chat',
        to: '/',
      },
      {
        title: 'Profile',
        icon: 'profile',
        to: '/',
      },
      {
        title: 'More',
        icon: 'plus',
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
        title: 'Andrew',
        icon: 'user',
        to: '/',
        count: 3,
      },
    ]

    const exploreItems = [
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
    ]

    const cx = classNames.bind(styles)

    const titleClasses = cx({
      default: 1,
      text: 1,
      colorSubtle: 1,
      displayBlock: 1,
      fontSize13PX: 1,
      paddingVertical5PX: 1,
      marginTop10PX: 1,
      paddingHorizontal10PX: 1,
      fontWeightBold: 1,
    })

    return (
      <header role='banner' className={[styles.default, styles.flexGrow1, styles.z3, styles.alignItemsEnd].join(' ')}>
        <div className={[styles.default, styles.width250PX].join(' ')}>
          <div className={[styles.default, styles.positionFixed, styles.top0, styles.height100PC].join(' ')}>
            <div className={[styles.default, styles.height100PC, styles.width250PX, styles.paddingHorizontal15PX, styles.marginVertical10PX].join(' ')}>
              <h1 className={[styles.default].join(' ')}>
                <NavLink to='/' aria-label='Gab' className={[styles.default, styles.noSelect, styles.noUnderline, styles.height50PX, styles.justifyContentCenter, styles.cursorPointer, styles.paddingHorizontal10PX].join(' ')}>
                  <GabLogo />
                </NavLink>
              </h1>
              <nav aria-label='Primary' role='navigation' className={[styles.default, styles.width100PC, styles.marginBottom15PX].join(' ')}>
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
              <Button block className={[styles.paddingVertical15PX, styles.fontSize15PX, styles.fontWeightBold].join(' ')}>
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
    title: PropTypes.string,
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
    const { to, active, icon, title } = this.props
    const { hovering } = this.state

    const cx = classNames.bind(styles)

    const shouldShowActive = hovering || active

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
      // borderColorSubtle: shouldShowActive,
      backgroundColorBrandLightOpaque: shouldShowActive,
    })

    const textClasses = cx({
      default: 1,
      fontWeightNormal: 1,
      fontSize15PX: 1,
      text: 1,
      fontWeight500: shouldShowActive,
      colorBrand: shouldShowActive,
      colorBlack: !hovering && !active,
    })

    const iconClasses = cx({
      fillColorBrand: shouldShowActive,
      fillColorBlack: !hovering && !active,
    })

    return (
      <NavLink
        to={to}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
        className={[styles.default, styles.noUnderline, styles.cursorPointer, styles.width100PC, styles.alignItemsStart, styles.flexGrow1].join(' ')}
      >
        <div className={containerClasses}>
          <div className={[styles.default]}>
            <Icon id={icon} className={iconClasses} width='15px' height='15px' />
          </div>
          <div className={[styles.default, styles.paddingHorizontal10PX, styles.textOverflowEllipsis, styles.overflowWrapBreakWord, styles.displayInline].join(' ')}>
            <span className={textClasses}>{title}</span>
          </div>
        </div>
      </NavLink>
    )
  }
}