import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { expandAccountMediaTimeline } from '../actions/timelines'
import { getAccountGallery } from '../selectors'
import ColumnIndicator from '../components/column_indicator'
import MediaItem from '../components/media_item'
import LoadMore from '../components/load_more'
import Block from '../components/block'
import MediaGalleryPlaceholder from '../components/placeholder/media_gallery_placeholder'

class AccountAlbums extends ImmutablePureComponent {

  componentDidMount() {
    const { accountId, mediaType } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(expandAccountMediaTimeline(accountId, { mediaType }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.accountId && nextProps.accountId !== this.props.accountId) ||
      (nextProps.accountId && nextProps.mediaType !== this.props.mediaType)
    ) {
      this.props.dispatch(expandAccountMediaTimeline(nextProps.accountId, {
        mediaType: nextProps.mediaType,
      }))
    }
  }

  handleScrollToBottom = () => {
    if (this.props.hasMore) {
      this.handleLoadMore(this.props.attachments.size > 0 ? this.props.attachments.last().getIn(['status', 'id']) : undefined)
    }
  }

  handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const offset = scrollHeight - scrollTop - clientHeight

    if (150 > offset && !this.props.isLoading) {
      this.handleScrollToBottom()
    }
  }

  handleLoadMore = (maxId) => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandAccountMediaTimeline(this.props.accountId, {
        maxId,
        mediaType: this.props.mediaType,
      }))
    }
  }

  handleLoadOlder = (e) => {
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
          className={[_s.d, _s.flexRow, _s.flexWrap, _s.py5, _s.px5].join(' ')}
        >

          {
            attachments.map((attachment, i) => (
              <MediaItem
                key={attachment.get('id')}
                attachment={attachment}
                account={account}
              />
            ))
          }

          {
            isLoading && attachments.size === 0 &&
            <div className={[_s.d, _s.w100PC].join(' ')}>
              <MediaGalleryPlaceholder />
            </div>
          }

          {
            !isLoading && attachments.size === 0 &&
            <ColumnIndicator type='error' message={intl.formatMessage(messages.none)} />
          }
        </div>

        {
          hasMore && !(isLoading && attachments.size === 0) &&
          <LoadMore visible={!isLoading} onClick={this.handleLoadOlder} />
        }
      </Block>
    )
  }

}

const messages = defineMessages({
  none: { id: 'account_gallery.none', defaultMessage: 'No media to show.' },
})

const mapStateToProps = (state, { account, mediaType }) => {
  const accountId =  !!account ? account.get('id') : -1

  return {
    accountId,
    attachments: getAccountGallery(state, accountId, mediaType),
    isLoading: state.getIn(['timelines', `account:${accountId}:media`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${accountId}:media`, 'hasMore']),
  }
}

const mapDispatchToProps = (dispatch) => ({

})

AccountAlbums.propTypes = {
  dispatch: PropTypes.func.isRequired,
  account: ImmutablePropTypes.map,
  accountId: PropTypes.string,
  attachments: ImmutablePropTypes.list.isRequired,
  isLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  mediaType: PropTypes.oneOf([
    'photo',
    'video',
  ]),
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AccountAlbums))