import React from 'react'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { openPopover, closePopover } from '../actions/popover'
import { openModal } from '../actions/modal'
import { joinGroup, leaveGroup } from '../actions/groups'
import {
  PLACEHOLDER_MISSING_HEADER_SRC,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { me } from '../initial_state'
import Responsive from '../features/ui/util/responsive_component'
import Button from './button'
import Block from './block'
import Heading from './heading'
import Image from './image'
import Icon from './icon'
import TabBar from './tab_bar'
import Pills from './pills'
import Text from './text'

const messages = defineMessages({
  join: { id: 'groups.join', defaultMessage: 'Join group' },
  member: { id: 'groups.member', defaultMessage: 'Member' },
  removed_accounts: { id: 'groups.removed_accounts', defaultMessage: 'Removed Accounts' },
  group_archived: { id: 'group.detail.archived_group', defaultMessage: 'Archived group' },
  group_admin: { id: 'groups.detail.role_admin', defaultMessage: 'You\'re an admin' }
})

const mapDispatchToProps = (dispatch, { intl }) => ({

  onToggleMembership(group, relationships) {
    if (relationships.get('member')) {
      dispatch(leaveGroup(group.get('id')));
    } else {
      dispatch(joinGroup(group.get('id')));
    }
  },

  onOpenGroupOptions(targetRef, group, isAdmin) {
    dispatch(openPopover('GROUP_OPTIONS', {
      targetRef,
      group,
      isAdmin,
      position: 'left',
    }))
  },

});

export default
@connect(null, mapDispatchToProps)
@injectIntl
class GroupHeader extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    children: PropTypes.any,
    intl: PropTypes.object.isRequired,
    isXS: PropTypes.bool,
    onToggleMembership: PropTypes.func.isRequired,
    onOpenGroupOptions: PropTypes.func.isRequired,
    relationships: ImmutablePropTypes.map,
  }

  handleOnToggleMembership = () => {
    const { group, relationships } = this.props
    this.props.onToggleMembership(group, relationships);
  }

  handleOnOpenGroupOptions = () => {
    const { relationships } = this.props
    const isAdmin = !!relationships ? relationships.get('admin') : false
    this.props.onOpenGroupOptions(this.infoBtn, this.props.group, isAdmin)
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
      relationships,
    } = this.props

    const coverSrc = !!group ? group.get('cover_image_url') : ''
    const coverSrcMissing = coverSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1 || !coverSrc
    const title = !!group ? group.get('title') : undefined
    const slug = !!group ? !!group.get('slug') ? `g/${group.get('slug')}` : undefined : undefined

    let isAdmin = false
    let actionButtonTitle
    let actionButtonOptions = {}
    if (relationships) {
      isAdmin = relationships.get('admin')
      const isMember = relationships.get('member')

      actionButtonTitle = intl.formatMessage(isMember ? messages.member : messages.join)
      actionButtonOptions = {
        isOutline: !isMember,
        backgroundColor: isMember ? 'brand' : 'none',
        color: isMember ? 'white' : 'brand',
      }
    }

    const tabs = !group ? [] : [
      {
        to: `/groups/${group.get('id')}`,
        title: 'Timeline',
      },
      // {
      //   to: `/groups/${group.get('id')}/media`,
      //   title: 'Media',
      // },
    ]

    if (isAdmin && group) {
      tabs.push({
        to: `/groups/${group.get('id')}/members`,
        title: 'Members',
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
      <div className={[_s.default, _s.z1, _s.width100PC, _s.mb15].join(' ')}>
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.boxShadowBlock, _s.bgPrimary].join(' ')}>
            <div className={[_s.default, _s.width100PC].join(' ')}>

              {
                coverSrc && !coverSrcMissing &&
                <Image className={_s.height200PX} src={coverSrc} alt={title} />
              }

              <div className={[_s.default, _s.width100PC].join(' ')}>

                <div className={[_s.default, _s.width100PC, _s.px15, _s.mt10, _s.py10].join(' ')}>
                  {children}
                </div>

                {
                  !!me &&
                  <div className={[_s.default, _s.flexRow, _s.justifyContentCenter, _s.alignItemsCenter, _s.mt5, _s.pb15, _s.pt5, _s.height100PC, _s.borderBottom1PX, _s.borderColorSecondary, _s.px15].join(' ')}>
                    {
                      !!actionButtonTitle &&
                      <Button
                        className={_s.mr5}
                        onClick={this.handleOnToggleMembership}
                        {...actionButtonOptions}
                      >
                        <Text color='inherit' size='medium' weight='bold' className={_s.px10}>
                          {actionButtonTitle}
                        </Text>
                      </Button>
                    }
                    
                    <Button
                      color='primary'
                      backgroundColor='tertiary'
                      className={[_s.px10, _s.mr5].join(' ')}
                      icon='ellipsis'
                      onClick={this.handleOnOpenGroupOptions}
                      buttonRef={this.setInfoBtn}
                    />
                  </div>
                }

                <div className={[_s.default, _s.flexRow, _s.height100PC, _s.mt5, _s.pt10, _s.pb5, _s.mb5, _s.px10].join(' ')}>

                  <Pills pills={tabs} />

                </div>
              </div>
            </div>
          </div>
        </Responsive>

        { /** desktop */}
        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.boxShadowBlock, _s.bgPrimary, _s.bottomLeftRadiusSmall, _s.bottomRightRadiusSmall].join(' ')}>
            <div className={[_s.default, _s.width100PC].join(' ')}>

              {
                coverSrc && !coverSrcMissing &&
                <Image className={_s.height350PX} src={coverSrc} alt={title} />
              }
              
              <div className={[_s.default].join(' ')}>
                <div className={[_s.default, _s.flexRow, _s.py10, _s.px10].join(' ')}>
                  <div className={[_s.default, _s.width100PC].join(' ')}>
                    <div className={[_s.default, _s.flexRow].join(' ')}>
                      <Icon id='group' size='28px' />
                      <div className={[_s.default, _s.ml7, _s.flexNormal].join(' ')}>
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
                <div className={[_s.default, _s.height53PX, _s.width100PC].join(' ')}>
                  <div className={[_s.default, _s.flexRow, _s.height100PC, _s.px10].join(' ')}>
                    
                    <TabBar tabs={tabs} isLarge />

                    <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.height100PC, _s.mlAuto].join(' ')}>
                      {
                        !!me &&
                        <div className={[_s.default, _s.flexRow, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}>
                          <Button
                            iconSize='18px'
                            color='brand'
                            backgroundColor='none'
                            className={[_s.mr10, _s.px10].join(' ')}
                            icon='star-outline'
                            onClick={this.handleOnOpenGroupOptions}
                            buttonRef={this.setInfoBtn}
                          />  
                          <Button
                            color='primary'
                            backgroundColor='tertiary'
                            className={[_s.mr10, _s.px10].join(' ')}
                            icon='ellipsis'
                            onClick={this.handleOnOpenGroupOptions}
                            buttonRef={this.setInfoBtn}
                          />
                        </div>
                      }  
                      {
                        !!actionButtonTitle &&
                        <Button
                          className={_s.mr5}
                          onClick={this.handleOnToggleMembership}
                          {...actionButtonOptions}
                        >
                          <Text color='inherit' size='medium' weight='bold' className={_s.px10}>
                            {actionButtonTitle}
                          </Text>
                        </Button>
                      }
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