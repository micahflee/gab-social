import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { closePopover } from '../../actions/popover'
import { hideTimelineInjection } from '../../actions/timeline_injections'
import PopoverLayout from './popover_layout'
import List from '../list'

class TimelineInjectionOptionsPopover extends React.PureComponent {

  handleOnClick = () => {
    this.props.onDismissInjection()
    this.props.onDismiss()
    this.props.onClosePopover()
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { intl, isXS } = this.props

    return (
      <PopoverLayout
        width={280}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          size={isXS ? 'large' : 'small'}
          scrollKey='timeline_injection_options'
          items={[{
            hideArrow: true,
            title: intl.formatMessage(messages.dismissMessage),
            onClick: this.handleOnClick,
          }]}
        />
      </PopoverLayout>
    )
  }
}

const messages = defineMessages({
  dismissMessage: { id: 'timeline_injection_popover.dismiss_message', defaultMessage: 'Show this content less often' },
})


const mapDispatchToProps = (dispatch, { timelineInjectionId }) => ({
  onDismissInjection() {
    dispatch(hideTimelineInjection(timelineInjectionId))
  },
  onClosePopover: () => dispatch(closePopover()),
})

TimelineInjectionOptionsPopover.propTypes = {
  intl: PropTypes.object.isRequired,
  isXS: PropTypes.bool,
  timelineInjectionId: PropTypes.string.isRequired,
  onClosePopover: PropTypes.func.isRequired,
  onDismissInjection: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default injectIntl(connect(null, mapDispatchToProps)(TimelineInjectionOptionsPopover))