import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { makeGetAccount } from '../../selectors'
import { fetchRelationships } from '../../actions/accounts'
import { shortNumberFormat } from '../../utils/numbers'
import { me } from '../../initial_state'
import PopoverLayout from './popover_layout'
import AccountActionButton from '../account_action_button'
import Avatar from '../avatar'
import DisplayName from '../display_name'
import UserStat from '../user_stat'

class UserInfoPopover extends ImmutablePureComponent {

  componentDidMount() {
    this.checkRelationships(this.props.account)
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props
    if (prevProps.account !== account) {
      this.checkRelationships(account)
    }
  }

  checkRelationships = (account) => {
    if (!account) return
    if (!account.get('relationship')) {
      this.props.onFetchRelationships(account.get('id'))
    }
  }

  render() {
    const { account, isXS } = this.props

    if (isXS || !me) return null
    
    const content = !account ? null : { __html: account.get('note_emojified') }
    const to = !account ? '' : `/${account.get('acct')}`

    return (
      <PopoverLayout width={280}>
        <div className={[_s.d, _s.w100PC, _s.px15, _s.py15].join(' ')} id='user-info-popover'>
          
          <div className={[_s.d, _s.flexRow].join(' ')}>
            <NavLink
              to={to}
              className={[_s.d, _s.noUnderline, _s.flexGrow1].join(' ')}
            >
              <Avatar account={account} size={42} noHover />
              <DisplayName account={account} isMultiline noHover />
            </NavLink>

            <div className={[_s.d, _s.mlAuto, _s.right0, _s.posAbs, _s.mt5].join(' ')}>
              <AccountActionButton account={account} />
            </div>
          </div>

          <div className={[_s.d, _s.mt10].join(' ')}>
            <div className={_s.dangerousContent} dangerouslySetInnerHTML={content} />
          </div>

          <div className={[_s.d, _s.flexRow, _s.mt10].join(' ')}>
            <UserStat
              title={<FormattedMessage id='account.followers' defaultMessage='Followers' />}
              value={shortNumberFormat(account.get('followers_count'))}
              to={`/${account.get('acct')}/followers`}
              isInline
            />
            <UserStat
              isLast
              title={<FormattedMessage id='account.follows' defaultMessage='Following' />}
              value={shortNumberFormat(account.get('following_count'))}
              to={`/${account.get('acct')}/following`}
              isInline
            />
          </div>

        </div>
      </PopoverLayout>
    )
  }
}

const mapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, props.accountId),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchRelationships(accountId) {
    dispatch(fetchRelationships([accountId]))
  },
})

UserInfoPopover.propTypes = {
  account: ImmutablePropTypes.map,
  accountId: PropTypes.string.isRequired,
  isXS: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoPopover)