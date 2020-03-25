'use strict'

import { HotKeys } from 'react-hotkeys'
import { defineMessages, injectIntl } from 'react-intl'
import { Switch, Redirect, withRouter } from 'react-router-dom'
import { debounce } from 'lodash'
import { uploadCompose, resetCompose } from '../../actions/compose'
import { expandHomeTimeline } from '../../actions/timelines'
import {
  initializeNotifications,
  expandNotifications,
} from '../../actions/notifications'
import LoadingBarContainer from '../../containers/loading_bar_container'
import { fetchFilters } from '../../actions/filters'
import { clearHeight } from '../../actions/height_cache'
import { openModal } from '../../actions/modal'
import WrappedRoute from './util/wrapped_route'
import ModalRoot from '../../components/modal/modal_root'
import PopoverRoot from '../../components/popover/popover_root'
import UploadArea from '../../components/upload_area'
import ProfilePage from '../../pages/profile_page'
import CommunityPage from '../../pages/community_page'
import HashtagPage from '../../pages/hashtag_page'
import ShortcutsPage from '../../pages/shortcuts_page'
import GroupPage from '../../pages/group_page'
import GroupsPage from '../../pages/groups_page'
import SearchPage from '../../pages/search_page'
import ErrorPage from '../../pages/error_page'
import HomePage from '../../pages/home_page'
import NotificationsPage from '../../pages/notifications_page'
import ListPage from '../../pages/list_page'
import ListsPage from '../../pages/lists_page'
import BasicPage from '../../pages/basic_page'
import ModalPage from '../../pages/modal_page'
import SettingsPage from '../../pages/settings_page'

import {
  AccountGallery,
  AccountTimeline,
  Blocks,
  CommunityTimeline,
  DomainBlocks,
  Favorites,
  Filters,
  Followers,
  Following,
  FollowRequests,
  GenericNotFound,
  GettingStarted,
  GroupsCollection,
  GroupCreate,
  GroupMembers,
  GroupRemovedAccounts,
  GroupTimeline,
  HashtagTimeline,
  HomeTimeline,
  LikedStatuses,
  ListCreate,
  ListsDirectory,
  ListEdit,
  ListTimeline,
  Mutes,
  Notifications,
  Reposts,
  Search,
  Shortcuts,
  Status,
} from './util/async_components'
import { me, meUsername } from '../../initial_state'

// Dummy import, to make sure that <Status /> ends up in the application bundle.
// Without this it ends up in ~8 very commonly used bundles.
import '../../components/status'
import { fetchGroups } from '../../actions/groups'

