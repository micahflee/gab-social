import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { HotKeys } from 'react-hotkeys';
import classNames from 'classnames/bind'
import { me, displayMedia } from '../initial_state';
import StatusCard from './status_card'
import { MediaGallery, Video } from '../features/ui/util/async_components';
import ComposeFormContainer from '../features/compose/containers/compose_form_container'
import StatusContent from './status_content'
import StatusPrepend from './status_prepend'
import StatusActionBar from './status_action_bar';
import Poll from './poll';
import StatusHeader from './status_header'
import Text from './text'

// We use the component (and not the container) since we do not want
// to use the progress bar to show download progress
import Bundle from '../features/ui/util/bundle';

const cx = classNames.bind(_s)

export const textForScreenReader = (intl, status, rebloggedByText = false) => {
  const displayName = status.getIn(['account', 'display_name']);

  // : todo :
  const values = [
    // displayName.length === 0 ? status.getIn(['account', 'acct']).split('@')[0] : displayName,
    // status.get('spoiler_text') && status.get('hidden')
    //   ? status.get('spoiler_text')
    //   : status.get('search_index').slice(status.get('spoiler_text').length),
    // intl.formatDate(status.get('created_at'), { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    // status.getIn(['account', 'acct']),
  ];

  if (rebloggedByText) {
    values.push(rebloggedByText);
  }

  return values.join(', ');
};

export const defaultMediaVisibility = status => {
  if (!status) return undefined

  if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
    status = status.get('reblog')
  }

  return (displayMedia !== 'hide_all' && !status.get('sensitive')) || displayMedia === 'show_all'
}

const messages = defineMessages({
  filtered: { id: 'status.filtered', defaultMessage: 'Filtered' },
})

