import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import { quoteCompose } from '../../actions/compose'
import { repost, unrepost } from '../../actions/interactions'
import { openModal } from '../../actions/modal'
import { boostModal, me } from '../../initial_state'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  repost: { id: 'repost', defaultMessage: 'Repost' },
  repostWithComment: { id: 'repost_with_comment', defaultMessage: 'Repost with comment' },
});

const mapDispatchToProps = (dispatch, { intl }) => ({
  onQuote (status, router) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch((_, getState) => {
      const state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal('CONFIRM', {
          message: intl.formatMessage(messages.quoteMessage),
          confirm: intl.formatMessage(messages.quoteConfirm),
          onConfirm: () => dispatch(quoteCompose(status, router)),
        }));
      } else {
        dispatch(quoteCompose(status, router));
      }
    });
  },

  onRepost (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('reblogged')) {
      dispatch(unrepost(status));
    } else {
      dispatch(repost(status));
    }
  },
});


export default
@injectIntl
@connect(null, mapDispatchToProps)
class RepostOptionsPopover extends ImmutablePureComponent {

  static defaultProps = {
    intl: PropTypes.object.isRequired,
    status: ImmutablePropTypes.map.isRequired,
    onQuote: PropTypes.func.isRequired,
    onRepost: PropTypes.func.isRequired,
  }

  updateOnProps = ['status']

  handleOnRepost = () => {
    
  }

  handleOnQuote = () => {
    
  }

  render() {
    const { intl } = this.props

    const listItems = [
      {
        hideArrow: true,
        icon: 'repost',
        title: intl.formatMessage(messages.repost),
        onClick: this.handleOnRepost,
      },
      {
        hideArrow: true,
        icon: 'pencil',
        title: intl.formatMessage(messages.repostWithComment),
        onClick: this.handleBlockDomain,
      }
    ]

    return (
      <PopoverLayout width={220}>
        <List
          scrollKey='repost_options'
          items={listItems}
          size='large'
        />
      </PopoverLayout>
    )
  }

}