const messages = defineMessages({
  beforeUnload: { id: 'ui.beforeunload', defaultMessage: 'Your draft will be lost if you leave Gab Social.' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Gab' },
})

const mapStateToProps = state => ({
  isComposing: state.getIn(['compose', 'is_composing']),
  hasComposingText: state.getIn(['compose', 'text']).trim().length !== 0,
  hasMediaAttachments: state.getIn(['compose', 'media_attachments']).size > 0,
})

const keyMap = {
  help: '?',
  new: 'n',
  search: 's',
  forceNew: 'option+n',
  reply: 'r',
  Favorite: 'f',
  boost: 'b',
  mention: 'm',
  open: ['enter', 'o'],
  openProfile: 'p',
  moveDown: ['down', 'j'],
  moveUp: ['up', 'k'],
  back: 'backspace',
  goToHome: 'g h',
  goToNotifications: 'g n',
  goToStart: 'g s',
  goToFavorites: 'g f',
  goToProfile: 'g u',
  goToBlocked: 'g b',
  goToMuted: 'g m',
  goToRequests: 'g r',
}

class SwitchingArea extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    onLayoutChange: PropTypes.func.isRequired,
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleResize, {
      passive: true
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = debounce(() => {
    // The cached heights are no longer accurate, invalidate
    this.props.onLayoutChange()
  }, 500, {
      trailing: true,
    })

  setRef = c => {
    this.node = c.getWrappedInstance()
  }

  render() {
    const { children } = this.props

    return (
      <Switch>
        <Redirect from='/' to='/home' exact />
        <WrappedRoute path='/home' exact page={HomePage} component={HomeTimeline} content={children} />

        <WrappedRoute path='/timeline/all' exact page={CommunityPage} component={CommunityTimeline} content={children} componentParams={{ title: 'Community Timeline' }} />

        <WrappedRoute path='/groups' exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'featured' }} />
        <WrappedRoute path='/groups/new' exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'new' }} />
        <WrappedRoute path='/groups/browse/member' exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'member' }} />
        <WrappedRoute path='/groups/browse/admin' exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'admin' }} />

        <WrappedRoute path='/groups/create' page={ModalPage} component={GroupCreate} content={children} componentParams={{ title: 'Create Group' }} />
        <WrappedRoute path='/groups/:id/members' page={GroupPage} component={GroupMembers} content={children} />
        <WrappedRoute path='/groups/:id/removed-accounts' page={GroupPage} component={GroupRemovedAccounts} content={children} />
        <WrappedRoute path='/groups/:id/edit' page={ModalPage} component={GroupCreate} content={children} componentParams={{ title: 'Edit Group' }} />
        <WrappedRoute path='/groups/:id' page={GroupPage} component={GroupTimeline} content={children} />

        <WrappedRoute path='/tags/:id' publicRoute page={HashtagPage} component={HashtagTimeline} content={children} componentParams={{ title: 'Hashtag' }} />

        <WrappedRoute path='/shortcuts' publicRoute page={ShortcutsPage} component={Shortcuts} content={children} />

        <WrappedRoute path='/lists' exact page={ListsPage} component={ListsDirectory} content={children} />
        <WrappedRoute path='/lists/create' exact page={ModalPage} component={ListCreate} content={children} componentParams={{ title: 'Create List' }} />
        <WrappedRoute path='/lists/:id/edit' exact page={ModalPage} component={ListEdit} content={children} componentParams={{ title: 'Edit List' }} />
        <WrappedRoute path='/list/:id' page={ListPage} component={ListTimeline} content={children} />

        <WrappedRoute path='/notifications' exact page={NotificationsPage} component={Notifications} content={children} />

        <WrappedRoute path='/search' exact publicRoute page={SearchPage} component={Search} content={children} />
        <WrappedRoute path='/search/people' exact page={SearchPage} component={Search} content={children} />
        <WrappedRoute path='/search/hashtags' exact page={SearchPage} component={Search} content={children} />
        <WrappedRoute path='/search/groups' exact page={SearchPage} component={Search} content={children} />

        { /*
        <WrappedRoute path='/settings/account' exact page={SettingsPage} component={AccountSettings} content={children} />
        <WrappedRoute path='/settings/profile' exact page={SettingsPage} component={ProfileSettings} content={children} />
        <WrappedRoute path='/settings/relationships' exact page={SettingsPage} component={RelationshipSettings} content={children} />
        <WrappedRoute path='/settings/development' exact page={SettingsPage} component={Development} content={children} />
        <WrappedRoute path='/settings/billing' exact page={SettingsPage} component={Billing} content={children} />
        */ }

        <WrappedRoute path='/settings/blocks' exact page={SettingsPage} component={Blocks} content={children} componentParams={{ title: 'Blocked Accounts' }} />
        <WrappedRoute path='/settings/domain-blocks' exact page={SettingsPage} component={DomainBlocks} content={children} componentParams={{ title: 'Domain Blocks' }} />
        <WrappedRoute path='/settings/filters' exact page={SettingsPage} component={Filters} content={children} componentParams={{ title: 'Muted Words' }} />
        <WrappedRoute path='/settings/mutes' exact page={SettingsPage} component={Mutes} content={children} componentParams={{ title: 'Muted Accounts' }} />

        <Redirect from='/@:username' to='/:username' exact />
        <WrappedRoute path='/:username' publicRoute exact page={ProfilePage} component={AccountTimeline} content={children} />

        <Redirect from='/@:username/comments' to='/:username/comments' />
        <WrappedRoute path='/:username/comments' page={ProfilePage} component={AccountTimeline} content={children} componentParams={{ commentsOnly: true }} />

        <Redirect from='/@:username/followers' to='/:username/followers' />
        <WrappedRoute path='/:username/followers' page={ProfilePage} component={Followers} content={children} />

        <Redirect from='/@:username/following' to='/:username/following' />
        <WrappedRoute path='/:username/following' page={ProfilePage} component={Following} content={children} />

        <Redirect from='/@:username/media' to='/:username/media' />
        <WrappedRoute path='/:username/media' page={ProfilePage} component={AccountGallery} content={children} />

        <Redirect from='/@:username/likes' to='/:username/likes' />
        <WrappedRoute path='/:username/likes' page={ProfilePage} component={LikedStatuses} content={children} />

        <Redirect from='/@:username/posts/:statusId' to='/:username/posts/:statusId' exact />
        <WrappedRoute path='/:username/posts/:statusId' publicRoute exact page={BasicPage} component={Status} content={children} componentParams={{ title: 'Status' }} />

        <Redirect from='/@:username/posts/:statusId/reposts' to='/:username/posts/:statusId/reposts' />
        <WrappedRoute path='/:username/posts/:statusId/reposts' page={BasicPage} component={Reposts} content={children} componentParams={{ title: 'Reposts' }} />

        <Redirect from='/@:username/posts/:statusId/favorites' to='/:username/posts/:statusId/favorites' />
        <WrappedRoute path='/:username/posts/:statusId/favorites' page={BasicPage} component={Favorites} content={children} componentParams={{ title: 'Favorites' }} />

        <WrappedRoute page={ErrorPage} component={GenericNotFound} content={children} />
      </Switch>
    )
  }
}

