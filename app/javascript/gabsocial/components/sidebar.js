import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import * as Constants from '../constants'
import Button from './button'
import { closeSidebar } from '../actions/sidebar'
import { openModal } from '../actions/modal'
import { openPopover } from '../actions/popover'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import Responsive from '../features/ui/util/responsive_component'
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
  lists: { id: 'column.lists', defaultMessage: 'Lists' },
  apps: { id: 'tabs_bar.apps', defaultMessage: 'Apps' },
  more: { id: 'sidebar.more', defaultMessage: 'More' },
  pro: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  trends: { id: 'promo.trends', defaultMessage: 'Trends' },
  search: { id: 'tabs_bar.search', defaultMessage: 'Search' },
  shop: { id: 'tabs_bar.shop', defaultMessage: 'Store - Buy Merch' },
  donate: { id: 'tabs_bar.donate', defaultMessage: 'Make a Donation' },
})

const mapStateToProps = (state) => {
  const getAccount = makeGetAccount()

  return {
    account: getAccount(state, me),
    moreOpen: state.getIn(['popover', 'popoverType']) === 'SIDEBAR_MORE',
    notificationCount: state.getIn(['notifications', 'unread']),
    homeItemsQueueCount: state.getIn(['timelines', 'home', 'totalQueuedItemsCount']),
    showCommunityTimeline: state.getIn(['settings', 'community', 'shows', 'inSidebar']),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onClose() {
    dispatch(closeSidebar())
  },
  openSidebarMorePopover(props) {
    dispatch(openPopover('SIDEBAR_MORE', props))
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
    showCommunityTimeline: PropTypes.bool,
    moreOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onOpenComposeModal: PropTypes.func.isRequired,
    openSidebarMorePopover: PropTypes.func.isRequired,
    notificationCount: PropTypes.number.isRequired,
    homeItemsQueueCount: PropTypes.number.isRequired,
  }

  handleOpenComposeModal = () => {
    this.props.onOpenComposeModal()
  }

  handleOpenSidebarMorePopover =() => {
    this.props.openSidebarMorePopover({
      targetRef: this.moreBtnRef,
      position: 'top',
    })
  }

  setMoreButtonRef = n => {
    this.moreBtnRef = n
  }

  render() {
    const {
      intl,
      account,
      notificationCount,
      homeItemsQueueCount,
      showCommunityTimeline,
      moreOpen,
    } = this.props

    // : todo :
    if (!me || !account) return null

    const acct = account.get('acct')
    const isPro = account.get('is_pro')

    console.log('showCommunityTimeline:', showCommunityTimeline)

    const menuItems = [
      {
        title: 'Home',
        icon: 'home',
        to: '/home',
        count: homeItemsQueueCount,
      },
      {
        title: 'Community',
        icon: 'community',
        to: '/timeline/all',
        hidden: !showCommunityTimeline,
      },
      {
        title: 'Notifications',
        icon: 'notifications',
        to: '/notifications',
        count: notificationCount,
      },
      {
        title: 'Search',
        icon: 'search-alt',
        to: '/search',
        hidden: true, // : todo : show only when search on top is not visible
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
        href: 'https://chat.gab.com',
      },
      {
        title: 'More',
        icon: 'more',
        onClick: this.handleOpenSidebarMorePopover,
        buttonRef: this.setMoreButtonRef,
        active: moreOpen,
      },
    ]

    const shortcutItems = [
      // {
      //   title: 'Meme Group',
      //   icon: 'group',
      //   to: '/',
      //   count: 0,
      // },
      // {
      //   title: '@andrew',
      //   image: 'http://localhost:3000/system/accounts/avatars/000/000/001/original/260e8c96c97834da.jpeg?1562898139',
      //   to: '/',
      //   count: 3,
      // },
    ]

    const exploreItems = [
      {
        title: 'Apps',
        icon: 'apps',
        href: 'https://apps.gab.com',
      },
      {
        title: 'Shop',
        icon: 'shop',
        href: 'https://shop.dissenter.com',
      },
      {
        title: 'Trends',
        icon: 'trends',
        href: 'https://trends.gab.com',
      },
      {
        title: 'Dissenter',
        icon: 'dissenter',
        href: 'https://dissenter.com',
      },
    ]

    return (
      <header role='banner' className={[_s.default, _s.flexGrow1, _s.z3, _s.alignItemsEnd].join(' ')}>
        <div className={[_s.default, _s.width240PX].join(' ')}>
          <div className={[_s.default, _s.positionFixed, _s.top0, _s.height100PC].join(' ')}>
            <div className={[_s.default, _s.height100PC, _s.alignItemsStart, _s.width240PX, _s.pr15, _s.py10, _s.overflowYScroll].join(' ')}>

              <SidebarHeader />

              <nav aria-label='Primary' role='navigation' className={[_s.default, _s.width100PC, _s.mb15].join(' ')}>
                <SidebarSectionTitle>Menu</SidebarSectionTitle>
                {
                  menuItems.map((menuItem, i) => {
                    if (menuItem.hidden) return null

                    return (
                      <SidebarSectionItem {...menuItem} key={`sidebar-item-menu-${i}`} />
                    )
                  })
                }
                { /* <SidebarSectionTitle>Shortcuts</SidebarSectionTitle> */ }
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

              <Responsive min={Constants.BREAKPOINT_SMALL}>
                <Button
                  block
                  onClick={this.handleOpenComposeModal}
                  className={[_s.py15, _s.fontSize15PX, _s.fontWeightBold].join(' ')}
                >
                  Gab
                </Button>
              </Responsive>

              <Responsive max={Constants.BREAKPOINT_SMALL}>
                <Button
                  onClick={this.handleOpenComposeModal}
                  className={_s.py15}
                  icon='pencil'
                />
              </Responsive>

            </div>
          </div>
        </div>
      </header>
    )
  }

}