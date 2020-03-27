import { defineMessages, injectIntl } from 'react-intl'
import { openPopover } from '../../../actions/popover'
import ComposeExtraButton from './compose_extra_button'

const messages = defineMessages({
  emoji: { id: 'emoji_button.label', defaultMessage: 'Insert emoji' },
})

const mapStateToProps = state => ({
  // unavailable: state.getIn(['compose', 'is_uploading']) || (state.getIn(['compose', 'media_attachments']).size > 0),
  // active: state.getIn(['compose', 'poll']) !== null,
})

const mapDispatchToProps = dispatch => ({

  onClick(targetRef) {
    dispatch(openPopover('EMOJI_PICKER', {
      targetRef,
    }))
  },

})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class EmojiPickerButton extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
    small: PropTypes.bool,
  }

  handleClick = () => {
    this.props.onClick(this.button)
  }

  setButton = (n) => {
    this.button = n
  }

  render() {
    const { active, small, intl } = this.props

    const title = intl.formatMessage(messages.emoji)

    return (
      <ComposeExtraButton
        onClick={this.handleClick}
        icon='happy'
        title={title}
        small={small}
        active={active}
        buttonRef={this.setButton}
      />
    )
  }

}
