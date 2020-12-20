import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import { FormattedMessage } from 'react-intl'
import moment from 'moment-mini'
import { changeScheduledAt } from '../../actions/compose'
import { openModal } from '../../actions/modal'
import { closePopover } from '../../actions/popover'
import { me } from '../../initial_state'
import { MODAL_PRO_UPGRADE } from '../../constants'
import PopoverLayout from './popover_layout'
import Button from '../button'
import Text from '../text'

import '!style-loader!css-loader!react-datepicker/dist/react-datepicker.css'

class DatePickerPopover extends React.PureComponent {

  handleSetDate = (date) => {
    this.props.setScheduledAt(date, this.props.isPro)
  }
  
  handleRemoveDate = () => {
    this.props.setScheduledAt(null, this.props.isPro)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { date, isPro, isXS } = this.props
    const datePickerDisabled = !isPro

    return (
      <PopoverLayout
        width={360}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <div className={[_s.d, _s.bgSubtle].join(' ')}>
          <DatePicker
            inline
            target={this}
            minDate={new Date()}
            selected={date}
            onChange={date => this.handleSetDate(date)}
            timeFormat='p'
            timeIntervals={15}
            timeCaption='Time'
            dateFormat='MMM d, yyyy h:mm aa'
            disabled={datePickerDisabled}
            showTimeSelect
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
        </div>
        {
          date &&
          <div className={[_s.d, _s.aiCenter, _s.flexRow, _s.px10, _s.py10, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
            <Text size='extraSmall' color='secondary'>
              <FormattedMessage id='scheduled_for_datetime' defaultMessage='Scheduled for {datetime}' values={{
                datetime: moment(date).format('lll'),
              }}/>
            </Text>
            <div className={_s.mlAuto}>
              <Button
                isNarrow
                radiusSmall
                color='primary'
                backgroundColor='tertiary'
                onClick={this.handleRemoveDate}
              >
                <Text color='inherit' size='small'>
                  <FormattedMessage id='remove' defaultMessage='Remove' />
                </Text>
              </Button>
            </div>
          </div>
        }
      </PopoverLayout>
    )
  }
  
}

const mapStateToProps = (state) => ({
  date: state.getIn(['compose', 'scheduled_at']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = (dispatch) => ({
  setScheduledAt (date, isPro) {
    if (!isPro) {
      dispatch(closePopover())
      return dispatch(openModal(MODAL_PRO_UPGRADE))
    }

    dispatch(changeScheduledAt(date))

    if (!date) {
      dispatch(closePopover())
    }
  },

  onClosePopover: () => dispatch(closePopover())
})

DatePickerPopover.propTypes = {
  date: PropTypes.instanceOf(Date),
  setScheduledAt: PropTypes.func.isRequired,
  isPro: PropTypes.bool,
  position: PropTypes.string,
  small: PropTypes.bool,
  isXS: PropTypes.bool,
  onClosePopover: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(DatePickerPopover)