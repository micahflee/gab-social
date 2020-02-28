import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import Button from './button'
import { closeSidebar } from '../actions/sidebar'
import { openModal } from '../actions/modal'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import SidebarSectionTitle from './sidebar_section_title'
import SidebarSectionItem from './sidebar_section_item'
import SidebarHeader from './sidebar_header'

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
  onOpenComposeModal() {
    dispatch(openModal('COMPOSE'))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Sidebar extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    sidebarOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onOpenComposeModal: PropTypes.func.isRequired,
  }

  state = {
    moreOpen: false,
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

  handleOpenComposeModal = () => {
    console.log("handleOpenComposeModal")
    this.props.onOpenComposeModal()
  }

  render() {
    const { sidebarOpen, intl, account } = this.props
    const { moreOpen } = this.state

    // : todo :
    if (!me || !account) return null

    const acct = account.get('acct')
    const isPro = account.get('is_pro')

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
        title: 'Search',
        icon: 'search-sidebar',
        to: '/search',
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
        to: '',
        // href: 'https://chat.gab.com',
      },
      {
        title: 'More',
        icon: 'more',
        to: '/',
      },
    ]

    // more:
    // settings/preferences
    // help
    // logout

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
        to: '',
        // href: 'https://apps.gab.com',
      },
      {
        title: 'Shop',
        icon: 'shop',
        to: '',
        // href: 'https://shop.dissenter.com',
      },
      {
        title: 'Trends',
        icon: 'trends',
        to: '',
        // href: 'https://trends.gab.com',
      },
      {
        title: 'Dissenter',
        icon: 'dissenter',
        to: '',
        // href: 'https://dissenter.com',
      },
    ]

    return (
      <header role='banner' className={[_s.default, _s.flexGrow1, _s.z3, _s.alignItemsEnd].join(' ')}>
        <div className={[_s.default, _s.width240PX].join(' ')}>
          <div className={[_s.default, _s.positionFixed, _s.top0, _s.height100PC].join(' ')}>
            <div className={[_s.default, _s.height100PC, _s.width240PX, _s.paddingRight15PX, _s.marginVertical10PX].join(' ')}>

              <SidebarHeader />

              <nav aria-label='Primary' role='navigation' className={[_s.default, _s.width100PC, _s.marginBottom15PX].join(' ')}>
                <SidebarSectionTitle>Menu</SidebarSectionTitle>
                {
                  menuItems.map((menuItem, i) => (
                    <SidebarSectionItem {...menuItem} key={`sidebar-item-menu-${i}`} />
                  ))
                }
                <SidebarSectionTitle>Shortcuts</SidebarSectionTitle>
                {
                  shortcutItems.map((shortcutItem, i) => (
                    <SidebarSectionItem {...shortcutItem} key={`sidebar-item-shortcut-${i}`} />
                  ))
                }
                <SidebarSectionTitle>Explore</SidebarSectionTitle>
                {
                  exploreItems.map((exploreItem, i) => (
                    <SidebarSectionItem {...exploreItem} key={`sidebar-item-explore-${i}`} />
                  ))
                }
              </nav>

              <Button
                block
                onClick={this.handleOpenComposeModal}
                className={[_s.paddingVertical15PX, _s.fontSize15PX, _s.fontWeightBold].join(' ')}
              >
                Gab
              </Button>

            </div>
          </div>
        </div>
      </header>
    )
  }

}