export default
@injectIntl
class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    onClick: PropTypes.func,
    onReply: PropTypes.func,
    onShowRevisions: PropTypes.func,
    onQuote: PropTypes.func,
    onFavorite: PropTypes.func,
    onRepost: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onMention: PropTypes.func,
    onPin: PropTypes.func,
    onOpenMedia: PropTypes.func,
    onOpenVideo: PropTypes.func,
    onBlock: PropTypes.func,
    onEmbed: PropTypes.func,
    onHeightChange: PropTypes.func,
    onToggleHidden: PropTypes.func,
    muted: PropTypes.bool,
    hidden: PropTypes.bool,
    onMoveUp: PropTypes.func,
    onMoveDown: PropTypes.func,
    showThread: PropTypes.bool,
    getScrollPosition: PropTypes.func,
    updateScrollBottom: PropTypes.func,
    cacheMediaWidth: PropTypes.func,
    cachedMediaWidth: PropTypes.number,
    group: ImmutablePropTypes.map,
    promoted: PropTypes.bool,
    onOpenProUpgradeModal: PropTypes.func,
    intl: PropTypes.object.isRequired,
    borderless: PropTypes.bool,
    isChild: PropTypes.bool,
  }

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = ['status', 'account', 'muted', 'hidden']

  state = {
    showMedia: defaultMediaVisibility(this.props.status),
    statusId: undefined,
  }

  // Track height changes we know about to compensate scrolling
  componentDidMount() {
    this.didShowCard = !this.props.muted && !this.props.hidden && this.props.status && this.props.status.get('card');
  }

  getSnapshotBeforeUpdate() {
    if (this.props.getScrollPosition) {
      return this.props.getScrollPosition()
    }

    return null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.status && nextProps.status.get('id') !== prevState.statusId) {
      return {
        showMedia: defaultMediaVisibility(nextProps.status),
        statusId: nextProps.status.get('id'),
      };
    }

    return null;
  }

  // Compensate height changes
  componentDidUpdate(prevProps, prevState, snapshot) {
    const doShowCard = !this.props.muted && !this.props.hidden && this.props.status && this.props.status.get('card');

    if (doShowCard && !this.didShowCard) {
      this.didShowCard = true;

      if (snapshot !== null && this.props.updateScrollBottom) {
        if (this.node && this.node.offsetTop < snapshot.top) {
          this.props.updateScrollBottom(snapshot.height - snapshot.top);
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.node && this.props.getScrollPosition) {
      const position = this.props.getScrollPosition();
      if (position !== null && this.node.offsetTop < position.top) {
        requestAnimationFrame(() => {
          this.props.updateScrollBottom(position.height - position.top);
        });
      }
    }
  }

  handleToggleMediaVisibility = () => {
    this.setState({ showMedia: !this.state.showMedia })
  }

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
      return;
    }

    if (!this.context.router) return;

    this.context.router.history.push(
      `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
    )
  }

  handleExpandClick = e => {
    if (e.button === 0) {
      if (!this.context.router) return;

      this.context.router.history.push(
        `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
      );
    }
  };

  handleExpandedToggle = () => {
    this.props.onToggleHidden(this._properStatus());
  };

  renderLoadingMediaGallery() {
    return <div className='media_gallery' style={{ height: '110px' }} />;
  }

  renderLoadingVideoPlayer() {
    return <div className='media-spoiler-video' style={{ height: '110px' }} />;
  }

  handleOpenVideo = (media, startTime) => {
    this.props.onOpenVideo(media, startTime);
  };

  handleHotkeyReply = e => {
    e.preventDefault();
    this.props.onReply(this._properStatus(), this.context.router.history);
  };

  handleHotkeyFavorite = () => {
    this.props.onFavorite(this._properStatus());
  };

  handleHotkeyBoost = e => {
    this.props.onRepost(this._properStatus(), e);
  };

  handleHotkeyMention = e => {
    e.preventDefault();
    this.props.onMention(this._properStatus().get('account'), this.context.router.history);
  };

  handleHotkeyOpen = () => {
    this.context.router.history.push(
      `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
    );
  };

  handleHotkeyOpenProfile = () => {
    this.context.router.history.push(`/${this._properStatus().getIn(['account', 'acct'])}`);
  };

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

  handleRef = c => {
    this.node = c
  }


  handleOpenProUpgradeModal = () => {
    this.props.onOpenProUpgradeModal();
  }

  render() {
    const {
      intl,
      hidden,
      featured,
      showThread,
      group,
      promoted,
      borderless,
      isChild,
    } = this.props

    let media = null
    let rebloggedByText, reblogContent

    //   rebloggedByText = intl.formatMessage(
    //     { id: 'status.reposted_by', defaultMessage: '{name} reposted' },
    //     { name: status.getIn(['account', 'acct']) }
    //   );

    //   reblogContent = status.get('contentHtml');
    //   status = status.get('reblog');
    // }

    const { status, ...other } = this.props;

    if (!status) return null

    if (hidden) {
      return (
        <div ref={this.handleRef}>
          {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
          {status.get('content')}
        </div>
      );
    }

    if (status.get('filtered') || status.getIn(['reblog', 'filtered'])) {
      const minHandlers = this.props.muted ? {} : {
        moveUp: this.handleHotkeyMoveUp,
        moveDown: this.handleHotkeyMoveDown,
      }

      return (
        <HotKeys handlers={minHandlers}>
          <div className='status__wrapper status__wrapper--filtered focusable' tabIndex='0' ref={this.handleRef}>
            <Text>{intl.formatMessage(messages.filtered)}</Text>
          </div>
        </HotKeys>
      )
    }

    if (status.get('poll')) {
      media = <Poll pollId={status.get('poll')} />
    } else if (status.get('media_attachments').size > 0) {
      if (status.getIn(['media_attachments', 0, 'type']) === 'video') {
        const video = status.getIn(['media_attachments', 0])

        media = (
          <Bundle fetchComponent={Video} loading={this.renderLoadingVideoPlayer}>
            {Component => (
              <Component
                inline
                preview={video.get('preview_url')}
                blurhash={video.get('blurhash')}
                src={video.get('url')}
                alt={video.get('description')}
                aspectRatio={video.getIn(['meta', 'small', 'aspect'])}
                width={this.props.cachedMediaWidth}
                height={110}
                sensitive={status.get('sensitive')}
                onOpenVideo={this.handleOpenVideo}
                cacheWidth={this.props.cacheMediaWidth}
                visible={this.state.showMedia}
                onToggleVisibility={this.handleToggleMediaVisibility}
              />
            )}
          </Bundle>
        )
      } else {
        media = (
          <Bundle fetchComponent={MediaGallery} loading={this.renderLoadingMediaGallery}>
            {Component => (
              <Component
                reduced={isChild}
                media={status.get('media_attachments')}
                sensitive={status.get('sensitive')}
                height={110}
                onOpenMedia={this.props.onOpenMedia}
                cacheWidth={this.props.cacheMediaWidth}
                defaultWidth={this.props.cachedMediaWidth}
                visible={this.state.showMedia}
                onToggleVisibility={this.handleToggleMediaVisibility}
              />
            )}
          </Bundle>
        )
      }
    } else if (status.get('spoiler_text').length === 0 && status.get('card')) {
      media = (
        <StatusCard
          onOpenMedia={this.props.onOpenMedia}
          card={status.get('card')}
          cacheWidth={this.props.cacheMediaWidth}
          defaultWidth={this.props.cachedMediaWidth}
        />
      )
    }

    const handlers = this.props.muted ? {} : {
      reply: this.handleHotkeyReply,
      favorite: this.handleHotkeyFavorite,
      boost: this.handleHotkeyBoost,
      mention: this.handleHotkeyMention,
      open: this.handleHotkeyOpen,
      openProfile: this.handleHotkeyOpenProfile,
      moveUp: this.handleHotkeyMoveUp,
      moveDown: this.handleHotkeyMoveDown,
      toggleHidden: this.handleHotkeyToggleHidden,
      toggleSensitive: this.handleHotkeyToggleSensitive,
    }

    const containerClasses = cx({
      default: 1,
      radiusSmall: !borderless && !isChild,
      mb15: !borderless && !isChild,
      backgroundColorPrimary: 1,
      pb15: featured,
      borderBottom1PX: featured && !isChild,
      borderColorSecondary: featured && !isChild,
    })

    const innerContainerClasses = cx({
      default: 1,
      overflowHidden: 1,
      radiusSmall: !borderless,
      borderColorSecondary: !borderless,
      border1PX: !borderless,
      pb10: isChild && status.get('media_attachments').size === 0,
      pb5: isChild && status.get('media_attachments').size > 1,
      cursorPointer: isChild,
      backgroundSubtle_onHover: isChild,
    })

    return (
      <HotKeys handlers={handlers}>
        <div
          className={containerClasses}
          tabIndex={this.props.muted ? null : 0}
          data-featured={featured ? 'true' : null}
          aria-label={textForScreenReader(intl, status, rebloggedByText)}
          ref={this.handleRef}
          // onClick={this.handleClick}
        >
          <div className={innerContainerClasses}>

            <div data-id={status.get('id')}>

              <StatusPrepend status={status} promoted={promoted} featured={featured} />

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

              {media}

              {
                !!status.get('quote') && !isChild &&
                <div className={[_s.default, _s.mt10, _s.px10].join(' ')}>
                  <Status status={status.get('quoted_status')} isChild />
                </div>
              }

              {
                !isChild &&
                <StatusActionBar status={status} {...other} />
              }

              {
                !isChild && !!me &&
                <div className={[_s.default, _s.borderTop1PX, _s.borderColorSecondary, _s.pt10, _s.px15, _s.mb10].join(' ')}>
                  <ComposeFormContainer replyToId={status.get('id')} shouldCondense />
                </div>
              }
            </div>
          </div>
        </div>
      </HotKeys>
    );
  }

}
