import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import classNames from 'classnames/bind'
import { shortNumberFormat } from '../utils/numbers'
import Image from './image'
import Text from './text'

const messages = defineMessages({
  members: { id: 'groups.card.members', defaultMessage: 'Members' },
  new_statuses: { id: 'groups.sidebar-panel.item.view', defaultMessage: 'new gabs' },
  no_recent_activity: { id: 'groups.sidebar-panel.item.no_recent_activity', defaultMessage: 'No recent activity' },
})

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
})

const cx = classNames.bind(_s)

export default
@connect(mapStateToProps)
@injectIntl
class GroupListItem extends ImmutablePureComponent {
  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
    slim: PropTypes.bool,
    isLast: PropTypes.bool,
  }

  static defaultProps = {
    slim: false,
    isLast: false,
  }

  render() {
    const { intl, group, relationships, slim, isLast } = this.props

    if (!relationships) return null

    const unreadCount = relationships.get('unread_count')

    const subtitle = unreadCount > 0 ? (
      <Fragment>
        {shortNumberFormat(unreadCount)}
        &nbsp;
        {intl.formatMessage(messages.new_statuses)}
      </Fragment>
    ) : intl.formatMessage(messages.no_recent_activity)

    const containerClasses = cx({
      default: 1,
      noUnderline: 1,
      overflowHidden: 1,
      backgroundSubtle_onHover: 1,
      borderColorSecondary: 1,
      radiusSmall: !slim,
      marginTop5PX: !slim,
      marginBottom10PX: !slim,
      border1PX: !slim,
      borderBottom1PX: slim && !isLast,
      flexRow: slim,
      paddingVertical5PX: slim,
    })

    const imageClasses = cx({
      height122PX: !slim,
      radiusSmall: slim,
      height72PX: slim,
      width72PX: slim,
      marginLeft15PX: slim,
    })

    const textContainerClasses = cx({
      default: 1,
      paddingHorizontal10PX: 1,
      marginTop5PX: 1,
      marginBottom10PX: !slim,
    })

    return (
      <NavLink
        to={`/groups/${group.get('id')}`}
        className={containerClasses}
      >
        <Image
          src={group.get('cover')}
          alt={group.get('title')}
          className={imageClasses}
        />

        <div className={textContainerClasses}>
          <Text color='brand' weight='bold'>
            {group.get('title')}
          </Text>

          {
            slim &&
            <Text color='secondary' size='small' className={_s.marginTop5PX}>
              {shortNumberFormat(group.get('member_count'))}
              &nbsp;
              {intl.formatMessage(messages.members)}
            </Text>
          }

          <Text color='secondary' size='small' className={_s.marginTop5PX}>
            {subtitle}
          </Text>

        </div>
      </NavLink>
    )
  }
}