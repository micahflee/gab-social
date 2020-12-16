import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me } from '../../initial_state'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import UserStat from '../user_stat'
import Dummy from '../dummy'
import ProfileStatsPanelPlaceholder from '../placeholder/profile_stats_panel_placeholder'
import ResponsiveClassesComponent from '../../features/ui/util/responsive_classes_component'

class ProfileStatsPanel extends ImmutablePureComponent {

  render() {
    const {
      intl,
      account,
      noPanel
    } = this.props

    const Wrapper = noPanel ? Dummy : PanelLayout

    return (
      <Wrapper>
        {
          !account && !noPanel &&
          <ProfileStatsPanelPlaceholder />
        }
        {
          !!account &&
          <ResponsiveClassesComponent
            classNames={[_s.d, _s.flexRow].join(' ')}
            classNamesXS={[_s.d, _s.flexRow, _s.mt15, _s.flexWrap].join(' ')}
          >
            <UserStat
              title={intl.formatMessage(messages.gabs)}
              value={shortNumberFormat(account.get('statuses_count'))}
              to={`/${account.get('acct')}`}
              isInline={noPanel}
            />
            <UserStat
              title={intl.formatMessage(messages.followers)}
              value={shortNumberFormat(account.get('followers_count'))}
              to={`/${account.get('acct')}/followers`}
              isInline={noPanel}
            />
            <UserStat
              isLast
              title={intl.formatMessage(messages.follows)}
              value={shortNumberFormat(account.get('following_count'))}
              to={`/${account.get('acct')}/following`}
              isInline={noPanel}
            />
          </ResponsiveClassesComponent>
        }
      </Wrapper>
    )
  }
}

const messages = defineMessages({
  gabs: { id: 'account.gabs', defaultMessage: 'Gabs' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Following' },
  likes: { id: 'likes', defaultMessage: 'Likes' },
})

ProfileStatsPanel.propTypes = {
  account: ImmutablePropTypes.map,
  intl: PropTypes.object.isRequired,
  noPanel: PropTypes.bool,
}

export default injectIntl(ProfileStatsPanel)