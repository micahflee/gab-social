import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import isObject from 'lodash.isobject'
import { closePopover } from '../../actions/popover'
import { setGroupTimelineSort } from '../../actions/groups'
import {
  GROUP_TIMELINE_SORTING_TYPE_HOT,
  GROUP_TIMELINE_SORTING_TYPE_NEWEST,
  GROUP_TIMELINE_SORTING_TYPE_RECENT_ACTIVITY,
  GROUP_TIMELINE_SORTING_TYPE_TOP,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'

class GroupTimelineSortOptionsPopover extends React.PureComponent {

  handleOnClick = (type) => {
    this.props.onSort(type)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      sorting,
      intl,
      isXS,
      options,
    } = this.props
    
    const isFeaturedTimeline = isObject(options) && options.collectionType === 'featured'

    const items = [
      {
        hideArrow: true,
        isActive: sorting === GROUP_TIMELINE_SORTING_TYPE_HOT,
        title: intl.formatMessage(messages.hotTitle),
        subtitle: intl.formatMessage(messages.hotSubtitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_HOT),
      },
      {
        hideArrow: true,
        isActive: sorting === GROUP_TIMELINE_SORTING_TYPE_TOP,
        title: intl.formatMessage(messages.topTitle),
        subtitle: intl.formatMessage(messages.topSubtitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_TOP),
      }
    ]

    if (!isFeaturedTimeline) {
      items.push({
        hideArrow: true,
        isActive: sorting === GROUP_TIMELINE_SORTING_TYPE_NEWEST,
        title: intl.formatMessage(messages.newTitle),
        subtitle: intl.formatMessage(messages.newSubtitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_NEWEST),
      })
      items.push({
        hideArrow: true,
        isActive: sorting === GROUP_TIMELINE_SORTING_TYPE_RECENT_ACTIVITY,
        title: intl.formatMessage(messages.recentTitle),
        subtitle: intl.formatMessage(messages.recentSubtitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_RECENT_ACTIVITY),
      })
    }

    return (
      <PopoverLayout
        width={280}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          size={isXS ? 'large' : 'small'}
          scrollKey='group_timeline_sorting_options'
          items={items}
        />
      </PopoverLayout>
    )
  }
}

const messages = defineMessages({
  topTitle: { id: 'group_timeline_sorting.top_title', defaultMessage: 'Top Posts' },
  topSubtitle: { id: 'group_timeline_sorting.top_subtitle', defaultMessage: 'See gabs with most comments, likes and reposts first' },
  recentTitle: { id: 'group_timeline_sorting.recent_title', defaultMessage: 'Recent Activity' },
  recentSubtitle: { id: 'group_timeline_sorting.recent_subtitle', defaultMessage: 'See gabs with most recent comments first' },
  newTitle: { id: 'group_timeline_sorting.new_title', defaultMessage: 'New Posts' },
  newSubtitle: { id: 'group_timeline_sorting.new_subtitle', defaultMessage: 'See most recent gabs first' },
  hotTitle: { id: 'group_timeline_sorting.hot_title', defaultMessage: 'Hot Posts' },
  hotSubtitle: { id: 'group_timeline_sorting.hot_subtitle', defaultMessage: 'See the most popular and recent gabs' },
})

const mapStateToProps = (state) => ({
  sorting: state.getIn(['group_lists', 'sortByValue']),
})

const mapDispatchToProps = (dispatch) => ({
  onSort(sort) {
    dispatch(setGroupTimelineSort(sort))
    dispatch(closePopover())
  },
  onClosePopover: () => dispatch(closePopover()),
})

GroupTimelineSortOptionsPopover.propTypes = {
  sorting: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  isXS: PropTypes.bool,
  onClosePopover: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GroupTimelineSortOptionsPopover))