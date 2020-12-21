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
import Dummy from '../components/dummy'
import LoadMore from '../components/load_more'
import Block from '../components/block'
import Heading from '../components/heading'
import TabBar from '../components/tab_bar'
import MediaGalleryPlaceholder from '../components/placeholder/media_gallery_placeholder'

class AccountVideoGallery extends ImmutablePureComponent {

  componentDidMount() {
    const { accountId } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(expandAccountMediaTimeline(accountId, { mediaType: 'video' }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== this.props.accountId) {
      this.props.dispatch(expandAccountMediaTimeline(nextProps.accountId, {
        mediaType: 'video',
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
        mediaType: 'video',
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

    const hasAttachments = !!attachments ? attachments.size > 0 : false

    return (
      <Block>
        <div className={[_s.d, _s.px10, _s.py10].join(' ')}>
          <div className={[_s.d, _s.px5, _s.py5, _s.mb10].join(' ')}>
            <Heading size='h2'>Videos</Heading>
          </div>
          <TabBar tabs={[
            {
              title: 'All Videos',
              to: `/${account.get('username')}/videos`,
            },
          ]}/>
        </div>

        <div
          role='feed'
          onScroll={this.handleScroll}
          className={[_s.d, _s.w100PC, _s.flexRow, _s.flexWrap, _s.px10, _s.mb15, _s.pb10].join(' ')}
        >

          {
            hasAttachments &&
            <React.Fragment>
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
                Array.apply(null, { length: 8 }).map((_, i) => (
                  <Dummy className={[_s.d, _s.minW232PX, _s.px5, _s.flex1].join(' ')} />
                ))
              }
            </React.Fragment>
          }

          {
            isLoading && !hasAttachments &&
            <div className={[_s.d, _s.w100PC].join(' ')}>
              <MediaGalleryPlaceholder />
            </div>
          }

          {
            !isLoading && !hasAttachments &&
            <ColumnIndicator type='error' message={intl.formatMessage(messages.none)} />
          }
        </div>

        {
          hasMore && !(isLoading && !hasAttachments) &&
          <LoadMore visible={!isLoading} onClick={this.handleLoadOlder} />
        }
      </Block>
    )
  }

}

const messages = defineMessages({
  none: { id: 'account_gallery.none', defaultMessage: 'No media to show.' },
})

const mapStateToProps = (state, { account }) => {
  const accountId =  !!account ? account.get('id') : -1

  return {
    accountId,
    attachments: getAccountGallery(state, accountId, 'video'),
    isLoading: state.getIn(['timelines', `account:${accountId}:media`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${accountId}:media`, 'hasMore']),
  }
}

AccountVideoGallery.propTypes = {
  dispatch: PropTypes.func.isRequired,
  account: ImmutablePropTypes.map,
  accountId: PropTypes.string,
  attachments: ImmutablePropTypes.list.isRequired,
  isLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(connect(mapStateToProps)(AccountVideoGallery))