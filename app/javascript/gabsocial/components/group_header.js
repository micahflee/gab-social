import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { openPopover } from '../actions/popover'
import {
  addShortcut,
  removeShortcut,
} from '../actions/shortcuts'
import {
  PLACEHOLDER_MISSING_HEADER_SRC,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { me } from '../initial_state'
import Responsive from '../features/ui/util/responsive_component'
import GroupActionButton from './group_action_button'
import Button from './button'
import Block from './block'
import Heading from './heading'
import Image from './image'
import Icon from './icon'
import TabBar from './tab_bar'
import Pills from './pills'
import Text from './text'

class GroupHeader extends ImmutablePureComponent {

  handleOnOpenGroupOptions = () => {
    const { relationships } = this.props
    const isAdmin = !!relationships ? relationships.get('admin') : false
    const isModerator = !!relationships ? relationships.get('moderator') : false
    this.props.onOpenGroupOptions(this.infoBtn, this.props.group, {
      isAdmin,
      isModerator,
    })
  }

  handleToggleShortcut = () => {
    const { group, isShortcut } = this.props
    const groupId = !!group ? group.get('id') : null
    
    if (!groupId) return

    if (isShortcut) {
      this.props.onRemoveShortcut(groupId)
    } else {
      this.props.onAddShortcut(groupId)
    }
  }

  setInfoBtn = (c) => {
    this.infoBtn = c;
  }

  render() {
    const {
      children,
      group,
      intl,
      isXS,
      isShortcut,
      relationships,
    } = this.props

    const coverSrc = !!group ? group.get('cover_image_url') : ''
    const coverSrcMissing = coverSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1 || !coverSrc
    const title = !!group ? group.get('title') : undefined
    const slug = !!group ? !!group.get('slug') ? `g/${group.get('slug')}` : undefined : undefined
    const isPrivate = !!group ? group.get('is_private') : false
    const isAdminOrMod = !!relationships ? (relationships.get('admin') || relationships.get('moderator')) : false

    const tabs = !group ? [] : [
      {
        to: `/groups/${group.get('id')}`,
        title: 'Timeline',
      },
    ]

    if (isAdminOrMod && group) {
      tabs.push({
        to: `/groups/${group.get('id')}/members`,
        title: 'Members',
      })
    }

    if (isAdminOrMod && group && isPrivate) {
      tabs.push({
        to: `/groups/${group.get('id')}/requests`,
        title: 'Requests',
      }) 
    }

    if (isXS && group) {
      tabs.push({
        to: `/groups/${group.get('id')}/about`,
        title: 'About',
      })
    }

    // : todo :
    // {group.get('archived') && <Icon id='lock' title={intl.formatMessage(messages.group_archived)} />}

    return (
      <div className={[_s.d, _s.z1, _s.w100PC, _s.mb15].join(' ')}>
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.d, _s.boxShadowBlock, _s.bgPrimary].join(' ')}>
            <div className={[_s.d, _s.w100PC].join(' ')}>

              {
                coverSrc && !coverSrcMissing &&
                <Image className={_s.h200PX} src={coverSrc} alt={title} />
              }

              <div className={[_s.d, _s.w100PC].join(' ')}>

                <div className={[_s.d, _s.w100PC, _s.px15, _s.mt10, _s.py10].join(' ')}>
                  {children}
                </div>

                {
                  !!me &&
                  <div className={[_s.d, _s.flexRow, _s.jcCenter, _s.aiCenter, _s.mt5, _s.pb15, _s.pt5, _s.h100PC, _s.borderBottom1PX, _s.borderColorSecondary, _s.px15].join(' ')}>
                    <GroupActionButton
                      group={group}
                      relationships={relationships}
                    />
                    
                    <Button
                      color='primary'
                      backgroundColor='tertiary'
                      className={[_s.px10, _s.mr5, _s.ml5].join(' ')}
                      icon='ellipsis'
                      onClick={this.handleOnOpenGroupOptions}
                      buttonRef={this.setInfoBtn}
                    />
                  </div>
                }

                <div className={[_s.d, _s.flexRow, _s.h100PC, _s.mt5, _s.pt10, _s.pb5, _s.mb5, _s.px10].join(' ')}>

                  <Pills pills={tabs} />

                </div>
              </div>
            </div>
          </div>
        </Responsive>

        { /** desktop */}
        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.d, _s.boxShadowBlock, _s.bgPrimary, _s.bottomLeftRadiusSmall, _s.bottomRightRadiusSmall].join(' ')}>
            <div className={[_s.d, _s.w100PC].join(' ')}>

              {
                coverSrc && !coverSrcMissing &&
                <Image className={_s.h350PX} src={coverSrc} alt={title} />
              }
              
              <div className={[_s.d].join(' ')}>
                <div className={[_s.d, _s.flexRow, _s.py10, _s.px10].join(' ')}>
                  <div className={[_s.d, _s.w100PC].join(' ')}>
                    <div className={[_s.d, _s.flexRow].join(' ')}>
                      <Icon id='group' size='28px' />
                      <div className={[_s.d, _s.ml7, _s.flexNormal].join(' ')}>
                        <Heading>
                          {title}
                        </Heading>
                        {
                          !!slug &&
                          <Heading size='h4'>
                            {slug}
                          </Heading>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className={[_s.d, _s.h53PX, _s.w100PC].join(' ')}>
                  <div className={[_s.d, _s.flexRow, _s.h100PC, _s.px10].join(' ')}>
                    
                    <TabBar tabs={tabs} isLarge />

                    <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.h100PC, _s.mlAuto].join(' ')}>
                      {
                        !!me &&
                        <div className={[_s.d, _s.flexRow, _s.jcCenter, _s.aiCenter].join(' ')}>
                          <Button
                            iconSize='18px'
                            color='brand'
                            backgroundColor='none'
                            className={[_s.mr10, _s.px10].join(' ')}
                            icon={isShortcut ? 'star' : 'star-outline'}
                            onClick={this.handleToggleShortcut}
                          />  
                          <Button
                            color='primary'
                            backgroundColor='tertiary'
                            className={[_s.mr15, _s.px10].join(' ')}
                            icon='ellipsis'
                            onClick={this.handleOnOpenGroupOptions}
                            buttonRef={this.setInfoBtn}
                          />
                        </div>
                      }  

                      <GroupActionButton
                        group={group}
                        relationships={relationships}
                      />

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Responsive>
      </div>
    )
  }

}

