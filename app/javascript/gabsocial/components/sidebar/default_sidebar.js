import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { openPopover } from '../../actions/popover'
import { fetchShortcuts } from '../../actions/shortcuts'
import { me } from '../../initial_state'
import Responsive from '../../features/ui/util/responsive_component'
import Button from '../button'
import Text from '../text'
import SidebarSectionTitle from '../sidebar_section_title'
import SidebarSectionItem from '../sidebar_section_item'
import SidebarLayout from './sidebar_layout'

class DefaultSidebar extends ImmutablePureComponent {

  state = {
    hoveringShortcuts: false,
  }

  componentDidMount() {
    if (this.props.isPro) {
      this.props.onFetchShortcuts()
    }
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
      notificationCount,
      homeItemsQueueCount,
      moreOpen,
      actions,
      tabs,
      title,
      showBackBtn,
      shortcuts,
      unreadChatsCount,
    } = this.props
    const { hoveringShortcuts } = this.state

    if (!me) return null

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

    return (
      <SidebarLayout
        title={title}
        showBackBtn={showBackBtn}
        actions={actions}
        tabs={tabs}
      >
        <SidebarSectionTitle>
          {intl.formatMessage(messages.menu)}
        </SidebarSectionTitle>
        <SidebarSectionItem title='Home' icon='home' to='/home' count={homeItemsQueueCount} />
        <SidebarSectionItem title='Notifications' icon='notifications' to='/notifications' count={notificationCount} />
        <SidebarSectionItem title='Chats' icon='chat' to='/messages' count={unreadChatsCount} />
        <SidebarSectionItem title='Groups' icon='group' to='/groups' />
        <SidebarSectionItem title='Lists' icon='list' to='/lists' />
        <SidebarSectionItem title='Explore' icon='explore' to='/explore' />
        <SidebarSectionItem title='Pro Feed' icon='explore' to='/timeline/pro' />
        <SidebarSectionItem title='News' icon='news' to='/news' />
        <SidebarSectionItem title='More' icon='more' onClick={this.handleOpenSidebarMorePopover} buttonRef={this.setMoreButtonRef} active={moreOpen} />

        {
          shortcutItems.length > 0 &&
          <React.Fragment>
            <SidebarSectionTitle>
              <div
                className={[_s.displayFlex, _s.aiCenter, _s.flexRow].join(' ')}
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
          </React.Fragment>
        }

        <SidebarSectionTitle>{intl.formatMessage(messages.explore)}</SidebarSectionTitle>
        <SidebarSectionItem title='Apps' icon='apps' href='https://apps.gab.com' />
        <SidebarSectionItem title='Shop' icon='shop' href='https://shop.dissenter.com' />
        <SidebarSectionItem title='Trends' icon='trends' href='https://trends.gab.com' />
        <SidebarSectionItem title='GabPRO' icon='pro' href='https://pro.gab.com' />
        <SidebarSectionItem title='Dissenter' icon='dissenter' href='https://dissenter.com' />
         
      </SidebarLayout>
    )
  }

}

const messages = defineMessages({
  explore: { id: 'explore', defaultMessage: 'Explore' },
  gabPro: { id: 'gab_pro', defaultMessage: 'GabPRO' },
  menu: { id: 'menu', defaultMessage: 'Menu' },
  shortcuts: { id: 'navigation_bar.shortcuts', defaultMessage: 'Shortcuts' },
  all: { id: 'all', defaultMessage: 'All' },
})

const mapStateToProps = (state) => ({
  shortcuts: state.getIn(['shortcuts', 'items']),
  moreOpen: state.getIn(['popover', 'popoverType']) === 'SIDEBAR_MORE',
  notificationCount: state.getIn(['notifications', 'unread']),
  unreadChatsCount: state.getIn(['chats', 'chatsUnreadCount']),
  homeItemsQueueCount: state.getIn(['timelines', 'home', 'totalQueuedItemsCount']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = (dispatch) => ({
  openSidebarMorePopover(props) {
    dispatch(openPopover('SIDEBAR_MORE', props))
  },
  onFetchShortcuts() {
    dispatch(fetchShortcuts())
  },
})

DefaultSidebar.propTypes = {
  intl: PropTypes.object.isRequired,
  moreOpen: PropTypes.bool,
  onFetchShortcuts: PropTypes.func.isRequired,
  openSidebarMorePopover: PropTypes.func.isRequired,
  notificationCount: PropTypes.number.isRequired,
  homeItemsQueueCount: PropTypes.number.isRequired,
  unreadChatsCount: PropTypes.number.isRequired,
  actions: PropTypes.array,
  tabs: PropTypes.array,
  title: PropTypes.string,
  showBackBtn: PropTypes.bool,
  shortcuts: ImmutablePropTypes.list,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DefaultSidebar))