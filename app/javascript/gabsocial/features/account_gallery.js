import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { expandAccountMediaTimeline } from '../actions/timelines'
import { getAccountGallery } from '../selectors'
import ColumnIndicator from '../components/column_indicator'
import MediaItem from '../components/media_item'
import LoadMore from '../components/load_more'
import Block from '../components/block'

const messages = defineMessages({
  none: { id: 'account_gallery.none', defaultMessage: 'No media to show.' },
})

const mapStateToProps = (state, { account }) => {
  const accountId =  !!account ? account.get('id') : -1

  return {
    accountId,
    attachments: getAccountGallery(state, accountId),
    isLoading: state.getIn(['timelines', `account:${accountId}:media`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${accountId}:media`, 'hasMore']),
  }
}

export default
@connect(mapStateToProps)
@injectIntl
class AccountGallery extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    account: ImmutablePropTypes.map,
    accountId: PropTypes.string,
    attachments: ImmutablePropTypes.list.isRequired,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { accountId } = this.props

    if (accountId) {
      this.props.dispatch(expandAccountMediaTimeline(accountId))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== this.props.accountId) {
      this.props.dispatch(expandAccountMediaTimeline(nextProps.accountId))
    }
  }

  handleScrollToBottom = () => {
    if (this.props.hasMore) {
      this.handleLoadMore(this.props.attachments.size > 0 ? this.props.attachments.last().getIn(['status', 'id']) : undefined)
    }
  }

  handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const offset = scrollHeight - scrollTop - clientHeight

    if (150 > offset && !this.props.isLoading) {
      this.handleScrollToBottom()
    }
  }

  handleLoadMore = maxId => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandAccountMediaTimeline(this.props.accountId, { maxId }))
    }
  }

  handleLoadOlder = e => {
    e.preventDefault()
    this.handleScrollToBottom()
  }

  render() {
    const {
      attachments,
      isLoading,
      hasMore,
      intl,
      account,
    } = this.props

    if (!account) return null

    return (
      <Block>
        <div
          role='feed'
          onScroll={this.handleScroll}
          className={[_s.default, _s.flexRow, _s.flexWrap, _s.heightMin50VH, _s.py5, _s.px5].join(' ')}
        >

          {
            attachments.map((attachment) => (
              <MediaItem key={attachment.get('id')} attachment={attachment} />
            ))
          }

          {
            isLoading && attachments.size === 0 &&
            <ColumnIndicator type='loading' />
          }

          { /*
            attachments.size === 0 &&
            <ColumnIndicator type='empty' message={intl.formatMessage(messages.none)} />
          */ }

          {
            hasMore && !(isLoading && attachments.size === 0) &&
            <LoadMore visible={!isLoading} onClick={this.handleLoadOlder} />
          }
        </div>
      </Block>
    )
  }

}
