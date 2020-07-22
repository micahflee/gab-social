import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import {
  BREAKPOINT_SMALL,
} from '../constants'
import Button from './button'
import { closeSidebar } from '../actions/sidebar'
import { openModal } from '../actions/modal'
import { openPopover } from '../actions/popover'
import { fetchShortcuts } from '../actions/shortcuts'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import Responsive from '../features/ui/util/responsive_component'
import SidebarSectionTitle from './sidebar_section_title'
import SidebarSectionItem from './sidebar_section_item'
import Heading from './heading'
import BackButton from './back_button'
import Pills from './pills'
import Text from './text'

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Following' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Muted words' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  lists: { id: 'column.lists', defaultMessage: 'Lists' },
  apps: { id: 'tabs_bar.apps', defaultMessage: 'Apps' },
  more: { id: 'sidebar.more', defaultMessage: 'More' },
  explore: { id: 'explore', defaultMessage: 'Explore' },
  menu: { id: 'menu', defaultMessage: 'Menu' },
  pro: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  trends: { id: 'promo.trends', defaultMessage: 'Trends' },
  search: { id: 'tabs_bar.search', defaultMessage: 'Search' },
  shop: { id: 'tabs_bar.shop', defaultMessage: 'Store - Buy Merch' },
  donate: { id: 'tabs_bar.donate', defaultMessage: 'Make a Donation' },
  shortcuts: { id: 'navigation_bar.shortcuts', defaultMessage: 'Shortcuts' },
  all: { id: 'all', defaultMessage: 'All' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
})

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
  shortcuts: state.getIn(['shortcuts', 'items']),
  moreOpen: state.getIn(['popover', 'popoverType']) === 'SIDEBAR_MORE',
  notificationCount: state.getIn(['notifications', 'unread']),
  homeItemsQueueCount: state.getIn(['timelines', 'home', 'totalQueuedItemsCount']),
})

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
  onFetchShortcuts() {
    dispatch(fetchShortcuts())
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Sidebar extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    moreOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onOpenComposeModal: PropTypes.func.isRequired,
    onFetchShortcuts: PropTypes.func.isRequired,
    openSidebarMorePopover: PropTypes.func.isRequired,
    notificationCount: PropTypes.number.isRequired,
    homeItemsQueueCount: PropTypes.number.isRequired,
    actions: PropTypes.array,
    tabs: PropTypes.array,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
    shortcuts: ImmutablePropTypes.list,
  }

  state = {
    hoveringShortcuts: false,
  }

  componentDidMount() {
    this.props.onFetchShortcuts()
  }

  handleOpenComposeModal = () => {
    this.props.onOpenComposeModal()
  }

  handleOpenSidebarMorePopover = () => {
    this.props.openSidebarMorePopover({
      targetRef: this.moreBtnRef,
      position: 'top',
    })
  }

  handleMouseEnterShortcuts = () => {
    this.setState({ hoveringShortcuts: true })
  }

  handleMouseLeaveShortcuts = () => {
    this.setState({ hoveringShortcuts: false })
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
      moreOpen,
      actions,
      tabs,
      title,
      showBackBtn,
      shortcuts,
    } = this.props
    const { hoveringShortcuts } = this.state

    if (!me || !account) return null

    const menuItems = [
      {
        title: 'Home',
        icon: 'home',
        to: '/home',
        count: homeItemsQueueCount,
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
        title: 'Explore',
        icon: 'explore',
        to: '/explore',
      },
      {
        title: 'Pro Feed',
        icon: 'circle',
        to: '/timeline/pro',
      },
      {
        title: 'More',
        icon: 'more',
        onClick: this.handleOpenSidebarMorePopover,
        buttonRef: this.setMoreButtonRef,
        active: moreOpen,
      },
    ]

    let shortcutItems = []
    if (!!shortcuts) {
      shortcuts.forEach((s) => {
        shortcutItems.push({
          to: s.get('to'),
          title: s.get('title'),
          image: s.get('image'),
        })
      })
    }

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
          <div className={[_s.default, _s.posFixed, _s.heightCalc53PX, _s.bottom0].join(' ')}>
            <div className={[_s.default, _s.height100PC, _s.alignItemsStart, _s.width240PX, _s.pr15, _s.py10, _s.noScrollbar, _s.overflowYScroll].join(' ')}>
              <div className={[_s.default, _s.width100PC].join(' ')}>
                {
                  !!title &&
                  <div className={[_s.default, _s.flexRow, _s.px5, _s.pt10].join(' ')}>
                    {
                      showBackBtn &&
                      <BackButton
                        icon='arrow-left'
                      />
                    }
                    <Heading size='h1'>
                      {title}
                    </Heading>
                    {
                      !!actions &&
                      <div className={[_s.default, _s.bgTransparent, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.mlAuto].join(' ')}>
                        {
                          actions.map((action, i) => (
                            <Button
                              isNarrow
                              backgroundColor='none'
                              color='primary'
                              onClick={() => action.onClick()}
                              key={`action-btn-${i}`}
                              className={[_s.ml5, _s.px5].join(' ')}
                              icon={action.icon}
                              iconClassName={_s.fillPrimary}
                              iconSize='14px'
                            />
                          ))
                        }
                      </div>
                    }
                  </div>
                }
                {
                  !!tabs &&
                  <div className={[_s.default, _s.mt10, _s.pb15, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
                    <Pills pills={tabs} />
                  </div>
                }
              </div>
              <nav aria-label='Primary' role='navigation' className={[_s.default, _s.width100PC, _s.mb15].join(' ')}>
                <SidebarSectionTitle>{intl.formatMessage(messages.menu)}</SidebarSectionTitle>
                {
                  menuItems.map((menuItem, i) => {
                    if (menuItem.hidden) return null

                    return (
                      <SidebarSectionItem {...menuItem} key={`sidebar-item-menu-${i}`} />
                    )
                  })
                }
                {
                  !!shortcutItems.length > 0 &&
                  <Fragment>
                    <SidebarSectionTitle>
                      <div
                        className={[_s.displayFlex, _s.alignItemsCenter, _s.flexRow].join(' ')}
                        onMouseEnter={this.handleMouseEnterShortcuts}
                        onMouseLeave={this.handleMouseLeaveShortcuts}
                      >
                        <span>
                          {intl.formatMessage(messages.shortcuts)}
                        </span>
                        <Button
                          isText
                          to='/shortcuts'
                          color='brand'
                          backgroundColor='none'
                          className={_s.mlAuto}
                        >
                          {
                            hoveringShortcuts &&
                            <Text color='inherit' size='small' weight='medium' align='right'>
                              {intl.formatMessage(messages.all)}
                            </Text>
                          }
                        </Button>
                      </div>
                    </SidebarSectionTitle>
                    {
                      shortcutItems.map((shortcutItem, i) => (
                        <SidebarSectionItem {...shortcutItem} key={`sidebar-item-shortcut-${i}`} />
                      ))
                    }
                  </Fragment>
                }
                <SidebarSectionTitle>{intl.formatMessage(messages.explore)}</SidebarSectionTitle>
                {
                  exploreItems.map((exploreItem, i) => (
                    <SidebarSectionItem {...exploreItem} key={`sidebar-item-explore-${i}`} />
                  ))
                }
              </nav>

              <Responsive min={BREAKPOINT_SMALL}>
                <Button
                  isBlock
                  onClick={this.handleOpenComposeModal}
                  className={[_s.py15, _s.fs15PX, _s.fontWeightBold].join(' ')}
                >
                  Gab
                </Button>
              </Responsive>

              <Responsive max={BREAKPOINT_SMALL}>
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