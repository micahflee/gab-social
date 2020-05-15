import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import { CX } from '../constants'
import { PLACEHOLDER_MISSING_HEADER_SRC } from '../constants'
import { shortNumberFormat } from '../utils/numbers'
import Image from './image'
import Text from './text'

const messages = defineMessages({
  members: { id: 'groups.card.members', defaultMessage: 'Members' },
})

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
})

export default
@connect(mapStateToProps)
@injectIntl
class GroupListItem extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    slim: PropTypes.bool,
    isLast: PropTypes.bool,
    isHidden: PropTypes.bool,
  }

  static defaultProps = {
    slim: false,
    isLast: false,
  }

  render() {
    const {
      intl,
      group,
      slim,
      isLast,
      isHidden,
    } = this.props

    if (!group) return null

    if (isHidden) {
      return (
        <Fragment>
          {group.get('title')}
        </Fragment>
      )
    }
    
    const containerClasses = CX({
      default: 1,
      noUnderline: 1,
      overflowHidden: 1,
      bgSubtle_onHover: 1,
      borderColorSecondary: 1,
      radiusSmall: !slim,
      mb10: !slim && !isLast,
      border1PX: !slim,
      borderBottom1PX: slim && !isLast,
      flexRow: slim,
      py5: slim,
    })

    const imageClasses = CX({
      height122PX: !slim,
      radiusSmall: slim,
      height72PX: slim,
      width72PX: slim,
      ml15: slim,
    })

    const textContainerClasses = CX({
      default: 1,
      px10: 1,
      mt5: 1,
      flexShrink1: slim,
      mb10: !slim,
    })

    const coverSrc = group.get('cover_image_url') || ''
    const coverMissing = coverSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1 || !coverSrc

    return (
      <NavLink
        to={`/groups/${group.get('id')}`}
        className={containerClasses}
      >

        {
          (!!coverSrc || slim) && !coverMissing &&
          <Image
            src={coverSrc}
            alt={group.get('title')}
            className={imageClasses}
          />
        }

        <div className={textContainerClasses}>
          <Text color='brand' weight='bold'>
            {group.get('title')}
          </Text>

          {
            slim &&
            <Text color='secondary' size='small' className={_s.mt5}>
              {shortNumberFormat(group.get('member_count'))}
              &nbsp;
              {intl.formatMessage(messages.members)}
            </Text>
          }

        </div>
      </NavLink>
    )
  }

}