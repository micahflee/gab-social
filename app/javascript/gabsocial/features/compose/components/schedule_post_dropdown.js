import { injectIntl, defineMessages } from 'react-intl'
import DatePicker from 'react-datepicker'
import IconButton from '../../../components/icon_button'
import { changeScheduledAt } from '../../../actions/compose'
import { openModal } from '../../../actions/modal'
import { me } from '../../../initial_state'
import { isMobile } from '../../../utils/is_mobile'
import ComposeExtraButton from './compose_extra_button'

import 'react-datepicker/dist/react-datepicker.css'

const messages = defineMessages({
  schedule_status: { id: 'schedule_status.title', defaultMessage: 'Schedule' },
})

const mapStateToProps = state => ({
  date: state.getIn(['compose', 'scheduled_at']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = dispatch => ({
  setScheduledAt (date) {
    dispatch(changeScheduledAt(date))
  },

  onOpenProUpgradeModal() {
    dispatch(openModal('PRO_UPGRADE'))
  },
})

class DatePickerWrapper extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func,
  }

  render() {
    const { value, onClick } = this.props

    return (
      <button className='schedule-post-dropdown-wrapper' onClick={onClick}>
        {value}
      </button>
    )
  }
}

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class SchedulePostDropdown extends PureComponent {

  static propTypes = {
    date: PropTypes.instanceOf(Date),
    setScheduledAt: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isPro: PropTypes.bool,
    onOpenProUpgradeModal: PropTypes.func.isRequired,
    position: PropTypes.string,
  }

  handleToggle = () => {
    if (!this.props.isPro) {
      return this.props.onOpenProUpgradeModal()
    }

    const { date } = this.props
    const value = date ? null : new Date()
    this.handleSetDate(value)
  }

  handleSetDate = (date) => {
    this.props.setScheduledAt(date)
  }

  render () {
    const { intl, date, isPro, position } = this.props

    const open = !!date
    const datePickerDisabled = !isPro
    const withPortal = isMobile(window.innerWidth)
    const popperPlacement = position || undefined

    return (
      <div className={[].join(' ')}>
        <div className={[].join(' ')}>
          <ComposeExtraButton
            icon='calendar'
            title={intl.formatMessage(messages.schedule_status)}
            onClick={this.handleToggle}
          />
        </div>
        {
          open &&
          <DatePicker
            target={this}
            className='schedule-post-dropdown__datepicker'
            minDate={new Date()}
            selected={date}
            onChange={date => this.handleSetDate(date)}
            timeFormat='p'
            timeIntervals={15}
            timeCaption='Time'
            dateFormat='MMM d, yyyy h:mm aa'
            disabled={datePickerDisabled}
            showTimeSelect
            customInput={<DatePickerWrapper />}
            withPortal={withPortal}
            popperPlacement={popperPlacement}
            popperModifiers={{
              offset: {
                enabled: true,
                offset: '0px, 5px'
              },
              preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: 'viewport'
              }
            }}
          />
        }
      </div>
    )
  }

}
