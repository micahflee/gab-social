import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment-mini'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import Button from '../button'
import Divider from '../divider'
import Heading from '../heading'
import Icon from '../icon'
import Text from '../text'
import DotTextSeperator from '../dot_text_seperator'
import ProfileInfoPanelPlaceholder from '../placeholder/profile_info_panel_placeholder'

const messages = defineMessages({
  title: { id: 'about', defaultMessage: 'About' },
  members: { id: 'members', defaultMessage: 'Members' },
  created: { id: 'created', defaultMessage: 'Created' },
  category: { id: 'category', defaultMessage: 'Category' },
  tags: { id: 'tags', defaultMessage: 'Tags' },
  privateGroup: { id: 'group.private', defaultMessage: 'Private' },
  publicGroup: { id: 'group.public', defaultMessage: 'Public' },
  visibleGroup: { id: 'group.visible', defaultMessage: 'Visible' },
  invisibleGroup: { id: 'group.invisible', defaultMessage: 'Invisible' },
})

const mapStateToProps = (state, { group }) => {
  const groupId = group ? group.get('id') : -1
  const relationships = group === -1 ? null : state.getIn(['group_relationships', groupId])

  return { relationships }
}

export default
@injectIntl
@connect(mapStateToProps)
class GroupInfoPanel extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    noPanel: PropTypes.bool,
    relationships: ImmutablePropTypes.map,
  }

  render() {
    const {
      intl,
      group,
      noPanel,
      relationships,
    } = this.props

    if (!group && !noPanel) {
      return (
        <div title={intl.formatMessage(messages.title)}>
          <ProfileInfoPanelPlaceholder />
        </div>
      )
    }

    const isAdmin = relationships ? relationships.get('admin') : false
    const groupId = !!group ? group.get('id') : ''
    const slug = !!group ? !!group.get('slug') ? `g/${group.get('slug')}` : undefined : undefined
    const isPrivate = !!group ? group.get('is_private') : false
    const isVisible = !!group ? group.get('is_visible') : false
    const tags = !!group ? group.get('tags') : []

    if (noPanel) {
      return (
        <div className={[_s.default].join(' ')}>
          {
            !!group &&
            <Fragment>
              <Heading isCentered>
                {group.get('title')}
              </Heading>
              {
                !!slug &&
                <Text className={_s.mt5} size='small' color='secondary' align='center'>
                  {slug}
                </Text>
              }
              <Text className={[_s.mt10, _s.py2].join(' ')} color='secondary' size='small' align='center'>
                {group.get('description')}
              </Text>
              <div className={[_s.default, _s.mt10, _s.flexRow, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}>
                <Text color='secondary' size='small' align='center'>
                  <Icon
                    id={isPrivate ? 'lock-filled' : 'globe'}
                    size='10px'
                    className={_s.colorSecondary}
                  />
                  <span className={_s.ml5}>
                    {intl.formatMessage(isPrivate ? messages.privateGroup : messages.publicGroup)}
                  </span>
                </Text>
                <DotTextSeperator />
                <Text className={_s.ml5} color='secondary' size='small' align='center'>
                  {shortNumberFormat(group.get('member_count'))}
                  &nbsp;
                  {intl.formatMessage(messages.members)}
                </Text>
              </div>
            </Fragment>
          }
        </div>
      )
    }

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        {
          !!group &&
          <Fragment>

            <Text className={_s.mb5}>
              {group.get('description')}
            </Text>

            <Divider isSmall />

            <GroupInfoPanelRow
              title={intl.formatMessage(isPrivate ? messages.privateGroup : messages.publicGroup)}
              icon={isPrivate ? 'lock-filled' : 'globe'}
            >
              <Button
                isNarrow
                backgroundColor='secondary'
                color='secondary'
                className={[_s.px5, _s.py2].join(' ')}
              >
                <Text size='small' color='inherit' className={_s.px5}>?</Text>
              </Button>
            </GroupInfoPanelRow>

            <Divider isSmall />

            <GroupInfoPanelRow
              title={intl.formatMessage(isVisible ? messages.visibleGroup : messages.invisibleGroup)}
              icon={isVisible ? 'visible' : 'hidden'}
            >
              <Button
                isNarrow
                backgroundColor='secondary'
                color='secondary'
                className={[_s.px5, _s.py2].join(' ')}
              >
                <Text size='small' color='inherit' className={_s.px5}>?</Text>
              </Button>
            </GroupInfoPanelRow>
            
            <Divider isSmall />

            <GroupInfoPanelRow title={intl.formatMessage(messages.members)} icon='group'>
              <Button
                isText
                color={isAdmin ? 'brand' : 'primary'}
                backgroundColor='none'
                className={_s.mlAuto}
                to={isAdmin ? `/groups/${groupId}/members` : undefined}
              >
                <Text color='inherit' weight={isAdmin ? 'medium' : 'normal'} size='normal' className={isAdmin ? _s.underline_onHover : undefined}>
                  {shortNumberFormat(group.get('member_count'))}
                  &nbsp;
                  {intl.formatMessage(messages.members)}
                </Text>
              </Button>
            </GroupInfoPanelRow>

            <Divider isSmall />

            <GroupInfoPanelRow title={intl.formatMessage(messages.category)} icon='apps'>
              <Text>General</Text>
            </GroupInfoPanelRow>

            <Divider isSmall />

            <GroupInfoPanelRow title={intl.formatMessage(messages.created)} icon='calendar'>
              <Text>
                {moment(group.get('created_at')).format('LL')}
              </Text>
            </GroupInfoPanelRow>
            
            {
              !!tags &&
              <Fragment>
                <Divider isSmall />
                <GroupInfoPanelRow title={intl.formatMessage(messages.tags)} icon='shop'>
                  <div className={[_s.default, _s.flexRow, _s.justifyContentEnd, _s.flexWrap, _s.pl5].join(' ')}>
                    {
                      tags.map((tag) => (
                        <div className={[_s.mr5, _s.mb5].join(' ')}>
                          <Text size='small' className={[_s.bgSecondary, _s.radiusSmall, _s.px10, _s.py2, _s.lineHeight15].join(' ')}>
                            {tag}
                          </Text>
                        </div>
                      ))
                    }
                  </div>
                </GroupInfoPanelRow>
              </Fragment>
            }

          </Fragment>
        }
      </PanelLayout>
    )
  }
}

class GroupInfoPanelRow extends PureComponent {

  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
  }

  render() {
    const { icon, title } = this.props

    return (
      <div className={[_s.default, _s.flexRow, _s.py2].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.justifyContentCenter].join(' ')}>
          <Icon id={icon} size='16px' />
          <Text weight='bold' size='medium' className={_s.ml10}>
            {title}
          </Text>
        </div>
        <div className={_s.mlAuto}>
          {this.props.children}
        </div>  
      </div>
    )

  }

}