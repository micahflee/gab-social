import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import classNames from 'classnames/bind'
import { openPopover, closePopover } from '../actions/popover'
import { initReport } from '../actions/reports'
import { openModal } from '../actions/modal'
import { unfollowModal, me } from '../initial_state'
import Avatar from './avatar'
import Button from './button'
import Block from './block'
import Icon from './icon'
import Image from './image'
import TabBar from './tab_bar'
import Text from './text'

const cx = classNames.bind(_s)

const messages = defineMessages({
  follow: { id: 'follow', defaultMessage: 'Follow' },
  unfollow: { id: 'unfollow', defaultMessage: 'Unfollow' },
  requested: { id: 'requested', defaultMessage: 'Requested' },
  unblock: { id: 'unblock', defaultMessage: 'Unblock' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
})

const mapDispatchToProps = (dispatch, { intl }) => ({

  openProfileOptionsPopover(props) {
    console.log('props:', props)
    dispatch(openPopover('PROFILE_OPTIONS', props))
  },

});

export default
@connect(null, mapDispatchToProps)
@injectIntl
class GroupHeader extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
  }

  
  render() {
    const { intl, relationships, group } = this.props

    const tabs = !group ? null : [
      {
        to: `/groups/${group.get('id')}`,
        title: 'Latest',
      },
      {
        to: `/groups/${group.get('id')}/pinned`,
        title: 'Pinned',
      },
      {
        to: `/groups/${group.get('id')}/popular`,
        title: 'Popular',
      },
    ]

    const coverSrc = !!group ? group.get('cover_image_url') : undefined
    const title = !!group ? group.get('title') : undefined

    return (
      <div className={[_s.default, _s.z1, _s.width100PC, _s.mb15].join(' ')}>
        <Block>
          <div className={[_s.default, _s.width100PC].join(' ')}>
            
            {
              !!coverSrc &&
              <Image className={_s.height350PX} src={coverSrc} alt={title} />
            }
            
            <div className={[_s.default, _s.height53PX, _s.width100PC].join(' ')}>
              <div className={[_s.default, _s.flexRow, _s.height100PC, _s.px10].join(' ')}>
                <TabBar tabs={tabs} />
                <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.height100PC, _s.mlAuto].join(' ')}>
                  <Button
                    color='primary'
                    backgroundColor='tertiary'
                    radiusSmall
                    className={_s.mr5}
                  >
                    <Text color='inherit' size='small'>
                      Leave/Join
                      </Text>
                  </Button>
                  <Button
                    color='primary'
                    backgroundColor='tertiary'
                    radiusSmall
                    className={_s.mr5}
                  >
                    <Text color='inherit' size='small'>
                      Share
                    </Text>
                  </Button>
                  <Button
                    radiusSmall
                    color='primary'
                    backgroundColor='tertiary'
                    className={_s.mr5}
                    icon='ellipsis'
                  />
                </div>
              </div>
            </div>
          </div>
        </Block>
      </div>
    )
  }

}