import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import {
	updateRole,
	createRemovedAccount,
} from '../../actions/groups'
import PopoverLayout from './popover_layout'
import List from '../list'

class GroupMemberOptionsPopover extends React.PureComponent {

  handleOnRemoveFromGroup = () => {
	  this.props.onCreateRemovedAccount(this.props.groupId, this.props.accountId)
  }

  handleOnUpdateRole = (role) => {
	  this.props.onUpdateRole(this.props.groupId, this.props.accountId, role)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { isModerator, isXS } = this.props

    const listItems = [
      {
        hideArrow: true,
        icon: 'block',
        title: 'Remove from group',
        onClick: this.handleOnRemoveFromGroup,
      },
    ]

    if (!isModerator) {
      listItems.push({
        hideArrow: true,
        icon: 'group',
        title: 'Make group moderator',
        onClick: () => this.handleOnUpdateRole('moderator'),
      })

      listItems.push({
        hideArrow: true,
        icon: 'group',
        title: 'Make group admin',
        onClick: () => this.handleOnUpdateRole('admin'),
      })
    }

    return (
      <PopoverLayout
        width={210}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          scrollKey='group_options'
          items={listItems}
          size={isXS ? 'large' : 'small'}
        />
      </PopoverLayout>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onUpdateRole(groupId, accountId, type) {
    dispatch(closePopover())
    dispatch(updateRole(groupId, accountId, type))
  },
  onCreateRemovedAccount(groupId, accountId) {
    dispatch(closePopover())
    dispatch(createRemovedAccount(groupId, accountId))
  },
  onClosePopover:() => dispatch(closePopover()),
})

GroupMemberOptionsPopover.defaultProps = {
  accountId: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  isXS: PropTypes.bool,
  onClosePopover: PropTypes.func.isRequired,
  onCreateRemovedAccount: PropTypes.func.isRequired,
  onUpdateRole: PropTypes.func.isRequired,
  isModerator: PropTypes.bool,
}

export default connect(null, mapDispatchToProps)(GroupMemberOptionsPopover)