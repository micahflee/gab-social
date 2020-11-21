import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { closePopover } from '../../actions/popover'
import { setGroupTimelineTopSort } from '../../actions/groups'
import {
  GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_TODAY,
  GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_WEEKLY,
  GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_MONTHLY,
  GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_YEARLY,
  GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_ALL_TIME,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'

class GroupTimelineSortTopOptionsPopover extends React.PureComponent {

  handleOnClick = (type) => {
    this.props.onSort(type)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      sortByTopValue,
      intl,
      isXS,
    } = this.props

    const items = [
      {
        hideArrow: true,
        isActive: sortByTopValue === GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_TODAY,
        title: intl.formatMessage(messages.topTodayTitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_TODAY),
      },
      {
        hideArrow: true,
        isActive: sortByTopValue === GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_WEEKLY,
        title: intl.formatMessage(messages.topWeekTitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_WEEKLY),
      },
      {
        hideArrow: true,
        isActive: sortByTopValue === GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_MONTHLY,
        title: intl.formatMessage(messages.topMonthTitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_MONTHLY),
      },
      {
        hideArrow: true,
        isActive: sortByTopValue === GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_YEARLY,
        title: intl.formatMessage(messages.topYearTitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_YEARLY),
      },
      /*
      {
        hideArrow: true,
        isActive: sortByTopValue === GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_ALL_TIME,
        title: intl.formatMessage(messages.topAllTitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_ALL_TIME),
      },
      */
    ]

    return (
      <PopoverLayout
        width={160}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          size={isXS ? 'large' : 'small'}
          scrollKey='group_timeline_sorting_top_options'
          items={items}
        />
      </PopoverLayout>
    )
  }
}

const messages = defineMessages({
  topTodayTitle: { id: 'group_timeline_sorting.top_today_title', defaultMessage: 'Today' },
	topWeekTitle: { id: 'group_timeline_sorting.top_week_title', defaultMessage: 'This Week' },
	topMonthTitle: { id: 'group_timeline_sorting.top_month_title', defaultMessage: 'This Month' },
	topYearTitle: { id: 'group_timeline_sorting.top_year_title', defaultMessage: 'This Year' },
	topAllTitle: { id: 'group_timeline_sorting.top_all_title', defaultMessage: 'All Time' },
})

const mapStateToProps = (state) => ({
  sortByTopValue: state.getIn(['group_lists', 'sortByTopValue']),
})

const mapDispatchToProps = (dispatch) => ({
  onSort(sort) {
    dispatch(setGroupTimelineTopSort(sort))
    dispatch(closePopover())
  },
  onClosePopover: () => dispatch(closePopover()),
})

GroupTimelineSortTopOptionsPopover.propTypes = {
  sortByTopValue: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  isXS: PropTypes.bool,
  onClosePopover: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GroupTimelineSortTopOptionsPopover))