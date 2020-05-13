import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import PopoverLayout from './popover_layout'
import AccountActionButton from '../account_action_button'
import Avatar from '../avatar'
import DisplayName from '../display_name'

export default class UserInfoPopover extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    isXS: PropTypes.bool,
  }

  render() {
    const { account, isXS } = this.props

    if (isXS) return null
    
    const content = !account ? null : { __html: account.get('note_emojified') }
    const to = !account ? '' : `/${account.get('acct')}`
    
    // : todo : is remote

    return (
      <PopoverLayout width={280}>
        <div className={[_s.default, _s.width100PC, _s.px15, _s.py15].join(' ')}>
          
          <div className={[_s.default, _s.flexRow].join(' ')}>
            <NavLink
              to={to}
              className={[_s.default, _s.noUnderline, _s.flexGrow1].join(' ')}
            >
              <Avatar account={account} size={42} noHover />
              <DisplayName account={account} isMultiline noHover />
            </NavLink>

            <div className={[_s.default, _s.mlAuto, _s.right0, _s.posAbs, _s.mt5].join(' ')}>
              <AccountActionButton account={account} />
            </div>
          </div>

          <div className={[_s.default, _s.mt10].join(' ')}>
            <div className={_s.dangerousContent} dangerouslySetInnerHTML={content} />
          </div>

        </div>
      </PopoverLayout>
    )
  }
}