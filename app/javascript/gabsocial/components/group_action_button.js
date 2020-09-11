import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import {
  joinGroup,
  leaveGroup,
} from '../actions/groups'
import { openModal } from '../actions/modal'
import { me } from '../initial_state'
import {
  CX,
  MODAL_GROUP_PASSWORD,
} from '../constants'
import Button from './button'
import Text from './text'

class GroupActionButton extends ImmutablePureComponent {

  handleToggleMembership = () => {
    const { group, relationships } = this.props
    
    if (!group || !relationships) return false

    const groupId = group.get('id')
    const hasPassword = group.get('has_password')
    const isMember = relationships.get('member')
    const isRequested = relationships.get('requested')
 
    if (isMember || isRequested) {
      this.props.onLeaveGroup(groupId)
    } else {
      if (hasPassword) {
        this.props.onOpenGroupPasswordModal(group) 
      } else {
        this.props.onJoinGroup(groupId)
      }
    } 
  }

  render() {
    const {
      group,
      intl,
      relationships,
      size,
    } = this.props

    if (!group || !relationships) return null
    
    let buttonText = ''
    let buttonOptions = {}

    const isPrivate = group.get('is_private')
    const isMember = relationships.get('member')
    const isRequested = relationships.get('requested')

    if (isRequested) {
      buttonText = intl.formatMessage(messages.requested)
      buttonOptions = {
        color: 'primary',
        backgroundColor: 'tertiary',
      }
    } else if (isMember) {
      buttonText = intl.formatMessage(messages.member)
      buttonOptions = {
        color: 'white',
        backgroundColor: 'brand',
      }
    } else {
      if (isPrivate && !isRequested) {
        buttonText = intl.formatMessage(messages.request)
      } else {
        buttonText = intl.formatMessage(messages.join)
      }
      buttonOptions = {
        color: 'brand',
        backgroundColor: 'none',
        isOutline: true,
      }
    }

    const isSmall = size === 'small'
    const textClassName = isSmall ? null : _s.px10
    const textSize = isSmall ? 'small' : 'medium'
    const textWeight = isSmall ? 'normal' : 'bold'

    const btnClasses = CX({
      px10: isSmall,
      minW76PX: isSmall,
      jcCenter: 1,
      aiCenter: 1,
    })

    return (
      <Button
        {...buttonOptions}
        onClick={this.handleToggleMembership}
        className={btnClasses}
        isNarrow={isSmall}
      >
        <Text
          color='inherit'
          align='center'
          weight={textWeight}
          size={textSize}
          className={textClassName}
        >
          {buttonText}
        </Text>
      </Button>
    )
  }

}

const messages = defineMessages({
  join: { id: 'groups.join', defaultMessage: 'Join group' },
  request: { id: 'groups.request_join', defaultMessage: 'Request to Join' },
  requested: { id: 'groups.requested', defaultMessage: 'Requested' },
  member: { id: 'groups.member', defaultMessage: 'Member' },
})

const mapDispatchToProps = (dispatch) => ({
  onJoinGroup(groupId) {
    dispatch(joinGroup(groupId))
  },
  onLeaveGroup(groupId) {
    dispatch(leaveGroup(groupId))
  },
  onOpenGroupPasswordModal(group) {
    dispatch(openModal(MODAL_GROUP_PASSWORD, {
      group,
    }))
  },
})

GroupActionButton.propTypes = {
  group: ImmutablePropTypes.map,
  relationships: ImmutablePropTypes.map,
  intl: PropTypes.object.isRequired,
  size: PropTypes.oneOf([
    'small',
    'normal',
  ]),
  onJoin: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  onOpenGroupPasswordModal: PropTypes.func.isRequired,
}

GroupActionButton.defaultProps = {
  size: 'normal',
}

export default injectIntl(connect(null, mapDispatchToProps)(GroupActionButton))