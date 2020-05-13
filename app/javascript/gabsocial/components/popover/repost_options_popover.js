import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import {
  MODAL_BOOST,
  MODAL_CONFIRM,
  MODAL_UNAUTHORIZED,
} from '../../constants'
import { boostModal, me } from '../../initial_state'
import { quoteCompose } from '../../actions/compose'
import { repost, unrepost } from '../../actions/interactions'
import { closePopover } from '../../actions/popover'
import { openModal } from '../../actions/modal'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  repost: { id: 'repost', defaultMessage: 'Repost' },
  removeRepost: { id: 'status.cancel_repost_private', defaultMessage: 'Remove Repost' },
  repostWithComment: { id: 'repost_with_comment', defaultMessage: 'Repost with comment' },
  quoteMessage: { id: 'confirmations.quote.message', defaultMessage: 'Quoting now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  quoteConfirm: { id: 'confirmations.quote.confirm', defaultMessage: 'Quote' },
})

const mapDispatchToProps = (dispatch, { intl }) => ({
  onQuote (status, router) {
    if (!me) return dispatch(openModal(MODAL_UNAUTHORIZED))
    
    dispatch(closePopover())
    
    dispatch((_, getState) => {
      const state = getState()
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal(MODAL_CONFIRM, {
          message: intl.formatMessage(messages.quoteMessage),
          confirm: intl.formatMessage(messages.quoteConfirm),
          onConfirm: () => dispatch(quoteCompose(status, router)),
        }))
      } else {
        dispatch(quoteCompose(status, router))
      }
    })
  },

  onRepost (status) {
    if (!me) return dispatch(openModal(MODAL_UNAUTHORIZED))

    dispatch(closePopover())
    
    const alreadyReposted = status.get('reblogged')

    if (boostModal && !alreadyReposted) {
      dispatch(openModal(MODAL_BOOST, {
        status,
        onRepost: () => dispatch(repost(status)),
      }))
    } else {
      if (alreadyReposted) {
        dispatch(unrepost(status))
      } else {
        dispatch(repost(status))
      }
    }
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class RepostOptionsPopover extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static defaultProps = {
    intl: PropTypes.object.isRequired,
    onQuote: PropTypes.func.isRequired,
    onRepost: PropTypes.func.isRequired,
    status: ImmutablePropTypes.map.isRequired,
    isXS: PropTypes.bool,
  }

  updateOnProps = [
    'status',
  ]

  handleOnQuote = () => {
    this.props.onQuote(this.props.status, this.context.router.history)
  }

  handleOnRepost = () => {
    this.props.onRepost(this.props.status)
  }

  render() {
    const { intl, status, isXS } = this.props

    const alreadyReposted = status.get('reblogged')

    return (
      <PopoverLayout width={220} isXS={isXS}>
        <List
          scrollKey='repost_options'
          size='large'
          items={[
            {
              hideArrow: true,
              icon: 'repost',
              title: intl.formatMessage(!alreadyReposted ? messages.repost : messages.removeRepost),
              onClick: this.handleOnRepost,
            },
            {
              hideArrow: true,
              icon: 'pencil',
              title: intl.formatMessage(messages.repostWithComment),
              onClick: this.handleOnQuote,
            }
          ]}
        />
      </PopoverLayout>
    )
  }

}