import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { shortNumberFormat } from '../../utils/numbers'
import PopoverLayout from './popover_layout'
import Avatar from '../avatar'
import Button from '../button'
import DisplayName from '../display_name'
import Text from '../text'

export default class UserInfoPopover extends ImmutablePureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { account } = this.props

    const content = !account ? null : { __html: account.get('note_emojified') }

    return (
      <PopoverLayout>
        <div className={[_s.default, _s.px15, _s.py15].join(' ')} style={{width: '260px'}}>
          
          <div className={[_s.default, _s.flexRow].join(' ')}>
            <div className={[_s.default, _s.flexGrow1].join(' ')}>
              <Avatar account={account} size={42} />
              <DisplayName account={account} multiline noHover />
            </div>
            <div className={[_s.default, _s.marginLeftAuto].join(' ')}>
              <Button
                color='white'
              >
                <Text size='medium' weight='bold' color='inherit'>
                  Following
                </Text>
              </Button>
            </div>
          </div>

          <div className={[_s.default, _s.my10].join(' ')}>
            <div className={_s.dangerousContent} dangerouslySetInnerHTML={content} />
          </div>

          <div className={[_s.default, _s.flexRow].join(' ')}>
            <div>
              <Text size='small'>
                {shortNumberFormat(account.get('following_count'))}
                Following
              </Text>
            </div>
            <div>
              <Text size='small'>
                {shortNumberFormat(account.get('followers_count'))}
                Followers
              </Text>
            </div>
          </div>

        </div>
      </PopoverLayout>
    )
  }
}