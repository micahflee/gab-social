import ImmutablePropTypes from 'react-immutable-proptypes'
import { injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { HotKeys } from 'react-hotkeys'
import classNames from 'classnames/bind'
import { me, displayMedia, compactMode } from '../initial_state'
import StatusCard from './status_card'
import { MediaGallery, Video } from '../features/ui/util/async_components'
import ComposeFormContainer from '../features/compose/containers/compose_form_container'
import StatusContent from './status_content'
import StatusPrepend from './status_prepend'
import StatusActionBar from './status_action_bar'
import StatusMedia from './status_media'
import Poll from './poll'
import StatusHeader from './status_header'
import CommentList from './comment_list'

// We use the component (and not the container) since we do not want
// to use the progress bar to show download progress
import Bundle from '../features/ui/util/bundle'

const cx = classNames.bind(_s)

export const textForScreenReader = (intl, status, rebloggedByText = false) => {
  if (!intl || !status) return ''

  const displayName = status.getIn(['account', 'display_name'])

  const values = [
    displayName.length === 0 ? status.getIn(['account', 'acct']).split('@')[0] : displayName,
    status.get('spoiler_text') && status.get('hidden')
      ? status.get('spoiler_text')
      : status.get('search_index').slice(status.get('spoiler_text').length),
    intl.formatDate(status.get('created_at'), { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    `@${status.getIn(['account', 'acct'])}`,
  ]

  if (rebloggedByText) {
    values.push(rebloggedByText)
  }

  return values.join(', ')
}

export const defaultMediaVisibility = (status) => {
  if (!status) return undefined

  if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
    status = status.get('reblog')
  }

  return (displayMedia !== 'hide_all' && !status.get('sensitive')) || displayMedia === 'show_all'
}

export default
@injectIntl
class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    intl: PropTypes.object.isRequired,
    status: ImmutablePropTypes.map,
    descendantsIds: ImmutablePropTypes.list,
    isChild: PropTypes.bool,
    isPromoted: PropTypes.bool,
    isFeatured: PropTypes.bool,
    isMuted: PropTypes.bool,
    isHidden: PropTypes.bool,
    isIntersecting: PropTypes.bool,
    onClick: PropTypes.func,
    onReply: PropTypes.func,
    onRepost: PropTypes.func,
    onFavorite: PropTypes.func,
    onMention: PropTypes.func,
    onOpenMedia: PropTypes.func,
    onOpenVideo: PropTypes.func,
    onHeightChange: PropTypes.func,
    onToggleHidden: PropTypes.func,
    onShare: PropTypes.func,
    onMoveUp: PropTypes.func,
    onMoveDown: PropTypes.func,
    onFetchComments: PropTypes.func,
    getScrollPosition: PropTypes.func,
    updateScrollBottom: PropTypes.func,
    cacheMediaWidth: PropTypes.func,
    cachedMediaWidth: PropTypes.number,
    contextType: PropTypes.string,
    commentsLimited: PropTypes.bool,
    onOpenLikes: PropTypes.func.isRequired,
    onOpenReposts: PropTypes.func.isRequired,
  }

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'descendantsIds',
    'isChild',
    'isPromoted',
    'isFeatured',
    'isMuted',
    'isHidden',
    'isIntersecting',
  ]

  state = {
    loadedComments: false,
    showMedia: defaultMediaVisibility(this.props.status),
    statusId: undefined,
    height: undefined,
  }

  // Track height changes we know about to compensate scrolling
  componentDidMount() {
    const { isMuted, isHidden, status } = this.props
    this.didShowCard = !isMuted && !isHidden && status && status.get('card')
  }

  getSnapshotBeforeUpdate() {
    if (this.props.getScrollPosition) {
      return this.props.getScrollPosition()
    }

    return null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.isHidden && (nextProps.isIntersecting || !nextProps.commentsLimited) && !prevState.loadedComments) {
      return {
        loadedComments: true
      }
    }

    if (nextProps.status && nextProps.status.get('id') !== prevState.statusId) {
      return {
        loadedComments: false,
        showMedia: defaultMediaVisibility(nextProps.status),
        statusId: nextProps.status.get('id'),
      }
    }

    return null
  }

  // Compensate height changes
  componentDidUpdate(prevProps, prevState, snapshot) {
    // timeline lazy loading comments
    if (!prevState.loadedComments && this.state.loadedComments && this.props.status) {
      const commentCount = this.props.status.get('replies_count')
      if (commentCount > 0) {
        this.props.onFetchComments(this.props.status.get('id'))
        this._measureHeight(prevState.height !== this.state.height)
      }
    }

    const doShowCard = !this.props.isMuted && !this.props.isHidden && this.props.status && this.props.status.get('card')

    if (doShowCard && !this.didShowCard) {
      this.didShowCard = true

      if (snapshot !== null && this.props.updateScrollBottom) {
        if (this.node && this.node.offsetTop < snapshot.top) {
          this.props.updateScrollBottom(snapshot.height - snapshot.top)
        }
      }
    }
  }

  handleMoveUp = (id) => {
    const { status, ancestorsIds, descendantsIds } = this.props

    if (id === status.get('id')) {
      this._selectChild(ancestorsIds.size - 1, true)
    } else {
      let index = ancestorsIds.indexOf(id)

      if (index === -1) {
        index = descendantsIds.indexOf(id)
        this._selectChild(ancestorsIds.size + index, true)
      } else {
        this._selectChild(index - 1, true)
      }
    }
  }

  handleMoveDown = id => {
    const { status, ancestorsIds, descendantsIds } = this.props

    if (id === status.get('id')) {
      this._selectChild(ancestorsIds.size + 1, false)
    } else {
      let index = ancestorsIds.indexOf(id)

      if (index === -1) {
        index = descendantsIds.indexOf(id)
        this._selectChild(ancestorsIds.size + index + 2, false)
      } else {
        this._selectChild(index + 1, false)
      }
    }
  }

  _selectChild(index, align_top) {
    const container = this.node
    const element = container.querySelectorAll('.focusable')[index]

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true)
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false)
      }
      element.focus()
    }
  }

  componentWillUnmount() {
    if (this.node && this.props.getScrollPosition) {
      const position = this.props.getScrollPosition()
      if (position !== null && this.node.offsetTop < position.top) {
        requestAnimationFrame(() => {
          this.props.updateScrollBottom(position.height - position.top)
        })
      }
    }
  }

  handleToggleMediaVisibility = () => {
    this.setState({ showMedia: !this.state.showMedia })
  }

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick()
      return
    }

    if (!this.context.router) return

    this.context.router.history.push(
      `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
    )
  }

  handleExpandClick = e => {
    if (e.button === 0) {
      if (!this.context.router) return

      this.context.router.history.push(
        `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
      )
    }
  }

  handleExpandedToggle = () => {
    this.props.onToggleHidden(this._properStatus())
  }

  renderLoadingMedia() {
    return <div className={_s.backgroundColorPanel} style={{ height: '110px' }} />
  }

  handleOpenVideo = (media, startTime) => {
    this.props.onOpenVideo(media, startTime)
  }

  handleHotkeyReply = e => {
    e.preventDefault()
    this.props.onReply(this._properStatus(), this.context.router.history)
  }

  handleHotkeyFavorite = () => {
    this.props.onFavorite(this._properStatus())
  }

  handleHotkeyRepost = e => {
    this.props.onQuote(this._properStatus(), e)
  }

  handleHotkeyMention = e => {
    e.preventDefault()
    this.props.onMention(this._properStatus().get('account'), this.context.router.history)
  }

  handleHotkeyOpen = () => {
    this.context.router.history.push(
      `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
    )
  }

  handleHotkeyOpenProfile = () => {
    this.context.router.history.push(`/${this._properStatus().getIn(['account', 'acct'])}`)
  }

  handleHotkeyMoveUp = e => {
    this.props.onMoveUp(this.props.status.get('id'), e.target.getAttribute('data-featured'))
  }

  handleHotkeyMoveDown = e => {
    this.props.onMoveDown(this.props.status.get('id'), e.target.getAttribute('data-featured'))
  }

  handleHotkeyToggleHidden = () => {
    this.props.onToggleHidden(this._properStatus())
  }

  handleHotkeyToggleSensitive = () => {
    this.handleToggleMediaVisibility()
  }

  _properStatus() {
    const { status } = this.props

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      return status.get('reblog')
    }

    return status
  }

  _measureHeight (heightJustChanged) {
    try {
      scheduleIdleTask(() => this.node && this.setState({ height: Math.ceil(this.node.scrollHeight) + 1 }))
      
      if (heightJustChanged) {
        this.props.onHeightChange()
      } 
    } catch (error) {
      
    }
  }

  handleRef = c => {
    this.node = c
    this._measureHeight()
  }

  render() {
    const {
      intl,
      isFeatured,
      isPromoted,
      isChild,
      isHidden,
      descendantsIds,
      commentsLimited,
    } = this.props
    
    let { status } = this.props

    if (!status) return null

    let reblogContent, rebloggedByText = null

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      rebloggedByText = intl.formatMessage(
        { id: 'status.reposted_by', defaultMessage: '{name} reposted' },
        { name: status.getIn(['account', 'acct']) }
      )
      reblogContent = status.get('contentHtml')
      status = status.get('reblog')
    }

    const handlers = (this.props.isMuted || isChild) ? {} : {
      reply: this.handleHotkeyReply,
      favorite: this.handleHotkeyFavorite,
      repost: this.handleHotkeyRepost,
      mention: this.handleHotkeyMention,
      open: this.handleHotkeyOpen,
      openProfile: this.handleHotkeyOpenProfile,
      moveUp: this.handleHotkeyMoveUp,
      moveDown: this.handleHotkeyMoveDown,
      toggleHidden: this.handleHotkeyToggleHidden,
      toggleSensitive: this.handleHotkeyToggleSensitive,
    }

     if (isHidden) {
      return (
        <HotKeys handlers={handlers}>
          <div ref={this.handleRef} className={classNames({ focusable: !this.props.muted })} tabIndex='0'>
            {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
            {status.get('content')}
          </div>
        </HotKeys>
      )
    }

    if (status.get('filtered') || status.getIn(['reblog', 'filtered'])) {
      return null
    }

    const containerClasses = cx({
      default: 1,
      pb15: isFeatured,
      radiusSmall: !isChild && !compactMode,
      bgPrimary: !isChild,
      boxShadowBlock: !isChild && !compactMode,
      outlineNone: 1,
      mb15: !isChild && !compactMode,
      borderRight1PX: !isChild && compactMode,
      borderLeft1PX: !isChild && compactMode,
      borderBottom1PX: !isChild && compactMode,
      borderColorSecondary: !isChild && compactMode,
    })

    const innerContainerClasses = cx({
      default: 1,
      overflowHidden: 1,
      radiusSmall: isChild,
      borderColorSecondary: isChild,
      border1PX: isChild,
      pb10: isChild && status.get('media_attachments').size === 0,
      pb5: isChild && status.get('media_attachments').size > 1,
      cursorPointer: isChild,
      bgSubtle_onHover: isChild,
    })

    return (
      <HotKeys handlers={handlers}>
        <div
          className={containerClasses}
          tabIndex={this.props.isMuted ? null : 0}
          data-featured={isFeatured ? 'true' : null}
          aria-label={textForScreenReader(intl, status, rebloggedByText)}
          ref={this.handleRef}
          onClick={isChild ? this.handleClick : undefined}
        >
          <div className={innerContainerClasses}>

            <div data-id={status.get('id')}>

              <StatusPrepend status={this.props.status} isPromoted={isPromoted} isFeatured={isFeatured} />

              <StatusHeader status={status} reduced={isChild} />

              <div className={_s.default}>
                <StatusContent
                  status={status}
                  reblogContent={reblogContent}
                  onClick={this.handleClick}
                  expanded={!status.get('hidden')}
                  onExpandedToggle={this.handleExpandedToggle}
                  collapsable
                />
              </div>

              <StatusMedia
                isChild={isChild}
                status={status}
                onOpenMedia={this.props.onOpenMedia}
                cacheWidth={this.props.cacheMediaWidth}
                defaultWidth={this.props.cachedMediaWidth}
                visible={this.state.showMedia}
                onToggleVisibility={this.handleToggleMediaVisibility}
                width={this.props.cachedMediaWidth}
                onOpenVideo={this.handleOpenVideo}
              />

              {
                !!status.get('quote') && !isChild &&
                <div className={[_s.default, _s.mt10, _s.px10].join(' ')}>
                  <Status status={status.get('quoted_status')} isChild intl={intl} />
                </div>
              }

              {
                !isChild &&
                <StatusActionBar
                  status={status}
                  onFavorite={this.props.onFavorite}
                  onReply={this.props.onReply}
                  onRepost={this.props.onRepost}
                  onShare={this.props.onShare}
                  onOpenLikes={this.props.onOpenLikes}
                  onOpenReposts={this.props.onOpenReposts}
                />
              }

              {
                !isChild && !compactMode && !!me &&
                <div className={[_s.default, _s.borderTop1PX, _s.borderColorSecondary, _s.pt10, _s.px15, _s.mb10].join(' ')}>
                  <ComposeFormContainer replyToId={status.get('id')} shouldCondense />
                </div>
              }

              {
                descendantsIds && !compactMode && !isChild && descendantsIds.size > 0 &&
                <div className={[_s.default, _s.mr10, _s.ml10, _s.mb10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')}/>
              }
              
              {
                descendantsIds && !compactMode && !isChild && descendantsIds.size > 0 &&
                <CommentList
                  commentsLimited={commentsLimited}
                  descendants={descendantsIds}
                />
              }
            </div>
          </div>
        </div>
      </HotKeys>
    )
  }

}
