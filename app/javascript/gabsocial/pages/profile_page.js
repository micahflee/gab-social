import React from 'react'
import { FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchAccountByUsername } from '../actions/accounts'
import { makeGetAccount } from '../selectors'
import { me } from '../initial_state'
import PageTitle from '../features/ui/util/page_title'
import ColumnIndicator from '../components/column_indicator'
import Block from '../components/block'
import ProfileLayout from '../layouts/profile_layout'

class ProfilePage extends ImmutablePureComponent {

  componentDidMount() {
    this.props.dispatch(fetchAccountByUsername(this.props.params.username))
  }

  render() {
    const {
      account,
      children,
      unavailable,
      noSidebar,
      params: { username },
    } = this.props

    const nameHTML = !!account ? account.get('display_name_html') : ''
    const name = !!account ? account.get('display_name_plain') : ''
    
    return (
      <ProfileLayout
        account={account}
        titleHTML={nameHTML}
        unavailable={unavailable}
        noSidebar={noSidebar}
      >
        <PageTitle path={`${name} (@${username})`} />
        {
          !unavailable &&
          React.cloneElement(children, {
            account,
          })
        }
        {
          unavailable &&
          <Block>
            <ColumnIndicator type='error' message={
              <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />
            } />
          </Block>
        }
      </ProfileLayout>
    )
  }

}

const mapStateToProps = (state, { params: { username } }) => {
  const accounts = state.getIn(['accounts'])
  const account = accounts.find(acct => username.toLowerCase() === acct.getIn(['acct'], '').toLowerCase())

  const accountId = !!account ? account.get('id') : -1
  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false)
  const isLocked = state.getIn(['accounts', accountId, 'locked'], false)
  const isFollowing = state.getIn(['relationships', accountId, 'following'], false)

  const unavailable = (me === accountId) ? false : (isBlocked || (isLocked && !isFollowing))

  const getAccount = makeGetAccount()

  return {
    unavailable,
    account: accountId !== -1 ? getAccount(state, accountId) : null,
  }
}

ProfilePage.propTypes = {
  account: ImmutablePropTypes.map,
  children: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
  noSidebar: PropTypes.bool,
  params: PropTypes.object.isRequired,
  unavailable: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(ProfilePage)