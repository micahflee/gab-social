import { injectIntl, defineMessages } from 'react-intl'
import { openModal } from '../../../actions/modal'
import { openPopover } from '../../../actions/popover'
import { me } from '../../../initial_state'
import ComposeExtraButton from './compose_extra_button'

// import 'react-datepicker/dist/react-datepicker.css'

const messages = defineMessages({
  schedule_status: { id: 'schedule_status.title', defaultMessage: 'Schedule' },
})

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenDatePickerPopover(targetRef) {
    dispatch(openPopover('DATE_PICKER', {
      targetRef,
    }))
  },

  onOpenProUpgradeModal() {
    dispatch(openModal('PRO_UPGRADE'))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class SchedulePostDropdown extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isPro: PropTypes.bool,
    onOpenProUpgradeModal: PropTypes.func.isRequired,
    onOpenDatePickerPopover: PropTypes.func.isRequired,
    small: PropTypes.bool,
  }

  handleToggle = () => {
    if (!this.props.isPro) {
      this.props.onOpenProUpgradeModal()
    } else {
      this.props.onOpenDatePickerPopover(this.button)
    }
  }

  setButton = (n) => {
    this.button = n
  }

  render () {
    const { intl, small } = this.props

    return (
      <ComposeExtraButton
        icon='calendar'
        title={intl.formatMessage(messages.schedule_status)}
        onClick={this.handleToggle}
        small={small}
        buttonRef={this.setButton}
      />
    )
  }

}
