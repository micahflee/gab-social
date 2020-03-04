import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me } from '../../initial_state'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import UserStat from '../user_stat'

const messages = defineMessages({
  gabs: { id: 'account.gabs', defaultMessage: 'Gabs' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
  favorites: { id: 'navigation_bar.favorites', defaultMessage: 'Favorites' },
})

export default
@injectIntl
class ProfileStatsPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl, account } = this.props

    if (!account) return null

    return (
      <PanelLayout>
        {
          !!account &&
          <div className={[_s.default, _s.flexRow].join(' ')}>
            <UserStat
              title={intl.formatMessage(messages.gabs)}
              value={shortNumberFormat(account.get('statuses_count'))}
              to={`/${account.get('acct')}`}
            />
            <UserStat
              title={intl.formatMessage(messages.follows)}
              value={shortNumberFormat(account.get('following_count'))}
              to={`/${account.get('acct')}/following`}
            />
            <UserStat
              title={intl.formatMessage(messages.followers)}
              value={shortNumberFormat(account.get('followers_count'))}
              to={`/${account.get('acct')}/followers`}
            />
            {
              account.get('id') === me &&
              <UserStat
                title={intl.formatMessage(messages.favorites)}
                value={shortNumberFormat(account.get('favourite_count'))} /* : todo : */
                to={`/${account.get('acct')}/favorites`}
              />
            }
          </div>
        }
      </PanelLayout>
    )
  }
}