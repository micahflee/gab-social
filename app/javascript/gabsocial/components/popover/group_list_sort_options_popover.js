import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import { sortGroups } from '../../actions/groups'
import {
  GROUP_LIST_SORTING_TYPE_ALPHABETICAL,
  GROUP_LIST_SORTING_TYPE_MOST_POPULAR,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'

class GroupListSortOptionsPopover extends React.PureComponent {

  handleOnSortGroup = (sortType) => {
    this.props.onSortGroups(this.props.tab, sortType)
    this.handleOnClosePopover()
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { isXS } = this.props

    const listItems = [
      {
        hideArrow: true,
        title: 'Alphabetically',
        onClick: () => this.handleOnSortGroup(GROUP_LIST_SORTING_TYPE_ALPHABETICAL),
        isActive: false,
      },
      {
        hideArrow: true,
        title: 'Member Count',
        onClick: () => this.handleOnSortGroup(GROUP_LIST_SORTING_TYPE_MOST_POPULAR),
        isActive: false,
      },
    ]

    return (
      <PopoverLayout
        width={210}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          scrollKey='group_list_sort_options'
          items={listItems}
          size={isXS ? 'large' : 'small'}
        />
      </PopoverLayout>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onSortGroups: (tab, sortType) => dispatch(sortGroups(tab, sortType)),
  onClosePopover:() => dispatch(closePopover()),
})

GroupListSortOptionsPopover.defaultProps = {
  tab: PropTypes.string.isRequired,
  onClosePopover: PropTypes.func.isRequired,
  onSortGroups: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(GroupListSortOptionsPopover)