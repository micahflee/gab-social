import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import moment from 'moment-mini'
import { openPopover } from '../actions/popover'
import { openModal } from '../actions/modal'
import { me } from '../initial_state'
import { CX } from '../constants'
import RelativeTimestamp from './relative_timestamp'
import DisplayName from './display_name'
import Text from './text'
import DotTextSeperator from './dot_text_seperator'
import Icon from './icon'
import Button from './button'
import Avatar from './avatar'

class StatusHeader extends ImmutablePureComponent {

  handleOpenStatusOptionsPopover = () => {
    this.props.onOpenStatusOptionsPopover(this.statusOptionsButton, this.props.status)
  }

  handleOpenStatusEdits = () => {
    this.props.onOpenStatusRevisionsPopover(this.props.status)
  }

  handleOnOpenStatusModal = () => {
    if (!!this.props.onOpenStatusModal) {
      this.props.onOpenStatusModal(this.props.status)
    }
  }

  setStatusOptionsButton = n => {
    this.statusOptionsButton = n
  }

  render() {
    const {
      intl,
      reduced,
      status,
      isCompact,
    } = this.props

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`

    const containerClasses = CX({
      d: 1,
      px15: 1,
      py10: !reduced,
      pb10: reduced,
    })

    const avatarSize = reduced ? 20 : isCompact ? 38 : 46

    const visibility = status.get('visibility')

    let visibilityIcon
    let visibilityText
    
    if (visibility === 'private') {
      visibilityIcon = 'lock-filled'
      visibilityText = intl.formatMessage(messages.private_long)
    } else if (visibility === 'unlisted') {
      visibilityIcon = 'unlock-filled'
      visibilityText = `${intl.formatMessage(messages.unlisted_short)} - ${intl.formatMessage(messages.unlisted_long)}`
    } else if (visibility === 'private_group') {
      visibilityIcon = 'group'
      visibilityText = intl.formatMessage(messages.private_group)
    } else {
      visibilityIcon = 'globe'
      visibilityText = `${intl.formatMessage(messages.public_short)} - ${intl.formatMessage(messages.public_long)}`
    }

    const expirationDate = status.get('expires_at')
    let timeUntilExpiration
    if (!!expirationDate) {
      timeUntilExpiration = moment(expirationDate).fromNow()
    }

    const textContainerClasses = CX({
      d: 1,
      aiStart: 1,
      flex1: 1,
      overflowHidden: 1,
      mt5: !isCompact,
    })

    return (
      <div className={containerClasses}>
        <div className={[_s.d, _s.flexRow, _s.mt5].join(' ')}>

          {
            !reduced &&
            <NavLink
              to={`/${status.getIn(['account', 'acct'])}`}
              title={status.getIn(['account', 'acct'])}
              className={[_s.d, _s.mr10].join(' ')}
            >
              <Avatar account={status.get('account')} size={avatarSize} />
            </NavLink>
          }

          <div className={textContainerClasses}>

            <div className={[_s.d, _s.flexRow, _s.w100PC, _s.aiStart, _s.overflowHidden].join(' ')}>
              <NavLink
                className={[_s.d, _s.flexRow, _s.aiStart, _s.noUnderline, _s.flex1, _s.maxW100PC30PX].join(' ')}
                to={`/${status.getIn(['account', 'acct'])}`}
                title={status.getIn(['account', 'acct'])}
              >
                <div className={[_s.d, _s.w100PC, _s.overflowHidden].join(' ')}>
                  <DisplayName account={status.get('account')} noRelationship />
                </div>
              </NavLink>

              {
                !reduced && !!me &&
                <Button
                  isText
                  backgroundColor='none'
                  color='none'
                  icon='ellipsis'
                  iconSize='20px'
                  iconClassName={_s.cSecondary}
                  className={[_s.mlAuto].join(' ')}
                  onClick={this.handleOpenStatusOptionsPopover}
                  buttonRef={this.setStatusOptionsButton}
                />
              }
            </div>

            <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.lineHeight15].join(' ')}>
              <Button
                isText
                underlineOnHover
                backgroundColor='none'
                color='none'
                to={isCompact ? undefined : statusUrl}
                onClick={isCompact ? this.handleOnOpenStatusModal : undefined}
              >
                <Text size='small' color='secondary'>
                  <RelativeTimestamp timestamp={status.get('created_at')} />
                </Text>
              </Button>

              <DotTextSeperator />
              
              <span title={visibilityText} className={[_s.d, _s.displayInline, _s.ml5].join(' ')}>
                <Icon id={visibilityIcon} size='12px' className={[_s.d, _s.cSecondary].join(' ')} />
              </span>

              {
                !!status.get('expires_at') &&
                <React.Fragment>
                  <DotTextSeperator />
                  <span title={intl.formatMessage(messages.expirationMessage, {
                    time: timeUntilExpiration,
                  })} className={[_s.d, _s.displayInline, _s.ml5].join(' ')}>
                    <Icon id='stopwatch' size='13px' className={[_s.d, _s.cSecondary].join(' ')} />
                  </span>
                </React.Fragment>
              }

              {
                !!status.get('group') &&
                <React.Fragment>
                  <DotTextSeperator />
                  <Button
                    isText
                    underlineOnHover
                    backgroundColor='none'
                    color='none'
                    to={`/groups/${status.getIn(['group', 'id'])}`}
                    className={_s.ml5}
                  >
                    <Text size='small' color='secondary'>
                      {status.getIn(['group', 'title'])}
                    </Text>
                  </Button>
                </React.Fragment>
              }

              {
                status.get('revised_at') !== null &&
                <React.Fragment>
                  <DotTextSeperator />
                  <Button
                    isText
                    underlineOnHover
                    backgroundColor='none'
                    color='none'
                    onClick={this.handleOpenStatusEdits}
                    className={_s.ml5}
                  >
                    <Text size='small' color='secondary'>
                      {intl.formatMessage(messages.edited)}
                    </Text>
                  </Button>
                </React.Fragment>
              }

            </div>
          </div>
        </div>
      </div>
    )
  }

}

const messages = defineMessages({
  edited: { id: 'status.edited', defaultMessage: 'Edited' },
  expirationMessage: { id: 'status.expiration_message', defaultMessage: 'This status expires {time}' },
  public_short: { id: 'privacy.public.short', defaultMessage: 'Public' },
  public_long: { id: 'privacy.public.long', defaultMessage: 'Visible for anyone on or off Gab' },
  unlisted_short: { id: 'privacy.unlisted.short', defaultMessage: 'Unlisted' },
  unlisted_long: { id: 'privacy.unlisted.long', defaultMessage: 'Do not show in public timelines' },
  private_long: { id: 'privacy.private.long', defaultMessage: 'Visible for your followers only' },
  private_group: { id: 'privacy.private.group', defaultMessage: 'Private group post that is visible for only members of this group' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenStatusRevisionsPopover(status) {
    dispatch(openModal('STATUS_REVISIONS', {
      status,
    }))
  },

  onOpenStatusOptionsPopover(targetRef, status) {
    dispatch(openPopover('STATUS_OPTIONS', {
      targetRef,
      statusId: status.get('id'),
      position: 'left-start',
    }))
  },
})

StatusHeader.propTypes = {
  intl: PropTypes.object.isRequired,
  status: ImmutablePropTypes.map,
  onOpenStatusRevisionsPopover: PropTypes.func.isRequired,
  onOpenStatusOptionsPopover: PropTypes.func.isRequired,
  onOpenStatusModal: PropTypes.func.isRequired,
  reduced: PropTypes.bool,
  isCompact: PropTypes.bool,
}

export default injectIntl(connect(null, mapDispatchToProps)(StatusHeader))