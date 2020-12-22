import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import {
  fetchAlbums,
  expandAlbums,
} from '../actions/albums'
import ColumnIndicator from '../components/column_indicator'
import Heading from '../components/heading'
import TabBar from '../components/tab_bar'
import LoadMore from '../components/load_more'
import Block from '../components/block'
import Album from '../components/album'
import Dummy from '../components/dummy'
import MediaGalleryPlaceholder from '../components/placeholder/media_gallery_placeholder'

class AccountAlbums extends ImmutablePureComponent {

  componentDidMount() {
    const { accountId, mediaType } = this.props

    if (accountId && accountId !== -1) {
      this.props.onFetchAccountAlbums(accountId)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== this.props.accountId) {
      this.props.onFetchAccountAlbums(nextProps.accountId)
    }
  }

  handleLoadMore = () => {
    const { accountId, hasMore } = this.props
    if (accountId && accountId !== -1 && hasMore) {
      this.props.onExpandAccountAlbums(accountId)
    }
  }

  handleLoadOlder = (e) => {
    e.preventDefault()
    this.handleLoadMore()
  }

  render() {
    const {
      isMe,
      albumIds,
      account,
      accountId,
      hasMore,
      isLoading,
    } = this.props
      
    if (!account) return null
    const hasAlbums = !!albumIds ? albumIds.size > 0 : false

    console.log("albumIds:", albumIds)

    return (
      <Block>
        <div className={[_s.d, _s.px10, _s.py10].join(' ')}>
          <div className={[_s.d, _s.px5, _s.py5, _s.mb10].join(' ')}>
            <Heading size='h2'>Photos</Heading>
          </div>
          <TabBar tabs={[
            {
              title: 'All Photos',
              to: `/${account.get('username')}/photos`,
            },
            // {
            //   title: 'Albums',
            //   isActive: true,
            //   to: `/${account.get('username')}/albums`,
            // },
          ]}/>
        </div>

        <div className={[_s.d, _s.w100PC, _s.flexRow, _s.flexWrap, _s.px10, _s.mb15, _s.pb10].join(' ')}>
          { isMe && <Album isAddable /> }

          {
            hasAlbums &&
            albumIds.map((albumId, i) => (
              <Album
                key={albumId}
                albumId={albumId}
                account={account}
              />
            ))
          }

          {
            Array.apply(null, { length: 8}).map((_, i) => (
              <Dummy className={[_s.d, _s.minW162PX, _s.px5, _s.flex1].join(' ')} />
            ))
          }
   
          {
            !isLoading && !hasAlbums && me !== accountId &&
            <ColumnIndicator type='error' message='No albums exist' />
          }
        </div>

          {
            hasMore && !(isLoading && !hasAlbums) &&
            <LoadMore visible={!isLoading} onClick={this.handleLoadOlder} />
          }
      </Block>
    )
    
  }

}

const mapStateToProps = (state, { account, mediaType }) => {
  const accountId =  !!account ? account.get('id') : -1

  return {
    accountId,
    albumIds: state.getIn(['album_lists', accountId, 'items']),
    isLoading: state.getIn(['album_lists', accountId, 'isLoading'], false),
    hasMore: state.getIn(['album_lists', accountId, 'hasMore'], false),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onFetchAccountAlbums(accountId) {
    dispatch(fetchAlbums(accountId))
  },
  onExpandAccountAlbums(accountId) {
    dispatch(expandAlbums(accountId))
  },
})

AccountAlbums.propTypes = {
  account: ImmutablePropTypes.map,
  accountId: PropTypes.string,
  albumIds: ImmutablePropTypes.list,
  isLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  intl: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountAlbums)