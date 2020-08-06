import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import {
  addShortcut,
  removeShortcut,
} from '../../actions/shortcuts'
import { closePopover } from '../../actions/popover'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  groupMembers: { id: 'group_members', defaultMessage: 'Group members' },
  removedMembers: { id: 'group_removed_members', defaultMessage: 'Removed accounts' },
  editGroup: { id: 'edit_group', defaultMessage: 'Edit group' },
  add_to_shortcuts: { id: 'account.add_to_shortcuts', defaultMessage: 'Add to shortcuts' },
  remove_from_shortcuts: { id: 'account.remove_from_shortcuts', defaultMessage: 'Remove from shortcuts' },
})

const mapStateToProps = (state, { group }) => {
  const groupId = group ? group.get('id') : null
  const shortcuts = state.getIn(['shortcuts', 'items'])
  const isShortcut = !!shortcuts.find((s) => {
    return s.get('shortcut_id') == groupId && s.get('shortcut_type') === 'group'
  })
  return { isShortcut }
}

const mapDispatchToProps = (dispatch) => ({
  onClosePopover: () => dispatch(closePopover()),
  onAddShortcut(groupId) {
    dispatch(addShortcut('group', groupId))
  },
  onRemoveShortcut(groupId) {
    dispatch(removeShortcut(null, 'group', groupId))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupOptionsPopover extends ImmutablePureComponent {

  static defaultProps = {
    group: ImmutablePropTypes.map.isRequired,
    isAdmin: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    isXS: PropTypes.bool,
    isShortcut: PropTypes.bool,
    onAddShortcut: PropTypes.func.isRequired,
    onRemoveShortcut: PropTypes.func.isRequired,
    onClosePopover: PropTypes.func.isRequired,
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  handleOnToggleShortcut = () => {
    this.handleOnClosePopover()
    if (this.props.isShortcut) {
      this.props.onRemoveShortcut(this.props.group.get('id'))
    } else {
      this.props.onAddShortcut(this.props.group.get('id'))
    }
  }

  render() {
    const {
      group,
      intl,
      isAdmin,
      isShortcut,
      isXS,
    } = this.props

    if (!group) return <div/>

    const groupId = group.get('id')

    const listItems = [
      {
        hideArrow: true,
        icon: 'group',
        title: intl.formatMessage(messages.groupMembers),
        onClick: this.handleOnClosePopover,
        to: `/groups/${groupId}/members`,
        isHidden: !isAdmin,
      },
      {
        hideArrow: true,
        icon: 'block',
        title: intl.formatMessage(messages.removedMembers),
        onClick: this.handleOnClosePopover,
        to: `/groups/${groupId}/removed-accounts`,
        isHidden: !isAdmin,
      },
      {
        hideArrow: true,
        icon: 'pencil',
        title: intl.formatMessage(messages.editGroup),
        onClick: this.handleOnClosePopover,
        to: `/groups/${groupId}/edit`,
        isHidden: !isAdmin,
      },
      {
        hideArrow: true,
        icon: 'star',
        title: intl.formatMessage(isShortcut ? messages.remove_from_shortcuts : messages.add_to_shortcuts),
        onClick: this.handleOnToggleShortcut,
      },
    ]

    return (
      <PopoverLayout
        width={240}
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