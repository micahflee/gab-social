import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../../initial_state'
import { makeGetAccount } from '../../selectors'
import { shortNumberFormat } from '../../utils/numbers'
import DisplayName from '../display_name'
import Avatar from '../avatar'
import Image from '../image'
import UserStat from '../user_stat'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  gabs: { id: 'account.posts', defaultMessage: 'Gabs' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' }
})

const mapStateToProps = state => {
  return {
    account: makeGetAccount()(state, me),
  }
}

export default
@connect(mapStateToProps)
@injectIntl
class UserPanel extends ImmutablePureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { account, intl } = this.props

    return (
      <PanelLayout noPadding>
        <Image
          className={_s.height122PX}
          src={account.get('header_static')}
        />

        <NavLink
          className={[_s.default, _s.flexRow, _s.py10, _s.px15, _s.noUnderline].join(' ')}
          to={`/${account.get('acct')}`}
        >
          <div className={[_s.default, _s.marginTopNeg30PX, _s.circle, _s.borderColorWhite, _s.border2PX].join(' ')}>
            <Avatar account={account} size={62} />
          </div>
          <div className={[_s.default, _s.ml15].join(' ')}>
            <DisplayName account={account} multiline />
          </div>
        </NavLink>

        <div className={[_s.default, _s.mb15, _s.mt5, _s.flexRow, _s.px15].join(' ')}>
          <UserStat
            to={`/${account.get('acct')}`}
            title={intl.formatMessage(messages.gabs)}
            value={shortNumberFormat(account.get('statuses_count'))}
          />
          <UserStat
            to={`/${account.get('acct')}/followers`}
            title={intl.formatMessage(messages.followers)}
            value={shortNumberFormat(account.get('followers_count'))}
          />
          <UserStat
            to={`/${account.get('acct')}/following`}
            title={intl.formatMessage(messages.follows)}
            value={shortNumberFormat(account.get('following_count'))}
          />
        </div>
      </PanelLayout>
    )
  }
}