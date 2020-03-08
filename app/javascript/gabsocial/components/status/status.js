import { Fragment } from 'react'
import { NavLink } from 'react-router-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { HotKeys } from 'react-hotkeys';
import classNames from 'classnames/bind'
import { displayMedia } from '../../initial_state';
import Card from '../../features/status/components/card';
import { MediaGallery, Video } from '../../features/ui/util/async-components';
import ComposeFormContainer from '../../features/compose/containers/compose_form_container'
import Avatar from '../avatar';
import StatusQuote from '../status_quote';
import RelativeTimestamp from '../relative_timestamp';
import DisplayName from '../display_name';
import StatusContent from '../status_content';
import StatusActionBar from '../status_action_bar';
import Block from '../block';
import Icon from '../icon';
import Poll from '../poll';
import StatusHeader from '../status_header'
import Text from '../text'

// We use the component (and not the container) since we do not want
// to use the progress bar to show download progress
import Bundle from '../../features/ui/util/bundle';

const cx = classNames.bind(_s)

export const textForScreenReader = (intl, status, rebloggedByText = false) => {
  const displayName = status.getIn(['account', 'display_name']);

  const values = [
    displayName.length === 0 ? status.getIn(['account', 'acct']).split('@')[0] : displayName,
    status.get('spoiler_text') && status.get('hidden')
      ? status.get('spoiler_text')
      : status.get('search_index').slice(status.get('spoiler_text').length),
    intl.formatDate(status.get('created_at'), { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    status.getIn(['account', 'acct']),
  ];

  if (rebloggedByText) {
    values.push(rebloggedByText);
  }

  return values.join(', ');
};

export const defaultMediaVisibility = status => {
  if (!status) return undefined;

  if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
    status = status.get('reblog');
  }

  return (displayMedia !== 'hide_all' && !status.get('sensitive')) || displayMedia === 'show_all';
};

const messages = defineMessages({
  filtered: { id: 'status.filtered', defaultMessage: 'Filtered' },
  promoted: { id:'status.promoted', defaultMessage: 'Promoted gab' },
  pinned: { id: 'status.pinned', defaultMessage: 'Pinned gab' },
})

export default
@injectIntl
class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
    onClick: PropTypes.func,
    onReply: PropTypes.func,
    onShowRevisions: PropTypes.func,
    onQuote: PropTypes.func,
    onFavorite: PropTypes.func,
    onRepost: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onDirect: PropTypes.func,
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
    unread: PropTypes.bool,
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
  };

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = ['status', 'account', 'muted', 'hidden'];

  state = {
    showMedia: defaultMediaVisibility(this.props.status),
    statusId: undefined,
  };

  // Track height changes we know about to compensate scrolling
  componentDidMount() {
    this.didShowCard = !this.props.muted && !this.props.hidden && this.props.status && this.props.status.get('card');
  }

  getSnapshotBeforeUpdate() {
    if (this.props.getScrollPosition) {
      return this.props.getScrollPosition();
    }

    return null;
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
    this.props.onMoveUp(this.props.status.get('id'), e.target.getAttribute('data-featured'));
  };

  handleHotkeyMoveDown = e => {
    this.props.onMoveDown(this.props.status.get('id'), e.target.getAttribute('data-featured'));
  };

  handleHotkeyToggleHidden = () => {
    this.props.onToggleHidden(this._properStatus());
  };

  handleHotkeyToggleSensitive = () => {
    this.handleToggleMediaVisibility();
  };

  _properStatus() {
    const { status } = this.props;

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      return status.get('reblog');
    }

    return status;
  }

  handleRef = c => {
    this.node = c;
  };


  handleOpenProUpgradeModal = () => {
    this.props.onOpenProUpgradeModal();
  }

  render() {
    const {
      intl,
      hidden,
      featured,
      unread,
      showThread,
      group,
      promoted
    } = this.props

    let media = null
    let prepend, rebloggedByText, reblogContent

    // console.log("replies:", this.props.replies)

    let { status, account, ...other } = this.props;

    if (status === null) return null;

    if (hidden) {
      return (
        <div ref={this.handleRef}>
          {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
          {status.get('content')}
        </div>
      );
    }

    if (status.get('filtered') || status.getIn(['reblog', 'filtered'])) {
      const minHandlers = this.props.muted
        ? {}
        : {
          moveUp: this.handleHotkeyMoveUp,
          moveDown: this.handleHotkeyMoveDown,
        };

      return (
        <HotKeys handlers={minHandlers}>
          <div className='status__wrapper status__wrapper--filtered focusable' tabIndex='0' ref={this.handleRef}>
            <Text>{intl.formatMessage(messages.filtered)}</Text>
          </div>
        </HotKeys>
      );
    }

    if (promoted) {
      prepend = (
        <button className='status__prepend status__prepend--promoted' onClick={this.handleOpenProUpgradeModal}>
          <div className='status__prepend-icon-wrapper'>
            <Icon id='star' className='status__prepend-icon' fixedWidth />
          </div>
          <Text>{intl.formatMessage(messages.promoted)}</Text>
        </button>
      );
    } else if (featured) {
      prepend = (
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.paddingVertical5PX, _s.paddingHorizontal15PX].join(' ')}>
          <Icon
            id='pin'
            width='10px'
            height='10px'
            className={_s.fillColorSecondary}
          />
          <Text size='small' color='secondary' className={_s.marginLeft5PX}>
            {intl.formatMessage(messages.pinned)}
          </Text>
        </div>
      );
    } else if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      const display_name_html = { __html: status.getIn(['account', 'display_name_html']) };

      prepend = (
        <div className='status__prepend'>
          <div className='status__prepend-icon-wrapper'>
            <Icon id='retweet' className='status__prepend-icon' fixedWidth />
          </div>
          {/*<FormattedMessage
            id='status.reposted_by'
            defaultMessage='{name} reposted'
            values={{
              name: (
                <NavLink to={`/${status.getIn(['account', 'acct'])}`} className='status__display-name muted'>
                  <bdi>
                    <strong dangerouslySetInnerHTML={display_name_html} />
                  </bdi>
                </NavLink>
              ),
            }}
          /> */ }
        </div>
      );

      rebloggedByText = intl.formatMessage(
        { id: 'status.reposted_by', defaultMessage: '{name} reposted' },
        { name: status.getIn(['account', 'acct']) }
      );

      account = status.get('account');
      reblogContent = status.get('contentHtml');
      status = status.get('reblog');
    }

    if (status.get('poll')) {
      media = <Poll pollId={status.get('poll')} />
    } else if (status.get('media_attachments').size > 0) {
      if (status.getIn(['media_attachments', 0, 'type']) === 'video') {
        const video = status.getIn(['media_attachments', 0]);

        console.log("VIDEO HERE")

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
      // console.log("card:", status.get('card'))
      media = (
        <Card
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

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`;

    const containerClasses = cx({
      default: 1,
      marginBottom15PX: 1,
      paddingBottom15PX: featured,
      borderBottom1PX: featured,
      borderColorSecondary: featured,
    })

    return (
      <HotKeys handlers={handlers}>
        <div
          className={containerClasses}
          tabIndex={this.props.muted ? null : 0}
          data-featured={featured ? 'true' : null}
          aria-label={textForScreenReader(intl, status, rebloggedByText)}
          ref={this.handleRef}
        >
          <Block>

            {prepend}

            <div data-id={status.get('id')}>

              <StatusHeader status={status} />

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

              { /* status.get('quote') && <StatusQuote
              id={status.get('quote')}
            /> */ }

              { /* showThread && status.get('in_reply_to_id') && status.get('in_reply_to_account_id') === status.getIn(['account', 'id']) && (
              <button className='status__content__read-more-button' onClick={this.handleClick}>
                <FormattedMessage id='status.show_thread' defaultMessage='Show thread' />
              </button>
            ) */ }

              <StatusActionBar status={status} account={account} {...other} />
              {/*<div className={[_s.default, _s.borderTop1PX, _s.borderColorSecondary, _s.paddingTop10PX, _s.paddingHorizontal15PX, _s.marginBottom10PX].join(' ')}>
                <ComposeFormContainer statusId={status.get('id')} shouldCondense />
          </div>*/}
            </div>
          </Block>
        </div>
      </HotKeys>
    );
  }

}
