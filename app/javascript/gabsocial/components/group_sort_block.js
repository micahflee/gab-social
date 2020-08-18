import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { openPopover } from '../actions/popover'
import {
  POPOVER_GROUP_TIMELINE_SORT_OPTIONS,
	POPOVER_GROUP_TIMELINE_SORT_TOP_OPTIONS,
	GROUP_TIMELINE_SORTING_TYPE_HOT,
	GROUP_TIMELINE_SORTING_TYPE_NEWEST,
	GROUP_TIMELINE_SORTING_TYPE_RECENT_ACTIVITY,
	GROUP_TIMELINE_SORTING_TYPE_TOP,
	GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_TODAY,
	GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_WEEKLY,
	GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_MONTHLY,
	GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_YEARLY,
	GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_ALL_TIME,
} from '../constants'
import SortBlock from '../components/sort_block'

class GroupSortBlock extends React.PureComponent {

  handleOnClickValue = (btn) => {
    this.props.onOpenSortingOptions(btn, {
			collectionType: this.props.collectionType,
		})
  }

  handleOnClickSubValue = (btn) => {
    this.props.onOpenSortingTopOptions(btn, {
			collectionType: this.props.collectionType,
		})
  }

  render() {
    const {
			intl,
      sortByValue,
      sortByTopValue,
    } = this.props

    let sortValueTitle = ''
    let sortValueTopTitle = ''
    
    switch (sortByValue) {
			case GROUP_TIMELINE_SORTING_TYPE_HOT:
				sortValueTitle = intl.formatMessage(messages.hotTitle)
				break
			case GROUP_TIMELINE_SORTING_TYPE_NEWEST:
				sortValueTitle = intl.formatMessage(messages.newTitle)
				break
			case GROUP_TIMELINE_SORTING_TYPE_RECENT_ACTIVITY:
				sortValueTitle = intl.formatMessage(messages.recentTitle)
				break
			case GROUP_TIMELINE_SORTING_TYPE_TOP:
				sortValueTitle = intl.formatMessage(messages.topTitle)
				break
			default:
				break
		}

		switch (sortByTopValue) {
			case GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_TODAY:
				sortValueTopTitle = intl.formatMessage(messages.topTodayTitle)
				break
			case GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_WEEKLY:
				sortValueTopTitle = intl.formatMessage(messages.topWeekTitle)
				break
			case GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_MONTHLY:
				sortValueTopTitle = intl.formatMessage(messages.topMonthTitle)
				break
			case GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_YEARLY:
				sortValueTopTitle = intl.formatMessage(messages.topYearTitle)
				break
			case GROUP_TIMELINE_SORTING_TYPE_TOP_OPTION_ALL_TIME:
				sortValueTopTitle = intl.formatMessage(messages.topAllTitle)
				break
			default:
				break
    }
    
    return (
      <SortBlock
        value={sortValueTitle}
        subValue={sortValueTopTitle}
        onClickValue={this.handleOnClickValue}
        onClickSubValue={this.handleOnClickSubValue}
      />
    )
  }

}


const messages = defineMessages({
	sortBy: { id: 'comment_sort.title', defaultMessage: 'Sort by' },
	hotTitle: { id: 'group_timeline_sorting.hot_title', defaultMessage: 'Hot Posts' },
  topTitle: { id: 'group_timeline_sorting.top_title', defaultMessage: 'Top Posts' },
	topTodayTitle: { id: 'group_timeline_sorting.top_today_title', defaultMessage: 'Today' },
	topWeekTitle: { id: 'group_timeline_sorting.top_week_title', defaultMessage: 'This Week' },
	topMonthTitle: { id: 'group_timeline_sorting.top_month_title', defaultMessage: 'This Month' },
	topYearTitle: { id: 'group_timeline_sorting.top_year_title', defaultMessage: 'This Year' },
	topAllTitle: { id: 'group_timeline_sorting.top_all_title', defaultMessage: 'All Time' },
  recentTitle: { id: 'group_timeline_sorting.recent_title', defaultMessage: 'Recent Activity' },
  newTitle: { id: 'group_timeline_sorting.new_title', defaultMessage: 'New Posts' },
})

const mapStateToProps = (state) => ({
	sortByValue: state.getIn(['group_lists', 'sortByValue']),
	sortByTopValue: state.getIn(['group_lists', 'sortByTopValue']),
})

const mapDispatchToProps = (dispatch) => ({
	onOpenSortingOptions(targetRef, options) {
		dispatch(openPopover(POPOVER_GROUP_TIMELINE_SORT_OPTIONS, {
			targetRef,
			options,
			position: 'bottom',
		}))
	},
	onOpenSortingTopOptions(targetRef, options) {
		dispatch(openPopover(POPOVER_GROUP_TIMELINE_SORT_TOP_OPTIONS, {
			targetRef,
			options,
			position: 'bottom',
		}))
	},
})

GroupSortBlock.propTypes = {
	intl: PropTypes.object.isRequired,
	collectionType: PropTypes.string,
	sortByValue: PropTypes.string.isRequired,
	sortByTopValue: PropTypes.string,
	onOpenSortingOptions: PropTypes.func.isRequired,
	onOpenSortingTopOptions: PropTypes.func,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GroupSortBlock))