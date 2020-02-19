import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import { shortNumberFormat } from '../utils/numbers'
import Image from './image'
import Text from './text'

const messages = defineMessages({
  new_statuses: { id: 'groups.sidebar-panel.item.view', defaultMessage: 'new gabs' },
  no_recent_activity: { id: 'groups.sidebar-panel.item.no_recent_activity', defaultMessage: 'No recent activity' },
})

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
})

export default
@connect(mapStateToProps)
@injectIntl
class GroupListItem extends ImmutablePureComponent {
  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const { intl, group, relationships } = this.props
    const { hovering } = this.state

    if (!relationships) return null

    const unreadCount = relationships.get('unread_count')
    
    const subtitle = unreadCount > 0 ? (
      <Fragment>
        {shortNumberFormat(unreadCount)}
        &nbsp;
        {intl.formatMessage(messages.new_statuses)}
      </Fragment>
    ) : intl.formatMessage(messages.no_recent_activity)

    return (
      <NavLink
        to={`/groups/${group.get('id')}`}
        className={[_s.default, _s.noUnderline, _s.marginTop5PX, _s.overflowHidden, _s.radiusSmall, _s.marginBottom10PX, _s.border1PX, _s.bordercolorSecondary, _s.backgroundSubtle_onHover].join(' ')}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <Image
          src={group.get('cover')}
          alt={group.get('title')}
          className={_s.height122PX}
        />
        <div className={[_s.default, _s.paddingHorizontal10PX, _s.marginVertical5PX].join(' ')}>
          <Text color='brand' weight='bold' underline={hovering}>
            {group.get('title')}
          </Text>
          <Text color='secondary' size='small' className={_s.marginVertical5PX}>
            {subtitle}
          </Text>
        </div>
      </NavLink>
    )
  }
}