import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import {
  fetchAccount,
  fetchAccountByUsername,
} from '../../actions/accounts';
import { openModal } from '../../actions/modal';
import { expandAccountMediaTimeline } from '../../actions/timelines';
import { me } from '../../initial_state';
import { getAccountGallery } from '../../selectors';
import ColumnIndicator from '../../components/column_indicator';
import MediaItem from './components/media_item';
import LoadMore from '../../components/load_more';

const messages = defineMessages({
  posts: { id: 'account.posts', defaultMessage: 'Gabs' },
  postsWithReplies: { id: 'account.posts_with_replies', defaultMessage: 'Gabs and replies' },
  media: { id: 'account.media', defaultMessage: 'Media' },
  error: { id: 'empty_column.account_unavailable', defaultMessage: 'Profile unavailable' },
});

const mapStateToProps = (state, { mediaType, params: { username } }) => {
  const accounts = state.getIn(['accounts']);
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() == username.toLowerCase());

  let accountId = -1;
  let accountUsername = username;
  if (accountFetchError) {
    accountId = null;
  } else {
    let account = accounts.find(acct => username.toLowerCase() == acct.getIn(['acct'], '').toLowerCase());
    accountId = account ? account.getIn(['id'], null) : -1;
    accountUsername = account ? account.getIn(['acct'], '') : '';
  }

  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
  const isLocked = state.getIn(['accounts', accountId, 'locked'], false);
  const isFollowing = state.getIn(['relationships', accountId, 'following'], false);
  const unavailable = (me === accountId) ? false : (isBlocked || (isLocked && !isFollowing));

  return {
    accountId,
    unavailable,
    accountUsername,
    isAccount: !!state.getIn(['accounts', accountId]),
    attachments: getAccountGallery(state, accountId),
    isLoading: state.getIn(['timelines', `account:${accountId}:media`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${accountId}:media`, 'hasMore']),
  };
};

class LoadMoreMedia extends ImmutablePureComponent {

  static propTypes = {
    maxId: PropTypes.string,
    onLoadMore: PropTypes.func.isRequired,
  };

  handleLoadMore = () => {
    this.props.onLoadMore(this.props.maxId);
  }

  render() {
    return (
      <LoadMore
        disabled={this.props.disabled}
        onClick={this.handleLoadMore}
      />
    )
  }

}

export default
@connect(mapStateToProps)
@injectIntl
class AccountGallery extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    attachments: ImmutablePropTypes.list.isRequired,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    isAccount: PropTypes.bool,
    unavailable: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }

  state = {
    width: 323,
  }

  componentDidMount() {
    const { params: { username }, accountId } = this.props;

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchAccount(accountId));
      this.props.dispatch(expandAccountMediaTimeline(accountId));
    } else {
      this.props.dispatch(fetchAccountByUsername(username));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== -1 && (nextProps.accountId !== this.props.accountId && nextProps.accountId)) {
      this.props.dispatch(fetchAccount(nextProps.params.accountId));
      this.props.dispatch(expandAccountMediaTimeline(nextProps.accountId));
    }
  }

  handleScrollToBottom = () => {
    if (this.props.hasMore) {
      this.handleLoadMore(this.props.attachments.size > 0 ? this.props.attachments.last().getIn(['status', 'id']) : undefined);
    }
  }

  handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const offset = scrollHeight - scrollTop - clientHeight;

    if (150 > offset && !this.props.isLoading) {
      this.handleScrollToBottom();
    }
  }

  handleLoadMore = maxId => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandAccountMediaTimeline(this.props.accountId, { maxId }));
    }
  };

  handleLoadOlder = e => {
    e.preventDefault();
    this.handleScrollToBottom();
  }

  handleOpenMedia = attachment => {
    if (attachment.get('type') === 'video') {
      this.props.dispatch(openModal('VIDEO', { media: attachment, status: attachment.get('status') }));
    } else {
      const media = attachment.getIn(['status', 'media_attachments']);
      const index = media.findIndex(x => x.get('id') === attachment.get('id'));

      this.props.dispatch(openModal('MEDIA', { media, index, status: attachment.get('status') }));
    }
  }

  handleRef = c => {
    if (c) {
      this.setState({ width: c.offsetWidth });
    }
  }

  render() {
    const { attachments, isLoading, hasMore, isAccount, accountId, unavailable, accountUsername, intl } = this.props;
    const { width } = this.state;

    if (!isAccount && accountId !== -1) {
      return <ColumnIndicator type='missing' />
    } else if (accountId === -1 || (!attachments && isLoading)) {
      return <ColumnIndicator type='loading' />
    } else if (unavailable) {
      return <ColumnIndicator type='error' message={intl.formatMessage(messages.error)} />
    }

    let loadOlder = null

    if (hasMore && !(isLoading && attachments.size === 0)) {
      loadOlder = <LoadMore visible={!isLoading} onClick={this.handleLoadOlder} />
    }

    return (
      <div className='scrollable-list scrollable-list--flex' onScroll={this.handleScroll}>
        <div role='feed' className='account-gallery__container' ref={this.handleRef}>
          {
            attachments.map((attachment, index) => attachment === null ? (
              <LoadMoreMedia key={'more:' + attachments.getIn(index + 1, 'id')} maxId={index > 0 ? attachments.getIn(index - 1, 'id') : null} onLoadMore={this.handleLoadMore} />
            ) : (
              <MediaItem key={attachment.get('id')} attachment={attachment} displayWidth={width} onOpenMedia={this.handleOpenMedia} />
            ))
          }

          {
            attachments.size == 0 &&
            <div className='empty-column-indicator'>
              <FormattedMessage id='account_gallery.none' defaultMessage='No media to show.' />
            </div>
          }

          {loadOlder}
        </div>

        {
          isLoading && attachments.size === 0 &&
          <div className='slist__append'>
            <ColumnIndicator type='loading' />
          </div>
        }
      </div>
    );
  }

}