const messages = defineMessages({
  removed_accounts: { id: 'groups.removed_accounts', defaultMessage: 'Removed Accounts' },
  group_archived: { id: 'group.detail.archived_group', defaultMessage: 'Archived group' },
  group_admin: { id: 'groups.detail.role_admin', defaultMessage: 'You\'re an admin' }
})

const mapStateToProps = (state, { group }) => {
  const groupId = group ? group.get('id') : null
  const shortcuts = state.getIn(['shortcuts', 'items'])
  const isShortcut = !!shortcuts.find((s) => {
    return s.get('shortcut_id') == groupId && s.get('shortcut_type') === 'group'
  })
  return { isShortcut }
}

const mapDispatchToProps = (dispatch, { intl }) => ({

  onOpenGroupOptions(targetRef, group, options) {
    dispatch(openPopover('GROUP_OPTIONS', {
      targetRef,
      group,
      ...options,
      position: 'left',
    }))
  },
  onAddShortcut(groupId) {
    dispatch(addShortcut('group', groupId))
  },
  onRemoveShortcut(groupId) {
    dispatch(removeShortcut(null, 'group', groupId))
  },

})

GroupHeader.propTypes = {
  group: ImmutablePropTypes.map,
  children: PropTypes.any,
  intl: PropTypes.object.isRequired,
  isShortcut: PropTypes.bool.isRequired,
  isXS: PropTypes.bool,
  onAddShortcut: PropTypes.func.isRequired,
  onRemoveShortcut: PropTypes.func.isRequired,
  onOpenGroupOptions: PropTypes.func.isRequired,
  relationships: ImmutablePropTypes.map,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GroupHeader))