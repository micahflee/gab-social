import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import { getListOfGroups } from '../../selectors'
import { fetchGroupsByTab } from '../../actions/groups'
import { changeComposeGroupId } from '../../actions/compose'
import PopoverLayout from './popover_layout'
import List from '../list'
import Button from '../button'
import Text from '../text'

class ComposePostDesinationPopover extends ImmutablePureComponent {

  state = {
    isGroupsSelected: false,
  }

  componentDidMount() {
    if (this.props.composeGroupId) {
      this.setState({ isGroupsSelected: true })
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.composeGroupId !== this.props.composeGroupId) {
      this.setState({ isGroupsSelected: !!this.props.composeGroupId })
    }
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  selectDestination = (destination) => {
    const isGroupsSelected = destination === 'group'
    this.setState({ isGroupsSelected })
    if (isGroupsSelected) {
      this.props.onFetchMemberGroups()
    } else {
      this.handleSelectGroup(null)
    }
  }

  handleSelectGroup = (groupId) => {
    this.props.onChangeComposeGroupId(groupId)
    this.handleOnClosePopover()
  }

  render() {
    const { isXS, groups, composeGroupId } = this.props
    const { isGroupsSelected } = this.state

    const mainItems = [
      {
        hideArrow: true,
        title: 'Timeline',
        isActive: !isGroupsSelected,
        onClick: () => this.selectDestination('home'),
      },
      {
        title: 'Group',
        isActive: isGroupsSelected,
        onClick: () => this.selectDestination('group'),
      },
    ]

    const groupItems = !!groups ? groups.map((group) => ({
      hideArrow: true,
      onClick: () => this.handleSelectGroup(group.get('id')),
      title: group.get('title'),
      isActive: group.get('id') === composeGroupId,
    })) : []
    
    return (
      <PopoverLayout
        width={isGroupsSelected ? 320 : 180}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        {
          !isGroupsSelected &&
          <div className={[_s.d, _s.w100PC].join(' ')}>
            <Text className={[_s.d, _s.px15, _s.py10, _s.bgSecondary].join(' ')}>Post to:</Text>
            <List
              size={isXS ? 'large' : 'normal'}
              items={mainItems}
            />
          </div>
        }
        {
          isGroupsSelected &&
          <div className={[_s.d, _s.w100PC].join(' ')}>
            <div className={[_s.d, _s.flexRow, _s.bgSecondary].join(' ')}>
              <Button
                isText
                icon='back'
                color='primary'
                backgroundColor='none'
                className={[_s.aiCenter, _s.jcCenter, _s.pl15, _s.pr5].join(' ')}
                onClick={() => this.selectDestination('home')}
              />
              <Text className={[_s.d, _s.pl5, _s.py10].join(' ')}>
                Select group:
              </Text>
            </div>
            <div className={[_s.d, _s.w100PC, _s.overflowYScroll, _s.maxH340PX].join(' ')}>
              <List
                size={isXS ? 'large' : 'normal'}
                scrollKey='groups-post-destination-add'
                showLoading={groups.length === 0}
                emptyMessage="You are not a member of any groups yet."
                items={groupItems}
              />
            </div>
          </div>
        }
      </PopoverLayout>
    )
  }
}

const mapStateToProps = (state) => {
  const composeGroupId = state.getIn(['compose', 'group_id'])

  return {
    composeGroupId,
    composeGroup: state.getIn(['groups', composeGroupId]),
    groups: getListOfGroups(state, { type: 'member' }),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onClosePopover() {
    dispatch(closePopover())
  },
  onFetchMemberGroups() {
    dispatch(fetchGroupsByTab('member'))
  },
  onChangeComposeGroupId(groupId) {
    dispatch(changeComposeGroupId(groupId))
  }
})

ComposePostDesinationPopover.propTypes = {
  isXS: PropTypes.bool,
  onClosePopover: PropTypes.func.isRequired,
  onFetchMemberGroups: PropTypes.func.isRequired,
  onChangeComposeGroupId: PropTypes.func.isRequired,
  groups: ImmutablePropTypes.list,
  composeGroup: ImmutablePropTypes.map,
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposePostDesinationPopover)