import Immutable from 'immutable';
import classNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { HotKeys } from 'react-hotkeys';
import { fetchStatus } from '../../actions/statuses';
import {
  favorite,
  unfavorite,
  reblog,
  unreblog,
  pin,
  unpin,
} from '../../actions/interactions';
import {
  replyCompose,
  mentionCompose,
  directCompose,
} from '../../actions/compose';
import { blockAccount } from '../../actions/accounts';
import {
  muteStatus,
  unmuteStatus,
  deleteStatus,
  hideStatus,
  revealStatus,
} from '../../actions/statuses';
import { initMuteModal } from '../../actions/mutes';
import { initReport } from '../../actions/reports';
import { openModal } from '../../actions/modal';
import { boostModal, deleteModal, me } from '../../initial_state';
import { makeGetStatus } from '../../selectors';
import { attachFullscreenListener, detachFullscreenListener, isFullscreen } from '../../utils/fullscreen';
import StatusContainer from '../../containers/status_container';
import { ColumnHeader } from '../../components/column_header';
import { textForScreenReader, defaultMediaVisibility } from '../../components/status/status';
import Icon from '../../components/icon';
import ColumnIndicator from '../../components/column_indicator';

const messages = defineMessages({
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this status?' },
  redraftConfirm: { id: 'confirmations.redraft.confirm', defaultMessage: 'Delete & redraft' },
  redraftMessage: { id: 'confirmations.redraft.message', defaultMessage: 'Are you sure you want to delete this status and re-draft it? Favorites and reposts will be lost, and replies to the original post will be orphaned.' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  revealAll: { id: 'status.show_more_all', defaultMessage: 'Show more for all' },
  hideAll: { id: 'status.show_less_all', defaultMessage: 'Show less for all' },
  detailedStatus: { id: 'status.detailed_status', defaultMessage: 'Detailed conversation view' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
});

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => {
    const status = getStatus(state, {
      id: props.params.statusId,
      username: props.params.username,
    });

    let ancestorsIds = Immutable.List();
    let descendantsIds = Immutable.List();

    if (status) {
      ancestorsIds = ancestorsIds.withMutations(mutable => {
        let id = status.get('in_reply_to_id');

        while (id) {
          mutable.unshift(id);
          id = state.getIn(['contexts', 'inReplyTos', id]);
        }
      });

      descendantsIds = descendantsIds.withMutations(mutable => {
        const ids = [status.get('id')];

        while (ids.length > 0) {
          let id = ids.shift();
          const replies = state.getIn(['contexts', 'replies', id]);

          if (status.get('id') !== id) {
            mutable.push(id);
          }

          if (replies) {
            replies.reverse().forEach(reply => {
              ids.unshift(reply);
            });
          }
        }
      });
    }

    return {
      status,
      ancestorsIds,
      descendantsIds,
      askReplyConfirmation: state.getIn(['compose', 'text']).trim().length !== 0,
      domain: state.getIn(['meta', 'domain']),
    };
  };

  return mapStateToProps;
};

export default
@injectIntl
@connect(makeMapStateToProps)
class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    status: ImmutablePropTypes.map,
    ancestorsIds: ImmutablePropTypes.list,
    descendantsIds: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
    askReplyConfirmation: PropTypes.bool,
    domain: PropTypes.string.isRequired,
  };

  state = {
    fullscreen: false,
    showMedia: defaultMediaVisibility(this.props.status),
    loadedStatusId: undefined,
  };

  componentWillMount() {
    this.props.dispatch(fetchStatus(this.props.params.statusId));
  }

  componentDidMount() {
    attachFullscreenListener(this.onFullScreenChange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.statusId !== this.props.params.statusId && nextProps.params.statusId) {
      this._scrolledIntoView = false;
      this.props.dispatch(fetchStatus(nextProps.params.statusId));
    }

    if (nextProps.status && nextProps.status.get('id') !== this.state.loadedStatusId) {
      this.setState({ showMedia: defaultMediaVisibility(nextProps.status), loadedStatusId: nextProps.status.get('id') });
    }
  }

  handleToggleMediaVisibility = () => {
    this.setState({ showMedia: !this.state.showMedia });
  }

  handleFavoriteClick = (status) => {
    if (status.get('favourited')) {
      this.props.dispatch(unfavorite(status));
    } else {
      this.props.dispatch(favorite(status));
    }
  }

  handlePin = (status) => {
    if (status.get('pinned')) {
      this.props.dispatch(unpin(status));
    } else {
      this.props.dispatch(pin(status));
    }
  }

  handleReplyClick = (status) => {
    let { askReplyConfirmation, dispatch, intl } = this.props;
    if (askReplyConfirmation) {
      dispatch(openModal('CONFIRM', {
        message: intl.formatMessage(messages.replyMessage),
        confirm: intl.formatMessage(messages.replyConfirm),
        onConfirm: () => dispatch(replyCompose(status, this.context.router.history)),
      }));
    } else {
      dispatch(replyCompose(status, this.context.router.history));
    }
  }

  handleModalRepost = (status) => {
    this.props.dispatch(repost(status));
  }

  handleRepostClick = (status, e) => {
    if (status.get('reblogged')) {
      this.props.dispatch(unrepost(status));
    } else {
      if ((e && e.shiftKey) || !boostModal) {
        this.handleModalRepost(status);
      } else {
        this.props.dispatch(openModal('BOOST', { status, onRepost: this.handleModalRepost }));
      }
    }
  }

  handleDeleteClick = (status, history, withRedraft = false) => {
    const { dispatch, intl } = this.props;

    if (!deleteModal) {
      dispatch(deleteStatus(status.get('id'), history, withRedraft));
    } else {
      dispatch(openModal('CONFIRM', {
        message: intl.formatMessage(withRedraft ? messages.redraftMessage : messages.deleteMessage),
        confirm: intl.formatMessage(withRedraft ? messages.redraftConfirm : messages.deleteConfirm),
        onConfirm: () => dispatch(deleteStatus(status.get('id'), history, withRedraft)),
      }));
    }
  }

  handleDirectClick = (account, router) => {
    this.props.dispatch(directCompose(account, router));
  }

  handleMentionClick = (account, router) => {
    this.props.dispatch(mentionCompose(account, router));
  }

  handleOpenMedia = (media, index) => {
    this.props.dispatch(openModal('MEDIA', { media, index }));
  }

  handleOpenVideo = (media, time) => {
    this.props.dispatch(openModal('VIDEO', { media, time }));
  }

  handleMuteClick = (account) => {
    this.props.dispatch(initMuteModal(account));
  }

  handleConversationMuteClick = (status) => {
    if (status.get('muted')) {
      this.props.dispatch(unmuteStatus(status.get('id')));
    } else {
      this.props.dispatch(muteStatus(status.get('id')));
    }
  }

  handleToggleHidden = (status) => {
    if (status.get('hidden')) {
      this.props.dispatch(revealStatus(status.get('id')));
    } else {
      this.props.dispatch(hideStatus(status.get('id')));
    }
  }

  handleToggleAll = () => {
    const { status, ancestorsIds, descendantsIds } = this.props;
    const statusIds = [status.get('id')].concat(ancestorsIds.toJS(), descendantsIds.toJS());

    if (status.get('hidden')) {
      this.props.dispatch(revealStatus(statusIds));
    } else {
      this.props.dispatch(hideStatus(statusIds));
    }
  }

  handleBlockClick = (status) => {
    const { dispatch, intl } = this.props;
    const account = status.get('account');

    dispatch(openModal('CONFIRM', {
      message: <FormattedMessage id='confirmations.block.message' defaultMessage='Are you sure you want to block {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
      confirm: intl.formatMessage(messages.blockConfirm),
      onConfirm: () => dispatch(blockAccount(account.get('id'))),
      secondary: intl.formatMessage(messages.blockAndReport),
      onSecondary: () => {
        dispatch(blockAccount(account.get('id')));
        dispatch(initReport(account, status));
      },
    }));
  }

  handleReport = (status) => {
    this.props.dispatch(initReport(status.get('account'), status));
  }

  handleEmbed = (status) => {
    this.props.dispatch(openModal('EMBED', { url: status.get('url') }));
  }

  handleHotkeyMoveUp = () => {
    this.handleMoveUp(this.props.status.get('id'));
  }

  handleHotkeyMoveDown = () => {
    this.handleMoveDown(this.props.status.get('id'));
  }

  handleHotkeyReply = e => {
    e.preventDefault();
    this.handleReplyClick(this.props.status);
  }

  handleHotkeyFavorite = () => {
    this.handleFavoriteClick(this.props.status);
  }

  handleHotkeyBoost = () => {
    this.handleRepostClick(this.props.status);
  }

  handleHotkeyMention = e => {
    e.preventDefault();
    this.handleMentionClick(this.props.status.get('account'));
  }

  handleHotkeyOpenProfile = () => {
    this.context.router.history.push(`/${this.props.status.getIn(['account', 'acct'])}`);
  }

  handleHotkeyToggleHidden = () => {
    this.handleToggleHidden(this.props.status);
  }

  handleHotkeyToggleSensitive = () => {
    this.handleToggleMediaVisibility();
  }

  handleMoveUp = id => {
    const { status, ancestorsIds, descendantsIds } = this.props;

    if (id === status.get('id')) {
      this._selectChild(ancestorsIds.size - 1, true);
    } else {
      let index = ancestorsIds.indexOf(id);

      if (index === -1) {
        index = descendantsIds.indexOf(id);
        this._selectChild(ancestorsIds.size + index, true);
      } else {
        this._selectChild(index - 1, true);
      }
    }
  }

  handleMoveDown = id => {
    const { status, ancestorsIds, descendantsIds } = this.props;

    if (id === status.get('id')) {
      this._selectChild(ancestorsIds.size + 1, false);
    } else {
      let index = ancestorsIds.indexOf(id);

      if (index === -1) {
        index = descendantsIds.indexOf(id);
        this._selectChild(ancestorsIds.size + index + 2, false);
      } else {
        this._selectChild(index + 1, false);
      }
    }
  }

  _selectChild(index, align_top) {
    const container = this.node;
    const element = container.querySelectorAll('.focusable')[index];

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true);
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false);
      }
      element.focus();
    }
  }

  renderChildren(list) {
    // : todo : comments
    return list.map(id => (
      <StatusContainer
        key={id}
        id={id}
        onMoveUp={this.handleMoveUp}
        onMoveDown={this.handleMoveDown}
        contextType='thread'
      />
    ));
  }

  setRef = c => {
    this.node = c;
  }

  componentDidUpdate() {
    if (this._scrolledIntoView) {
      return;
    }

    const { status, ancestorsIds } = this.props;

    if (status && ancestorsIds && ancestorsIds.size > 0) {
      const element = this.node.querySelectorAll('.focusable')[ancestorsIds.size - 1];

      window.requestAnimationFrame(() => {
        element.scrollIntoView(true);
      });
      this._scrolledIntoView = true;
    }
  }

  componentWillUnmount() {
    detachFullscreenListener(this.onFullScreenChange);
  }

  onFullScreenChange = () => {
    this.setState({ fullscreen: isFullscreen() });
  }

  render() {
    let ancestors, descendants;
    const { status, ancestorsIds, descendantsIds, intl, domain } = this.props;

    if (status === null) {
      return (<ColumnIndicator type='loading' />);
    }

    if (ancestorsIds && ancestorsIds.size > 0) {
      ancestors = <div>{this.renderChildren(ancestorsIds)}</div>;
    }

    if (descendantsIds && descendantsIds.size > 0) {
      descendants = <div>{this.renderChildren(descendantsIds)}</div>;
    }

    const handlers = {
      moveUp: this.handleHotkeyMoveUp,
      moveDown: this.handleHotkeyMoveDown,
      reply: this.handleHotkeyReply,
      favorite: this.handleHotkeyFavorite,
      boost: this.handleHotkeyBoost,
      mention: this.handleHotkeyMention,
      openProfile: this.handleHotkeyOpenProfile,
      toggleHidden: this.handleHotkeyToggleHidden,
      toggleSensitive: this.handleHotkeyToggleSensitive,
    };

    /* me &&
      <ColumnHeader
        extraButton={(
          <button
            className='column-header__button'
            title={intl.formatMessage(status.get('hidden') ? messages.revealAll : messages.hideAll)}
            aria-label={intl.formatMessage(status.get('hidden') ? messages.revealAll : messages.hideAll)}
            onClick={this.handleToggleAll}
            aria-pressed={
              status.get('hidden') ? 'false' : 'true'}
          >
            <Icon id={status.get('hidden') ? 'eye-slash' : 'eye'
            }
            />
          </button>
        )}
      />
    */

    return (
      <div ref={this.setRef}>
        {ancestors}

        <HotKeys handlers={handlers}>
          <div className={_s.outlineNone} tabIndex='0' aria-label={textForScreenReader(intl, status, false)}>
            { /* <DetailedStatus
              status={status}
              onOpenVideo={this.handleOpenVideo}
              onOpenMedia={this.handleOpenMedia}
              onToggleHidden={this.handleToggleHidden}
              domain={domain}
              showMedia={this.state.showMedia}
              onToggleMediaVisibility={this.handleToggleMediaVisibility}
            /> */ }

            <StatusContainer
              id={status.get('id')}
              contextType={'timelineId'}
              showThread
            />

            {/*<ActionBar
              status={status}
              onReply={this.handleReplyClick}
              onFavorite={this.handleFavoriteClick}
              onRepost={this.handleRepostClick}
              onDelete={this.handleDeleteClick}
              onDirect={this.handleDirectClick}
              onMention={this.handleMentionClick}
              onMute={this.handleMuteClick}
              onMuteConversation={this.handleConversationMuteClick}
              onBlock={this.handleBlockClick}
              onReport={this.handleReport}
              onPin={this.handlePin}
              onEmbed={this.handleEmbed}
            />*/}
          </div>
        </HotKeys>

        {descendants}
      </div>
    );
  }

}
