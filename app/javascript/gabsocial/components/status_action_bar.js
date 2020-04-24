import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import Text from './text'
import StatusActionBarItem from './status_action_bar_item'

const messages = defineMessages({
  comment: { id: 'status.comment', defaultMessage: 'Comment' },
  share: { id: 'status.share', defaultMessage: 'Share' },
  repost: { id: 'status.repost', defaultMessage: 'Repost' },
  cannot_repost: { id: 'status.cannot_repost', defaultMessage: 'This post cannot be reposted' },
  like: { id: 'status.like', defaultMessage: 'Like' },
  likesLabel: { id: 'likes.label', defaultMessage: '{number, plural, one {# like} other {# likes}}' },
  repostsLabel: { id: 'reposts.label', defaultMessage: '{number, plural, one {# repost} other {# reposts}}' },
  commentsLabel: { id: 'comments.label', defaultMessage: '{number, plural, one {# comment} other {# comments}}' },
})

const cx = classNames.bind(_s)

export default
@injectIntl
class StatusActionBar extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onFavorite: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onReply: PropTypes.func.isRequired,
    onRepost: PropTypes.func.isRequired,
    status: ImmutablePropTypes.map.isRequired,
  }

  updateOnProps = ['status']

  handleReplyClick = () => {
    this.props.onReply(this.props.status)
  }

  handleFavoriteClick = () => {
    this.props.onFavorite(this.props.status)
  }

  handleRepostClick = (e) => {
    this.props.onRepost(this.repostButton, this.props.status, e)
  }

  handleShareClick = () => {
    this.props.onShare(this.shareButton, this.props.status)
  }

  openLikesList = () => {
    // : todo :
  }

  toggleCommentsVisible = () => {
    // : todo :
  }

  openRepostsList = () => {
    // : todo :
  }

  setRepostButton = (n) => {
    this.repostButton = n
  }

  setShareButton = (n) => {
    this.shareButton = n
  }

  render() {
    const { status, intl } = this.props

    const publicStatus = ['public', 'unlisted'].includes(status.get('visibility'))

    const replyCount = status.get('replies_count')
    const repostCount = status.get('reblogs_count')
    const favoriteCount = status.get('favourites_count')

    const hasInteractions = favoriteCount > 0 || replyCount > 0 || repostCount > 0
    const shouldCondense = (
      !!status.get('card') ||
      status.get('media_attachments').size > 0 ||
      !!status.get('quote')
    ) && !hasInteractions

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`

    const containerClasses = cx({
      default: 1,
      px10: 1,
      mt10: !shouldCondense,
      mt5: shouldCondense,
    })

    const innerContainerClasses = cx({
      default: 1,
      py2: 1,
      flexRow: 1,
      width100PC: 1,
      borderTop1PX: !shouldCondense,
      borderColorSecondary: !shouldCondense,
      mt5: hasInteractions,
    })

    const interactionBtnClasses = cx({
      default: 1,
      text: 1,
      cursorPointer: 1,
      fontWeightNormal: 1,
      noUnderline: 1,
      underline_onHover: 1,
      mr10: 1,
      py5: 1,
    })

    return (
      <div className={containerClasses}>
        {
          hasInteractions &&
          <div className={[_s.default, _s.flexRow, _s.alignItemsEnd, _s.px5].join(' ')}>
            {
              favoriteCount > 0 &&
              <button className={interactionBtnClasses} onClick={this.openLikesList}>
                <Text color='secondary' size='small'>
                  {intl.formatMessage(messages.likesLabel, {
                    number: favoriteCount,
                  })}
                </Text>
              </button>
            }
            {
              replyCount > 0 &&
              <NavLink
                className={interactionBtnClasses}
                to={statusUrl}
              >
                <Text color='secondary' size='small'>
                  {intl.formatMessage(messages.commentsLabel, {
                    number: replyCount,
                  })}
                </Text>
              </NavLink>
            }
            {
              repostCount > 0 &&
              <button className={interactionBtnClasses} onClick={this.openRepostsList}>
                <Text color='secondary' size='small'>
                  {intl.formatMessage(messages.repostsLabel, {
                    number: repostCount,
                  })}
                </Text>
              </button>
            }
          </div>
        }
        <div className={innerContainerClasses}>
          <div className={[_s.default, _s.flexRow, _s.py2, _s.width100PC].join(' ')}>
            <StatusActionBarItem
              title={intl.formatMessage(messages.like)}
              icon={!!status.get('favourited') ? 'liked' : 'like'}
              active={!!status.get('favourited')}
              onClick={this.handleFavoriteClick}
            />
            <StatusActionBarItem
              title={intl.formatMessage(messages.comment)}
              icon='comment'
              onClick={this.handleReplyClick}
            />
            <StatusActionBarItem
              title={intl.formatMessage(messages.repost)}
              altTitle={!publicStatus ? intl.formatMessage(messages.cannot_repost) : ''}
              icon={!publicStatus ? 'lock' : 'repost'}
              disabled={!publicStatus}
              active={!!status.get('reblogged')}
              buttonRef={this.setRepostButton}
              onClick={this.handleRepostClick}
            />
            <StatusActionBarItem
              buttonRef={this.setShareButton}
              title={intl.formatMessage(messages.share)}
              icon='share'
              onClick={this.handleShareClick}
            />
          </div>
        </div>
      </div>
    )
  }

}