import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  favorite,
  unfavorite,
} from '../actions/interactions'
import { replyCompose } from '../actions/compose'
import { openModal } from '../actions/modal'
import { openPopover } from '../actions/popover'
import { makeGetStatus } from '../selectors'
import { me } from '../initial_state'
import Avatar from './avatar'
import Button from './button'
import CommentHeader from './comment_header'
import StatusContent from './status_content'
import StatusMedia from './status_media'
import { defaultMediaVisibility } from './status'
import Text from './text'

const messages = defineMessages({
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  like: { id: 'status.like', defaultMessage: 'Like' },
  unlike: { id: 'status.unlike', defaultMessage: 'Unlike' },
})

const makeMapStateToProps = (state, props) => ({
  status: makeGetStatus()(state, props)
})

const mapDispatchToProps = (dispatch) => ({
  onReply(status, router) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch((_, getState) => {
      const state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal('CONFIRM', {
          message: <FormattedMessage id='confirmations.reply.message' defaultMessage='Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' />,
          confirm: <FormattedMessage id='confirmations.reply.confirm' defaultMessage='Reply' />,
          onConfirm: () => dispatch(replyCompose(status, router)),
        }))
      } else {
        dispatch(replyCompose(status, router, true))
      }
    })
  },
  onFavorite(status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('favourited')) {
      dispatch(unfavorite(status))
    } else {
      dispatch(favorite(status))
    }
  },
  onOpenStatusOptions(status) {
    dispatch(openPopover('STATUS_OPTOINS', { status }))
  },
  onOpenLikes(status) {
    dispatch(openModal('STATUS_LIKES', { status }))
  },
  onOpenReposts(status) {
    dispatch(openModal('STATUS_REPOSTS', { status }))
  },
})

export default
@injectIntl
@connect(makeMapStateToProps, mapDispatchToProps)
class Comment extends ImmutablePureComponent {

  static propTypes = {
    indent: PropTypes.number,
    intl: PropTypes.object.isRequired,
    status: ImmutablePropTypes.map.isRequired,
    isHidden: PropTypes.bool,
    isIntersecting: PropTypes.bool,
    onReply: PropTypes.func.isRequired,
    onFavorite: PropTypes.func.isRequired,
    onOpenStatusOptions: PropTypes.func.isRequired,
    onOpenLikes: PropTypes.func.isRequired,
    onOpenReposts: PropTypes.func.isRequired,
  }

  updateOnProps = [
    'status',
    'indent',
    'isHidden',
    'isIntersecting',
  ]

  state = {
    showMedia: defaultMediaVisibility(this.props.status),
    statusId: undefined,
    height: undefined,
  }

  handleOnReply = () => {
    this.props.onReply(this.props.status)
  }

  handleOnFavorite = () => {
    this.props.onFavorite(this.props.status)
  }

  handleOnOpenStatusOptions = () => {
    this.props.onOpenStatusOptions(this.props.status)
  }

  render() {
    const {
      indent,
      intl,
      status,
      isHidden,
    } = this.props

    if (isHidden) {
      return (
        <div tabIndex='0'>
          {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
          {status.get('content')}
        </div>
      )
    }

    const style = {
      paddingLeft: `${indent * 42}px`,
    }

    return (
      <div className={[_s.default, _s.px15, _s.mb10, _s.py5].join(' ')} data-comment={status.get('id')}>
        <div className={[_s.default].join(' ')} style={style}>

          <div className={[_s.default, _s.flexRow].join(' ')}>
            <NavLink
              to={`/${status.getIn(['account', 'acct'])}`}
              title={status.getIn(['account', 'acct'])}
              className={[_s.default, _s.mr10, _s.pt5].join(' ')}
            >
              <Avatar account={status.get('account')} size={32} />
            </NavLink>

            <div className={[_s.default, _s.flexShrink1, _s.maxWidth100PC42PX].join(' ')}>
              <div className={[_s.default, _s.px10, _s.pt5, _s.pb10, _s.radiusSmall, _s.bgSubtle].join(' ')}>
                <CommentHeader
                  status={status}
                  onOpenLikes={this.props.onOpenLikes}
                  onOpenReposts={this.props.onOpenReposts}
                />
                <StatusContent
                  status={status}
                  onClick={this.handleClick}
                  isComment
                  collapsable
                />
                <div className={[_s.default].join(' ')}>
                  <StatusMedia
                    isComment
                    status={status}
                    onOpenMedia={this.props.onOpenMedia}
                    cacheWidth={this.props.cacheMediaWidth}
                    defaultWidth={this.props.cachedMediaWidth}
                    visible={this.state.showMedia}
                    onToggleVisibility={this.handleToggleMediaVisibility}
                    width={this.props.cachedMediaWidth}
                    onOpenVideo={this.handleOpenVideo}
                  />
                </div>
              </div>

              <div className={[_s.default, _s.flexRow, _s.mt5].join(' ')}>
                <CommentButton
                  title={intl.formatMessage(status.get('favourited') ? messages.unlike : messages.like)}
                  onClick={this.handleOnFavorite}
                />
                <CommentButton
                  title={intl.formatMessage(messages.reply)}
                  onClick={this.handleOnReply}
                />
                <CommentButton
                  title='···'
                  onClick={this.handleOnOpenStatusOptions}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  }

}

class CommentButton extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    const { onClick, title } = this.props

    return (
      <Button
        isText
        radiusSmall
        backgroundColor='none'
        color='tertiary'
        className={[_s.px5, _s.bgSubtle_onHover, _s.py2, _s.mr5].join(' ')}
        onClick={onClick}
      >
        <Text size='extraSmall' color='inherit' weight='bold'>
          {title}
        </Text>
      </Button>
    )
  }

}