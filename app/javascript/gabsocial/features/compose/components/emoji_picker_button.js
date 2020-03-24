import { addPoll, removePoll } from '../../../actions/compose'
import ComposeExtraButton from './compose_extra_button'

const mapStateToProps = state => ({
  // unavailable: state.getIn(['compose', 'is_uploading']) || (state.getIn(['compose', 'media_attachments']).size > 0),
  // active: state.getIn(['compose', 'poll']) !== null,
})

const mapDispatchToProps = dispatch => ({

  onClick() {
    dispatch((_, getState) => {
      if (getState().getIn(['compose', 'poll'])) {
        dispatch(removePoll())
      } else {
        dispatch(addPoll())
      }
    })
  },

})

export default
@connect(mapStateToProps, mapDispatchToProps)
class EmojiPickerButton extends PureComponent {

  static propTypes = {
    disabled: PropTypes.bool,
    unavailable: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    small: PropTypes.bool,
  }

  handleClick = () => {
    this.props.onClick()
  }

  render() {
    const { active, unavailable, disabled, small } = this.props

    if (unavailable) return null

    return (
      <ComposeExtraButton
        disabled={disabled}
        onClick={this.handleClick}
        icon='happy'
        small={small}
        active={active}
      />
    )
  }

}
