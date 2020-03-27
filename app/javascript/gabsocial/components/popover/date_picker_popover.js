import DatePicker from 'react-datepicker'
import { changeScheduledAt } from '../../actions/compose'
import { openModal } from '../../actions/modal'
import { me } from '../../initial_state'
import { isMobile } from '../../utils/is_mobile'
import PopoverLayout from './popover_layout'

// import 'react-datepicker/dist/react-datepicker.css'

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


export default
@connect(mapStateToProps, mapDispatchToProps)
class DatePickerPopover extends PureComponent {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    setScheduledAt: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isPro: PropTypes.bool,
    onOpenProUpgradeModal: PropTypes.func.isRequired,
    position: PropTypes.string,
    small: PropTypes.bool,
  }

  handleSetDate = (date) => {
    this.props.setScheduledAt(date)
  }

  render() {
    const { date, isPro, position } = this.props

    const open = !!date
    const datePickerDisabled = !isPro
    const withPortal = isMobile(window.innerWidth)
    const popperPlacement = position || undefined

    return (
      <PopoverLayout>
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
      </PopoverLayout>
    )
  }
}