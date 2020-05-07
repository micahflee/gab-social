import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import {
  MODAL_GROUP_CREATE,
  MODAL_GROUP_MEMBERS,
  MODAL_GROUP_REMOVED_ACCOUNTS,
} from '../../constants'
import { openModal } from '../../actions/modal'
import { closePopover } from '../../actions/popover'
import { me } from '../../initial_state'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  groupMembers: { id: 'group_members', defaultMessage: 'Group members' },
  removedMembers: { id: 'group_removed_members', defaultMessage: 'Removed accounts' },
  editGroup: { id: 'edit_group', defaultMessage: 'Edit group' },
});

const mapDispatchToProps = (dispatch) => ({

  onOpenEditGroup(group) {
    dispatch(closePopover())
    dispatch(openModal(MODAL_GROUP_CREATE, { group }))
  },

  onOpenRemovedMembers(groupId) {
    dispatch(closePopover())
    dispatch(openModal(MODAL_GROUP_REMOVED_ACCOUNTS, { groupId }))
  },

  onOpenGroupMembers(groupId) {
    dispatch(closePopover())
    dispatch(openModal(MODAL_GROUP_MEMBERS, { groupId }))
  },

});

export default
@injectIntl
@connect(null, mapDispatchToProps)
class GroupOptionsPopover extends ImmutablePureComponent {

  static defaultProps = {
    intl: PropTypes.object.isRequired,
    group: ImmutablePropTypes.map.isRequired,
    onOpenEditGroup: PropTypes.func.isRequired,
    onOpenRemovedMembers: PropTypes.func.isRequired,
    onOpenGroupMembers: PropTypes.func.isRequired,
  }

  updateOnProps = ['group']

  handleEditGroup = () => {
    this.props.onOpenEditGroup(this.props.group)
  }

  handleOnOpenRemovedMembers = () => {
    this.props.onOpenRemovedMembers(this.props.group.get('id'))
  }

  handleOnOpenGroupMembers = () => {
    this.props.onOpenGroupMembers(this.props.group.get('id'))
  }

  render() {
    const { intl } = this.props

    const listItems = [
      {
        hideArrow: true,
        icon: 'group',
        title: intl.formatMessage(messages.groupMembers),
        onClick: this.handleOnOpenGroupMembers,
      },
      {
        hideArrow: true,
        icon: 'block',
        title: intl.formatMessage(messages.removedMembers),
        onClick: this.handleOnOpenRemovedMembers,
      },
      {
        hideArrow: true,
        icon: 'pencil',
        title: intl.formatMessage(messages.editGroup),
        onClick: this.handleEditGroup,
      }
    ]

    return (
      <PopoverLayout width={210}>
        <List
          scrollKey='group_options'
          items={listItems}
          size='large'
        />
      </PopoverLayout>
    )
  }

}