import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import Icon from '../icon'

const messages = defineMessages({
  title: { id: 'groups.sidebar-panel.title', defaultMessage: 'Groups you\'re in' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
  all: { id: 'groups.sidebar-panel.all', defaultMessage: 'All' },
  new_statuses: { id: 'groups.sidebar-panel.item.view', defaultMessage: 'new gabs' },
  no_recent_activity: { id: 'groups.sidebar-panel.item.no_recent_activity', defaultMessage: 'No recent activity' },
})

const mapStateToProps = (state) => ({
  groupIds: state.getIn(['group_lists', 'member']),
})

export default @connect(mapStateToProps)
@injectIntl
class GroupSidebarPanel extends ImmutablePureComponent {
  static propTypes = {
    groupIds: ImmutablePropTypes.list,
  }

  render() {
    const { intl, groupIds } = this.props
    const count = groupIds.count()

    if (count === 0) return null

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        button={(
          <NavLink
            to='/groups/browse/member'
            className={[styles.default, styles.fontWeightBold, styles.text, styles.colorBrand, styles.fontSize13PX, styles.noUnderline].join(' ')}
          >
            {intl.formatMessage(messages.all)}
          </NavLink>
        )}
      >
        <div className={styles.default}>
          {
            groupIds.slice(0, 6).map(groupId => (
              <GroupPanelItem key={`group-panel-item-${groupId}`} id={groupId} />
            ))
          }
          {
            count > 6 &&
            <NavLink
              to='/groups/browse/member'
              className={[styles.default, styles.noUnderline, styles.paddingVertical5PX, styles.marginRightAuto, styles.marginTop5PX, styles.marginLeftAuto, styles.cursorPointer, styles.circle, styles.text, styles.displayFlex, styles.colorBrand].join(' ')}
            >
              {intl.formatMessage(messages.show_all)}
            </NavLink>
          }
        </div>
      </PanelLayout>
    )
  }
}

const mapStateToProps2 = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
})

@connect(mapStateToProps2)
@injectIntl
class GroupPanelItem extends ImmutablePureComponent {
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

    const cx = classNames.bind(styles)

    const titleClasses = cx({
      default: 1,
      text: 1,
      displayFlex: 1,
      colorBrand: 1,
      fontSize14PX: 1,
      fontWeightBold: 1,
      lineHeight15: 1,
      underline: hovering,
    })

    return (
      <NavLink
        to={`/groups/${group.get('id')}`}
        className={[styles.default, styles.noUnderline, styles.marginTop5PX, styles.overflowHidden, styles.radiusSmall, styles.marginBottom10PX, styles.border1PX, styles.borderColorSubtle].join(' ')}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <div className={[styles.default, styles.height122PX].join(' ')}>
          <img
            src='https://gab.com/media/user/bz-5cf53d08403d4.jpeg'
            alt={group.get('title')}
            className={[styles.default, styles.objectFitCover, styles.height122PX, styles.width100PC].join(' ')}
          />
        </div>
        <div className={[styles.default, styles.paddingHorizontal10PX, styles.marginVertical5PX].join(' ')}>
          <span className={titleClasses}>
            {group.get('title')}
          </span>
          <span className={[styles.default, styles.text, styles.alignItemsCenter, styles.displayFlex, styles.flexRow, styles.colorSubtle, styles.fontSize13PX, styles.fontWeightNormal, styles.lineHeight15].join(' ')}>
            {
              unreadCount > 0 &&
              <Fragment>
                {shortNumberFormat(unreadCount)}
                &nbsp;
                {intl.formatMessage(messages.new_statuses)}
              </Fragment>
            }
            {
              unreadCount === 0 &&
              <Fragment>
                {intl.formatMessage(messages.no_recent_activity)}
              </Fragment>
            }
            <span className={[styles.marginLeftAuto, styles.inherit].join(' ')}>→</span>
          </span>
        </div>
      </NavLink>
    )
  }
}