import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import { CX } from '../constants'
import { PLACEHOLDER_MISSING_HEADER_SRC } from '../constants'
import { shortNumberFormat } from '../utils/numbers'
import Button from './button'
import Image from './image'
import Text from './text'
import Dummy from './dummy'
import GroupActionButton from './group_action_button'

class GroupListItem extends ImmutablePureComponent {

  render() {
    const {
      group,
      intl,
      isAddable,
      isLast,
      isHidden,
      isStatic,
      relationships,
    } = this.props

    if (!group) return null
    
    if (isHidden) {
      return (
        <React.Fragment>
          {group.get('title')}
        </React.Fragment>
      )
    }
    
    const containerClasses = CX({
      d: 1,
      overflowHidden: 1,
      bgSubtle_onHover: 1,
      borderColorSecondary: 1,
      borderBottom1PX: !isLast,
      flexRow: 1,
      py5: 1,
      px5: isAddable,
      w100PC: 1,
    })

    const containerLinkClasses = CX({
      d: 1,
      flexRow: 1,
      noUnderline: 1,
      w100PC: 1,
      flexGrow1: isAddable,
      flexShrink1: isAddable,
    })

    const coverSrc = group.get('cover_image_url') || ''
    const coverMissing = coverSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1 || !coverSrc

    const Wrapper = !isStatic ? NavLink : Dummy

    return (
      <div className={containerClasses}>
        <Wrapper
          to={`/groups/${group.get('id')}`}
          className={containerLinkClasses}
        >

          {
            !coverMissing &&
            <Image
              src={coverSrc}
              alt={group.get('title')}
              className={[_s.radiusSmall, _s.h53PX, _s.w84PX, _s.ml15].join(' ')}
            />
          }

          <div className={[_s.d, _s.px10, _s.mt5, _s.flexShrink1].join(' ')}>
            <Text color='brand' weight='bold'>
              {group.get('title')}
            </Text>

            <Text color='secondary' size='small' className={_s.mt5}>
              {shortNumberFormat(group.get('member_count'))}
              &nbsp;
              {intl.formatMessage(messages.members)}
            </Text>

          </div>
        </Wrapper>
        {
          isAddable &&
          <div className={[_s.d, _s.jcCenter, _s.flexGrow1].join(' ')}>
            <GroupActionButton
              group={group}
              relationships={relationships}
              size='small'
            />
          </div>
        }
      </div>
    )
  }

}

const messages = defineMessages({
  members: { id: 'groups.card.members', defaultMessage: 'Members' },
})

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
})

GroupListItem.propTypes = {
  group: ImmutablePropTypes.map,
  isAddable: PropTypes.bool,
  isHidden: PropTypes.bool,
  isLast: PropTypes.bool,
  isStatic: PropTypes.bool,
  relationships: ImmutablePropTypes.map,
}

GroupListItem.defaultProps = {
  isLast: false,
}

export default injectIntl(connect(mapStateToProps)(GroupListItem))