export default
@connect(mapStateToProps)
@injectIntl
@withRouter
class UI extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node,
    isComposing: PropTypes.bool,
    hasComposingText: PropTypes.bool,
    hasMediaAttachments: PropTypes.bool,
    location: PropTypes.object,
    intl: PropTypes.object.isRequired,
  }

  state = {
    draggingOver: false,
  }

  handleBeforeUnload = (e) => {
    const {
      intl,
      isComposing,
      hasComposingText,
      hasMediaAttachments
    } = this.props

    if (isComposing && (hasComposingText || hasMediaAttachments)) {
      // Setting returnValue to any string causes confirmation dialog.
      // Many browsers no longer display this text to users,
      // but we set user-friendly message for other browsers, e.g. Edge.
      e.returnValue = intl.formatMessage(messages.beforeUnload)
    }
  }

  handleLayoutChange = () => {
    // The cached heights are no longer accurate, invalidate
    this.props.dispatch(clearHeight())
  }

  handleDragEnter = (e) => {
    e.preventDefault()

    if (!this.dragTargets) {
      this.dragTargets = []
    }

    if (this.dragTargets.indexOf(e.target) === -1) {
      this.dragTargets.push(e.target)
    }

    if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
      this.setState({
        draggingOver: true,
      })
    }
  }

  handleDragOver = (e) => {
    if (this.dataTransferIsText(e.dataTransfer)) return false

    e.preventDefault()
    e.stopPropagation()

    try {
      e.dataTransfer.dropEffect = 'copy'
    } catch (err) {
      //
    }

    return false
  }

  handleDrop = (e) => {
    if (!me) return

    if (this.dataTransferIsText(e.dataTransfer)) return
    e.preventDefault()

    this.setState({
      draggingOver: false
    })
    this.dragTargets = []

    if (e.dataTransfer && e.dataTransfer.files.length >= 1) {
      this.props.dispatch(uploadCompose(e.dataTransfer.files))
    }
  }

  handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.dragTargets = this.dragTargets.filter(el => el !== e.target && this.node.contains(el))

    if (this.dragTargets.length > 0) return

    this.setState({
      draggingOver: false
    })
  }

  dataTransferIsText = (dataTransfer) => {
    return (
      dataTransfer
      && Array.from(dataTransfer.types).includes('text/plain')
      && dataTransfer.items.length === 1
    )
  }

  closeUploadModal = () => {
    this.setState({
      draggingOver: false
    })
  }

  handleServiceWorkerPostMessage = ({ data }) => {
    if (data.type === 'navigate') {
      this.context.router.history.push(data.path)
    } else {
      console.warn('Unknown message type:', data.type)
    }
  }

  componentWillMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload, false)

    document.addEventListener('dragenter', this.handleDragEnter, false)
    document.addEventListener('dragover', this.handleDragOver, false)
    document.addEventListener('drop', this.handleDrop, false)
    document.addEventListener('dragleave', this.handleDragLeave, false)
    document.addEventListener('dragend', this.handleDragEnd, false)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerPostMessage)
    }

    if (typeof window.Notification !== 'undefined' && Notification.permission === 'default') {
      window.setTimeout(() => Notification.requestPermission(), 120 * 1000)
    }

    if (me) {
      this.props.dispatch(expandHomeTimeline())
      this.props.dispatch(expandNotifications())
      this.props.dispatch(initializeNotifications())
      this.props.dispatch(fetchGroups('member'))

      setTimeout(() => this.props.dispatch(fetchFilters()), 500)
    }
  }

  componentDidMount() {
    if (!me) return

    // this.hotkeys.__mousetrap__.stopCallback = (e, element) => {
    //   return ['TEXTAREA', 'SELECT', 'INPUT'].includes(element.tagName)
    // }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    document.removeEventListener('dragenter', this.handleDragEnter)
    document.removeEventListener('dragover', this.handleDragOver)
    document.removeEventListener('drop', this.handleDrop)
    document.removeEventListener('dragleave', this.handleDragLeave)
    document.removeEventListener('dragend', this.handleDragEnd)
  }

  setRef = c => {
    this.node = c
  }

  handleHotkeyNew = e => {
    e.preventDefault()

    const element = this.node.querySelector('.compose-form__autosuggest-wrapper textarea')

    if (element) {
      element.focus()
    }
  }

  handleHotkeySearch = e => {
    e.preventDefault()

    const element = this.node.querySelector('.search__input')

    if (element) {
      element.focus()
    }
  }

  handleHotkeyForceNew = e => {
    this.handleHotkeyNew(e)
    this.props.dispatch(resetCompose())
  }

  handleHotkeyBack = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/home') // homehack
    } else {
      this.context.router.history.goBack()
    }
  }

  setHotkeysRef = c => {
    this.hotkeys = c
  }

  handleHotkeyToggleHelp = () => {
    this.props.dispatch(openModal("HOTKEYS"))
  }

  handleHotkeyGoToHome = () => {
    this.context.router.history.push('/home')
  }

  handleHotkeyGoToNotifications = () => {
    this.context.router.history.push('/notifications')
  }

  handleHotkeyGoToStart = () => {
    this.context.router.history.push('/getting-started')
  }

  handleHotkeyGoToFavorites = () => {
    this.context.router.history.push(`/${meUsername}/favorites`)
  }

  handleHotkeyGoToProfile = () => {
    this.context.router.history.push(`/${meUsername}`)
  }

  handleHotkeyGoToBlocked = () => {
    this.context.router.history.push('/blocks')
  }

  handleHotkeyGoToMuted = () => {
    this.context.router.history.push('/mutes')
  }

  handleHotkeyGoToRequests = () => {
    this.context.router.history.push('/follow_requests')
  }

  handleOpenComposeModal = () => {
    this.props.dispatch(openModal("COMPOSE"))
  }

  render() {
    const { draggingOver } = this.state
    const { children, location } = this.props

    const handlers = me ? {
      help: this.handleHotkeyToggleHelp,
      new: this.handleHotkeyNew,
      search: this.handleHotkeySearch,
      forceNew: this.handleHotkeyForceNew,
      back: this.handleHotkeyBack,
      goToHome: this.handleHotkeyGoToHome,
      goToNotifications: this.handleHotkeyGoToNotifications,
      goToStart: this.handleHotkeyGoToStart,
      goToFavorites: this.handleHotkeyGoToFavorites,
      goToProfile: this.handleHotkeyGoToProfile,
      goToBlocked: this.handleHotkeyGoToBlocked,
      goToMuted: this.handleHotkeyGoToMuted,
      goToRequests: this.handleHotkeyGoToRequests,
    } : {}

    return (
      <div ref={this.setRef}>
        <LoadingBarContainer className={[_s.height1PX, _s.z3, _s.backgroundColorBrandLight].join(' ')} />

        <SwitchingArea location={location} onLayoutChange={this.handleLayoutChange}>
          {children}
        </SwitchingArea>

        <ModalRoot />
        <PopoverRoot />

        <UploadArea active={draggingOver} onClose={this.closeUploadModal} />
      </div>
    )
  }

}
