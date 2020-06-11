import { closePopover } from '../../actions/popover'
import {
	updateRole,
	createRemovedAccount,
} from '../../actions/groups'
import PopoverLayout from './popover_layout'
import List from '../list'

const mapDispatchToProps = (dispatch) => ({
  onUpdateRole(groupId, accountId, type) {
    dispatch(closePopover())
    dispatch(updateRole(groupId, accountId, type))
  },
  onCreateRemovedAccount(groupId, accountId) {
    dispatch(closePopover())
    dispatch(createRemovedAccount(groupId, accountId))
  },
})

export default
@connect(null, mapDispatchToProps)
class GroupMemberOptionsPopover extends PureComponent {

  static defaultProps = {
    accountId: PropTypes.string.isRequired,
    groupId: PropTypes.string.isRequired,
    isXS: PropTypes.bool,
    onUpdateRole: PropTypes.func.isRequired,
    onCreateRemovedAccount: PropTypes.func.isRequired,
  }

  handleOnRemoveFromGroup = () => {
	  this.props.onCreateRemovedAccount(this.props.groupId, this.props.accountId)
  }

  handleOnMakeAdmin = () => {
	  this.props.onUpdateRole(this.props.groupId, this.props.accountId, 'admin')
  }

  render() {
    const { isXS } = this.props

    const listItems = [
      {
        hideArrow: true,
        icon: 'block',
        title: 'Remove from group',
        onClick: this.handleOnRemoveFromGroup,
      },
      {
        hideArrow: true,
        icon: 'groups',
        title: 'Make group admin',
        onClick: this.handleOnMakeAdmin,
      },
    ]

    return (
      <PopoverLayout width={210} isXS={isXS}>
        <List
          scrollKey='group_options'
          items={listItems}
          size='large'
        />
      </PopoverLayout>
    )
  }

}